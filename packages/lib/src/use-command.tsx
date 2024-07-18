import ReactInteractiveList from '.';
import { useEffect, useState } from 'react';

const useCommand = (name: string) => {
  const [value, setValue] = useState<any>();
  const add = () => value.emit(`${name}:add`);
  const remove = (index: number) => value.emit(`${name}:remove`, index);
  const set = (items: any[]) => value.emit(`${name}:set`, items);
  const up = (index: number) => value.emit(`${name}:up`, index);
  const down = (index: number) => value.emit(`${name}:down`, index);
  const clear = () => value.emit(`${name}:clear`);
  const notify = () => value.emit(`${name}:notify`);

  useEffect(() => {
    setValue(ReactInteractiveList.event);
  }, []);

  console.log('value: ', value);

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
