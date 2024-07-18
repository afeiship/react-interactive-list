import React from 'react';
import ReactInteractiveList from '.';
import useCommand from './use-command';

export {
  useCommand,
  ReactInteractiveList
};

export default React.forwardRef((props: any, ref) => {
  return <ReactInteractiveList {...props} ref={ref} />;
});
