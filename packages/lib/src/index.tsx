import ReactList, { ReactListProps } from '@jswork/react-list';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import fdp from 'fast-deep-equal';
import type { EventMittNamespace } from '@jswork/event-mitt';
import { ReactHarmonyEvents } from '@jswork/harmony-events';

const CLASS_NAME = 'react-interactive-list';
const EMPTY_ARGS = { items: [], item: null, index: -1, options: null };

type OnChangeCallbackOptions = {
  name?: string;
  options: any;
  action: string;
  oldValue: any[];
  newValue: any[];
  [key: string]: any;
};

type StdCallback = (value: any) => void;
type OnChangeCallback = (value: any, options?: OnChangeCallbackOptions) => void;

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
  template: ReactListProps['template'];
  /**
   * The empty template.
   */
  templateEmpty?: ReactListProps['templateEmpty'];
  /**
   * The extra options for template function.
   */
  options?: any;
  /**
   * The empty create template.
   */
  defaults: () => any;
  /**
   * The change handler.
   */
  onChange?: OnChangeCallback;
  /**
   * When trigger max/min boundary.
   */
  onError?: StdCallback;
  /**
   * Forwards a ref to the underlying div element.
   */
  forwardedRef?: any;
  /**
   * The props for react-list.
   */
  listProps?: ReactListProps;
} & HTMLAttributes<HTMLDivElement>;

interface ReactInteractiveListState {
  value: any[];
}

class ReactInteractiveList extends Component<ReactInteractiveListProps, ReactInteractiveListState> {
  private harmonyEvents: ReactHarmonyEvents | null = null;
  static displayName = CLASS_NAME;
  static event: EventMittNamespace.EventMitt;
  static events = [
    'add',
    'remove',
    'cancel',
    'set',
    'up',
    'down',
    'top',
    'bottom',
    'clear',
    'notify',
    'change',
  ];
  static defaultProps = {
    name: '@',
    initial: 0,
    min: 0,
    max: 100,
    value: [],
  };

  public eventBus: EventMittNamespace.EventMitt = ReactInteractiveList.event;
  private currentAction = '';

  get emptyArgs() {
    return {
      ...EMPTY_ARGS,
      options: this.props.options,
    };
  }

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
    const { options, listProps } = this.props;
    const props = {
      items: value,
      template: this.template,
      options,
      ...listProps,
    };
    return <ReactList {...props} />;
  }

  constructor(inProps: ReactInteractiveListProps) {
    super(inProps);
    const { value } = inProps;
    this.state = { value: [...value] };
  }

  private checkInitial = () => {
    const { initial, defaults } = this.props;
    const { value } = this.state;
    if (!initial) return;
    if (value.length < initial) {
      const _value = value.slice(0);
      for (let i = 0; i < initial - value.length; i++) {
        _value.push(defaults());
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
    this.currentAction = 'add';
    this.handleChange(_value);
  };

  remove = (inIndex: number | { index: number; action: string }) => {
    const args = typeof inIndex === 'number' ? { index: inIndex, action: 'remove' } : inIndex;
    const { value } = this.state;
    const _value = value.slice(0);
    if (this.isLteMin) return;
    _value.splice(args.index, 1);
    this.currentAction = args.action;
    this.handleChange(_value);
  };

  set = (inValue: any[]) => {
    this.currentAction = 'set';
    this.handleChange(inValue);
  };

  up = (inIndex: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    if (inIndex === 0) return;
    const temp = _value[inIndex - 1];
    _value[inIndex - 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.currentAction = 'up';
    this.handleChange(_value);
  };

  down = (inIndex: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    if (inIndex === _value.length - 1) return;
    const temp = _value[inIndex + 1];
    _value[inIndex + 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.currentAction = 'down';
    this.handleChange(_value);
  };

  top = (index: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    const item = _value.splice(index, 1);
    _value.unshift(item[0]);
    this.currentAction = 'top';
    this.handleChange(_value);
  };

  bottom = (index: number) => {
    const { value } = this.state;
    const _value = value.slice(0);
    const item = _value.splice(index, 1);
    _value.push(item[0]);
    this.currentAction = 'bottom';
    this.handleChange(_value);
  };

  clear = () => {
    this.currentAction = 'clear';
    this.handleChange([]);
  };

  notify = () => {
    const { value } = this.state;
    this.currentAction = 'notify';
    this.handleChange(value.slice(0));
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
    this.harmonyEvents = ReactHarmonyEvents.create(this);
    this.eventBus = ReactInteractiveList.event;
  }

  componentWillUnmount() {
    this.harmonyEvents?.destroy();
  }

  template = ({ item, index }) => {
    const { template, options } = this.props;
    const { value } = this.state;
    const _value = value.slice();
    return template?.({ item, index, items: _value, options });
  };

  handleChange = (inValue: any[]) => {
    const { onChange, onError, min, max, name, options } = this.props;
    const oldValue = this.state.value;
    const newValue = [...inValue];
    this.setState({ value: inValue }, () => {
      const opts: OnChangeCallbackOptions = {
        name,
        options,
        action: this.currentAction,
        oldValue,
        newValue,
      };
      onChange?.(inValue, opts);
      this.eventBus.emit(`${name}:change`, opts);
      this.length < min && onError?.('EQ_MIN');
      this.length > max && onError?.('EQ_MAX');
    });
  };

  render() {
    const {
      className,
      name,
      options,
      listProps,
      forwardedRef,
      initial,
      min,
      max,
      value,
      template,
      templateEmpty,
      defaults,
      onChange,
      onError,
      ...props
    } = this.props;

    if (value.length === 0) return templateEmpty?.(this.emptyArgs) || null;

    return (
      <div className={cx(CLASS_NAME, className)} ref={forwardedRef} {...props}>
        {this.listView}
      </div>
    );
  }
}

export default ReactInteractiveList;
