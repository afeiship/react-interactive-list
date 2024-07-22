import ReactInteractiveList from '.';
import { useEffect, useState } from 'react';

const useCommand = (inName?: string) => {
  const name = inName || '@';
  const [emitter, setEmitter] = useState<any>();
  const execute = (command: string, ...args: any[]) => emitter?.emit(`${name}:${command}`, ...args);

  // the command repository:
  const add = () => execute('add');
  const remove = (index: number) => execute('remove', index);
  const set = (items: any[]) => execute('set', items);
  const up = (index: number) => execute('up', index);
  const down = (index: number) => execute('down', index);
  const clear = () => execute('clear');
  const notify = () => execute('notify');
  const top = (index: number) => execute('top', index);
  const bottom = (index: number) => execute('bottom', index);

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
    notify,
    top,
    bottom,
  };
};

export default useCommand;
