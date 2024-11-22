import RcComponent, { RemoveOptions } from '.';

const useCommand = (inName?: string) => {
  const name = inName || '@';
  const execute = (command: string, ...args: any[]) =>
    RcComponent.event?.emit(`${name}:${command}`, ...args);

  const listen = (cmd: string, callback: any) => RcComponent.event?.on(`${name}:${cmd}`, callback);

  // the command repository:
  const add = () => execute('add');
  const remove = (opts: RemoveOptions) => execute('remove', opts);
  const set = (items: any[]) => execute('set', items);
  const up = (index: number) => execute('up', index);
  const down = (index: number) => execute('down', index);
  const clear = () => execute('clear');
  const notify = () => execute('notify');
  const top = (index: number) => execute('top', index);
  const bottom = (index: number) => execute('bottom', index);

  return {
    listen,
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
