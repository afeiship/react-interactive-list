import { ReactInteractiveList } from '.';

const useCommand = (name: string) => {
  const emitter = ReactInteractiveList.event;
  const add = () => emitter.emit(`${name}:add`);
  const remove = (index: number) => emitter.emit(`${name}:remove`, index);
  const set = (items: any[]) => emitter.emit(`${name}:set`, items);
  const up = () => emitter.emit(`${name}:up`);
  const down = () => emitter.emit(`${name}:down`);
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
    notify,
  };
};

export default useCommand;
