import ReactInteractiveList from '.';
import { useEffect, useState } from 'react';

const useCommand = (inName?: string) => {
  const name = inName || '@';
  const [emitter, setEmitter] = useState<any>();
  const add = () => emitter.emit(`${name}:add`);
  const remove = (index: number) => emitter.emit(`${name}:remove`, index);
  const set = (items: any[]) => emitter.emit(`${name}:set`, items);
  const up = (index: number) => emitter.emit(`${name}:up`, index);
  const down = (index: number) => emitter.emit(`${name}:down`, index);
  const clear = () => emitter.emit(`${name}:clear`);
  const notify = () => emitter.emit(`${name}:notify`);

  useEffect(() => {
    setEmitter(ReactInteractiveList.event);
  }, []);

  return {
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
