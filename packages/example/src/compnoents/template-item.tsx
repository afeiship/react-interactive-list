/**
 * @email: aric.zheng@alo7.com
 * @description: A React component.
 * @updated_at: 2024-07-22 20:42:37
 */
import React from 'react';
import { useCommand } from '@jswork/react-interactive-list/src/main';

interface TemplateItemProps {
  items: any[];
  item: any;
  index: number;
}

const Anonymous = (props: TemplateItemProps) => {
  const { items, item, index } = props;
  const { notify, top, bottom, remove, up, down } = useCommand('i1');
  const idx = index + 1;
  return (
    <div
      className="bg-gray-100 p-2 y-2 rounded-md hover:bg-gray-300 transition-all cursor-pointer"
      key={item.id}>
      <nav className="x-2">
        <button className="btn2" onClick={() => top(index)}>
          ToTop
        </button>
        <button className="btn2" onClick={() => bottom(index)}>
          ToBottom
        </button>
        <button className="btn1" onClick={() => remove(index)}>
          DELETE
        </button>
        <button className="btn1" disabled={index === 0} onClick={() => up(index)}>
          Up
        </button>
        <button className="btn1" disabled={index === items.length - 1} onClick={() => down(index)}>
          Down
        </button>
      </nav>
      <span className="x-1">
        {idx} -{' '}
        <input
          className="flex-1 border border-slate-300"
          value={item.message}
          onChange={(e) => {
            item.message = e.target.value;
            notify();
          }}
        />{' '}
      </span>
    </div>
  );
};

export default Anonymous;
