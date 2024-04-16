import noop from '@jswork/noop';
import classNames from 'classnames';
import React, { Component } from 'react';

const CLASS_NAME = 'react-interactive-list';

export type ReactInteractiveListProps = {
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * Default value.
   */
  value?: object;
  /**
   * The change handler.
   */
  onChange?: Function;
} & HTMLAttributes<any>;

export default class ReactInteractiveList extends Component<ReactInteractiveListProps> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    value: null,
    onChange: noop
  };

  handleClick = () => {
    console.log('click me!');
  };

  render() {
    const { className, value, onChange, ...props } = this.props;

    return (
      <div
        data-component={CLASS_NAME}
        className={classNames(CLASS_NAME, className)}
        {...props}>
        <button
          style={{ padding: 20, width: '100%' }}
          onClick={this.handleClick}
          className="icon-play">
          Enjoy coding.
        </button>
      </div>
    );
  }
}
