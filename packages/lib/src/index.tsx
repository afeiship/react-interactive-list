import ReactList, { ReactListProps, TemplateComponent } from '@jswork/react-list';
import cx from 'classnames';
import React, { Component, createElement, FC, HTMLAttributes } from 'react';
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
export type RemoveOptions = number | { index: number; action: string };
export type NotifyOptions = { action: string };

export type ReactInteractiveListProps = {
  /**
   * The extended className for component.
   * @default ''
   */
  className?: string;
  /**
   * The identity name.
   * @default '@'
   */
  name?: string;
  /**
   * The initial size.
   * @default 0
   */
  initial?: number;
  /**
   * The minimum size.
   * @default 0
   */
  min: number;
  /**
   * The max size.
   * @default 100
   */
  max: number;
  /**
   * The data source.
   * @default []
   */
  value: any[];
  /**
   * Whether use jsx template.
   * @default false
   */
  hookable?: boolean;
  /**
   * The data item template.
   * @default null
   */
  template: ReactListProps['template'];
  /**
   * The empty template.
   * @default null
   */
  templateEmpty?: ReactListProps['templateEmpty'];
  /**
   * The extra options for template function.
   * @default null
   */
  options?: any;
  /**
   * The empty create template.
   * @default null
   */
  defaults: () => any;
  /**
   * The change handler.
   * @default null
   */
  onChange?: OnChangeCallback;
  /**
   * When trigger max/min boundary.
   * @default null
   */
  onError?: StdCallback;
  /**
   * Forwards a ref to the underlying div element.
   * @default null
   */
  forwardedRef?: any;
  /**
   * The props for react-list.
   * @default null
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
    return this.stateValue.length;
  }

  get stateValue() {
    return this.state.value || [];
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
    const { hookable, options, listProps } = this.props;
    const props = {
      items: this.stateValue,
      template: this.template,
      options,
      hookable,
      ...listProps,
    };
    return <ReactList {...props} />;
  }

  constructor(inProps: ReactInteractiveListProps) {
    super(inProps);
    const { value } = inProps;
    const _value = value || [];
    this.state = { value: [..._value] };
  }

  private checkInitial = () => {
    const { initial, defaults } = this.props;
    const stateValue = this.stateValue;
    if (!initial) return;
    if (stateValue.length < initial) {
      const _value = stateValue.slice(0);
      for (let i = 0; i < initial - stateValue.length; i++) {
        _value.push(defaults());
      }
      this.handleChange(_value);
    }
  };

  /* ----- public eventBus methods ----- */
  add = () => {
    const { defaults } = this.props;
    const _value = this.stateValue.slice(0);
    if (this.isGteMax) return;
    _value.push(defaults());
    this.currentAction = 'add';
    this.handleChange(_value);
  };

  remove = (options: RemoveOptions) => {
    const args = typeof options === 'number' ? { index: options, action: 'remove' } : options;
    const _value = this.stateValue.slice(0);
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
    const _value = this.stateValue.slice(0);
    if (inIndex === 0) return;
    const temp = _value[inIndex - 1];
    _value[inIndex - 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.currentAction = 'up';
    this.handleChange(_value);
  };

  down = (inIndex: number) => {
    const _value = this.stateValue.slice(0);
    if (inIndex === _value.length - 1) return;
    const temp = _value[inIndex + 1];
    _value[inIndex + 1] = _value[inIndex];
    _value[inIndex] = temp;
    this.currentAction = 'down';
    this.handleChange(_value);
  };

  top = (index: number) => {
    const _value = this.stateValue.slice(0);
    const item = _value.splice(index, 1);
    _value.unshift(item[0]);
    this.currentAction = 'top';
    this.handleChange(_value);
  };

  bottom = (index: number) => {
    const _value = this.stateValue.slice(0);
    const item = _value.splice(index, 1);
    _value.push(item[0]);
    this.currentAction = 'bottom';
    this.handleChange(_value);
  };

  clear = () => {
    this.currentAction = 'clear';
    this.handleChange([]);
  };

  notify = (options?: NotifyOptions) => {
    this.currentAction = options?.action || 'notify';
    this.handleChange(this.stateValue.slice(0));
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
    const { template, options, hookable } = this.props;
    const _value = this.stateValue.slice();
    if (hookable) {
      const Template = template as TemplateComponent;
      return <Template item={item} index={index} items={_value} options={options} />;
    }
    return template?.({ item, index, items: _value, options });
  };

  templateEmpty = () => {
    const { templateEmpty, hookable } = this.props;
    if (!templateEmpty) return null;
    if (hookable) {
      const Empty = templateEmpty as TemplateComponent;
      return <Empty {...this.emptyArgs} />;
    }
    return templateEmpty(this.emptyArgs);
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
      hookable,
      template,
      templateEmpty,
      defaults,
      onChange,
      onError,
      ...props
    } = this.props;

    if (!value || value.length === 0) return this.templateEmpty();

    return (
      <div className={cx(CLASS_NAME, className)} ref={forwardedRef} {...props}>
        {this.listView}
      </div>
    );
  }
}

export default ReactInteractiveList;
