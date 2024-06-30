import noop from '@jswork/noop';
import ReactList, { ReactListProps } from '@jswork/react-list';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import fdp from 'fast-deep-equal';
import EventMitt, { EventMittNamespace } from '@jswork/event-mitt';

const CLASS_NAME = 'react-interactive-list';
const eventBus = Object.assign({}, EventMitt) as ReactInteractiveListEvent;

type ReactInteractiveListEvent = EventMittNamespace.EventMitt;
type StdCallback = (value: any) => void;
type TemplateCallback = (
  item: { item: any; index: number; items: any[] },
  cb: any
) => React.ReactNode;

export type ReactInteractiveListProps = {
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * The identity name.
   */
  name?: string;
  /**
   * If use harmony mode.
   */
  harmony?: boolean;
  /**
   * The initial size.
   */
  initial?: number;
  /**
   * The minimum size.
   */
  min: number;
  /**
   * The max size.
   */
  max: number;
  /**
   * The data source.
   */
  value: any[];
  /**
   * The data item template.
   */
  template: TemplateCallback;
  /**
   * The empty create template.
   */
  defaults: () => any;
  /**
   * The change handler.
   */
  onChange: StdCallback;
  /**
   * When trigger max/min boundary.
   */
  onError: StdCallback;
  /**
   * Forwards a ref to the underlying div element.
   */
  forwardedRef: any;
  /**
   * The props for react-list.
   */
  listProps?: ReactListProps;
} & HTMLAttributes<HTMLDivElement>;

interface ReactInteractiveListState {
  value: any[];
}

class ReactInteractiveList extends Component<ReactInteractiveListProps, ReactInteractiveListState> {
  static displayName = CLASS_NAME;
  static defaultProps = {
    name: '@',
    harmony: false,
    initial: 0,
    min: 0,
    max: 100,
    value: [],
    template: noop,
    defaults: noop,
    onChange: noop,
    onError: noop
  };

  get length() {
    const { value } = this.state;
    return value.length;
  }

  get isLteMin() {
    const { min } = this.props;
    return this.length <= min;
  }

  get isGteMax() {
    const { max } = this.props;
    return this.length >= max;
  }

  get listView() {
    const { value } = this.state;
    const { listProps } = this.props;
    const props = {
      items: value,
      template: this.template,
      ...listProps
    };
    return <ReactList {...props} />;
  }

  constructor(inProps: ReactInteractiveListProps) {
    super(inProps);
    const { value, harmony, name } = inProps;
    const ctx = window['nx'];

    this.state = { value: [...value] };

    //event bus
    eventBus.on(`${name}:add`, this.add);
    eventBus.on(`${name}:remove`, this.remove);
    eventBus.on(`${name}:set`, this.set);
    eventBus.on(`${name}:up`, this.up);
    eventBus.on(`${name}:down`, this.down);
    eventBus.on(`${name}:clear`, this.clear);
    eventBus.on(`${name}:notify`, this.notify);

    // detect harmony
    if (ctx && harmony) {
      ctx.set(ctx, `$ilist.event`, eventBus);
    }
  }

  private checkInitial = () => {
    const { initial } = this.props;
    const { value } = this.state;
    if (!initial) return;
    if (value.length < initial) {
      const _value = value.slice(0);
      for (let i = 0; i < initial - value.length; i++) {
        _value.push(this.props.defaults());
      }
      this.handleChange(_value);
    }
  };

  /* ----- public eventBus methods ----- */
  add = () => {
    const { value } = this.state;
    const { defaults } = this.props;
    const _value = value.slice(0);
    if (this.isGteMax) return;
    _value.push(defaults());
    this.handleChange(_value);
  };

  remove = (inIndex: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    if (this.isLteMin) return;
    _value.splice(inIndex, 1);
    this.handleChange(_value);
  };

  set = (inValue: any[]) => {
    this.handleChange(inValue);
  };

  up = (inIndex: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    if (inIndex === 0) return;
    const temp = _value[inIndex - 1];
    _value[inIndex - 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.handleChange(_value);
  };

  down = (inIndex: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    if (inIndex === _value.length - 1) return;
    const temp = _value[inIndex + 1];
    _value[inIndex + 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.handleChange(_value);
  };

  clear = () => {
    this.handleChange([]);
  };

  notify = () => {
    const { value } = this.state;
    this.handleChange(value);
  };

  /* ----- public eventBus methods ----- */

  componentDidUpdate() {
    const { value, onChange } = this.props;
    const { value: stateValue } = this.state;
    const isEqual = fdp(value, stateValue);
    if (value !== undefined && !isEqual) {
      this.setState({ value });
      onChange?.(value);
    }
  }


  componentDidMount() {
    this.checkInitial();
  }

  componentWillUnmount() {
    const { name } = this.props;
    eventBus.off(`${name}:add`, this.add);
    eventBus.off(`${name}:remove`, this.remove);
    eventBus.off(`${name}:set`, this.set);
    eventBus.off(`${name}:up`, this.up);
    eventBus.off(`${name}:down`, this.down);
    eventBus.off(`${name}:clear`, this.clear);
    eventBus.off(`${name}:notify`, this.notify);
  }

  template = ({ item, index }) => {
    const { template } = this.props;
    const { value } = this.state;
    const _value = value.slice();
    const cb = () => this.remove(index);
    return template({ item, index, items: _value }, cb);
  };

  handleChange = (inValue: any[]) => {
    const { onChange, onError, min, max } = this.props;
    this.setState({ value: inValue }, () => {
      onChange(inValue);
      this.length < min && onError('EQ_MIN');
      this.length > max && onError('EQ_MAX');
    });
  };

  render() {
    const {
      className,
      harmony,
      listProps,
      forwardedRef,
      initial,
      min,
      max,
      value,
      template,
      defaults,
      onChange,
      onError,
      ...props
    } = this.props;

    return (
      <div className={cx(CLASS_NAME, className)} ref={forwardedRef} {...props}>
        {this.listView}
      </div>
    );
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactInteractiveList {...props} ref={ref} />;
});
