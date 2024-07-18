import { ReactInteractiveList } from '.';
import { useRef } from 'react';

const useCommand = (name: string) => {
  const { current: emitter } = useRef(ReactInteractiveList.event);
  const add = () => emitter.emit(`${name}:add`);
  const remove = (index: number) => emitter.emit(`${name}:remove`, index);
  const set = (items: any[]) => emitter.emit(`${name}:set`, items);
  const up = (index: number) => emitter.emit(`${name}:up`, index);
  const down = (index: number) => emitter.emit(`${name}:down`, index);
  const clear = () => emitter.emit(`${name}:clear`);
  const notify = () => emitter.emit(`${name}:notify`);

  return {
    emitter,
    add,
    remove,
    set,
    up,
    down,
    clear,
    notify
  };
};

export default useCommand;
