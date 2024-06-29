import noop from '@jswork/noop';
import ReactList, { ReactListProps } from '@jswork/react-list';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import fdp from 'fast-deep-equal';
import EventMitt, { EventMittNamespace } from '@jswork/event-mitt';

const CLASS_NAME = 'react-interactive-list';
const eventBus = Object.assign({}, EventMitt) as ReactInteractiveListEvent;

type ReactInteractiveListEvent = EventMittNamespace.EventMitt;
type StdEventTarget = { target: { value: any } };
type StdCallback = (inEvent: StdEventTarget) => void;
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
  items: any[];
  /**
   * The data item template.
   */
  template: TemplateCallback;
  /**
   * The action of `create` component.
   */
  templateCreate: (...args) => React.ReactNode;
  /**
   * The empty create template.
   */
  templateDefault: () => React.ReactNode;
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
   * The children reverse order.
   */
  reverse?: boolean;
  /**
   * The props for react-list.
   */
  listProps?: ReactListProps;
} & HTMLAttributes<any>;

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
    items: [],
    template: noop,
    templateCreate: noop,
    templateDefault: noop,
    onChange: noop,
    onError: noop,
    reverse: false
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

  get createView() {
    const { value } = this.state;
    const { templateCreate } = this.props;
    const _value = value.slice(0);
    return templateCreate({ items: _value }, this.add);
  }

  get calcChildView() {
    const { reverse } = this.props;
    const items = reverse ? [this.createView, this.listView] : [this.listView, this.createView];
    return React.Children.map(items, (item) => item);
  }

  constructor(inProps: ReactInteractiveListProps) {
    super(inProps);
    const { items, harmony, name } = inProps;
    const ctx = window['nx'];

    this.state = { value: [...items] };

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
    if (value.length < initial!) {
      const _value = value.slice(0);
      for (let i = 0; i < initial! - value.length; i++) {
        _value.push(this.props.templateDefault());
      }
      this.handleChange(_value);
    }
  };

  /* ----- public eventBus methods ----- */
  add = () => {
    const { value } = this.state;
    const { templateDefault } = this.props;
    const _value = value.slice(0);
    if (this.isGteMax) return;
    _value.push(templateDefault());
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

  shouldComponentUpdate(inProps: ReactInteractiveListProps) {
    const { items } = inProps;
    const isEqual = fdp(this.state.value, items);
    if (!isEqual) {
      this.setState({ value: [...items] });
    }
    return true;
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
    const target = { value: inValue };
    this.setState(target, () => {
      onChange({ target });
      this.length < min && onError({ target: { value: 'EQ_MIN' } });
      this.length > max && onError({ target: { value: 'EQ_MAX' } });
    });
  };

  render() {
    const {
      className,
      harmony,
      reverse,
      listProps,
      forwardedRef,
      initial,
      min,
      max,
      items,
      template,
      templateCreate,
      templateDefault,
      onChange,
      onError,
      ...props
    } = this.props;

    return (
      <div className={cx(CLASS_NAME, className)} ref={forwardedRef} {...props}>
        {this.calcChildView}
      </div>
    );
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactInteractiveList {...props} ref={ref} />;
});
