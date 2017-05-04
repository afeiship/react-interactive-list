import './style.scss';
import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'noop';

export default class extends PureComponent{
  static propTypes = {
    className:PropTypes.string,
    filter:PropTypes.func
  };

  static defaultProps = {
    filter:noop
  };

  getChildren(){
    const {filter,children} = this.props;
    console.log(filter === noop);
    return filter===noop ? children : filter(children);
  }

  render(){
    const {className,filter,...props} = this.props;
    return (
      <span {...props} className={classNames('react-badge',className)}>
        {this.getChildren()}
      </span>
    );
  }
}
