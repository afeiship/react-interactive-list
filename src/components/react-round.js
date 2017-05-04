import './style.scss';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'noop';

export default class extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    filter: PropTypes.func,
    radius: PropTypes.string,
  };

  static defaultProps = {
    filter: noop,
    radius: '100px'
  };

  getChildren() {
    const {filter, children} = this.props;
    return filter === noop ? children : filter(children);
  }

  render() {
    const {className, radius, filter, ...props} = this.props;
    return (
      <span {...props} style={{borderRadius: radius}} className={classNames('react-round', className)}>
        {this.getChildren()}
      </span>
    );
  }
}
