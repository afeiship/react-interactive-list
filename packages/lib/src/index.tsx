import ReactList, { ReactListProps, TemplateCallback } from '@jswork/react-list';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import fdp from 'fast-deep-equal';
import type { EventMittNamespace } from '@jswork/event-mitt';
import { ReactHarmonyEvents } from '@jswork/harmony-events';

const CLASS_NAME = 'react-interactive-list';

type StdCallback = (value: any) => void;

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
  template: TemplateCallback;
  /**
   * The empty create template.
   */
  defaults: () => any;
  /**
   * The change handler.
   */
  onChange?: StdCallback;
  /**
   * When trigger max/min boundary.
   */
  onError?: StdCallback;
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
  private harmonyEvents: ReactHarmonyEvents | null = null;
  static displayName = CLASS_NAME;
  static event: EventMittNamespace.EventMitt;
  static events = ['add', 'remove', 'set', 'up', 'down', 'clear', 'notify'];
  static defaultProps = {
    name: '@',
    initial: 0,
    min: 0,
    max: 100,
    value: []
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
    const { value, name } = inProps;

    this.state = { value: [...value] };
    this.harmonyEvents = new ReactHarmonyEvents({
      name,
      context: this
    });
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
    this.harmonyEvents?.destroy();
  }

  template = ({ item, index }) => {
    const { template } = this.props;
    const { value } = this.state;
    const _value = value.slice();
    return template({ item, index, items: _value });
  };

  handleChange = (inValue: any[]) => {
    const { onChange, onError, min, max } = this.props;
    this.setState({ value: inValue }, () => {
      onChange?.(inValue);
      this.length < min && onError?.('EQ_MIN');
      this.length > max && onError?.('EQ_MAX');
    });
  };

  render() {
    const {
      className,
      name,
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

export default ReactInteractiveList;
