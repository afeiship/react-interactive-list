import React, { useRef, useState } from 'react';
import ReactInteractiveListUI, { useCommand } from '@jswork/react-interactive-list/src/main';

const messages = [
  'I wondered why the baseball was getting bigger. Then it hit me.',
  'Police were called to a day care, where a three-year-old was resisting a rest.',
  'Did you hear about the guy whose whole left side was cut off? He’s all right now.',
  'The roundest knight at King Arthur’s round table was Sir Cumference.',
  'To write with a broken pencil is pointless.'
].map((message, index) => ({ message, index, id: `id_${index}` }));


function App() {
  const [items, setItems] = useState(messages);
  const ref1 = useRef(null);
  const { add, remove, clear, up, down } = useCommand('i1');

  const template = ({ item, index }) => {
    const idx = index + 1;
    return (
      <div className="bg-gray-100 p-1 hover:bg-gray-200 cursor-pointer" key={item.id}>
        <nav className="x-2">
          <button className="btn btn-primary btn-sm" onClick={() => remove(index)}>DELETE</button>
          <button className="btn btn-primary btn-sm" disabled={index === 0} onClick={() => up(index)}>Up</button>
          <button className="btn btn-primary btn-sm" disabled={index === items.length - 1}
                  onClick={() => down(index)}>Down
          </button>
        </nav>
        <span>
          {idx}.{item.message}
        </span>
      </div>
    );
  };

  const defaults = () => {
    return {
      message: 'New items',
      id: `id_${Math.random()}`
    };
  };

  const handleChange = (value) => {
    setItems(value);
  };

  return (
    <div className="wp-5 mx-auto y-5 p-2">
      <nav className="x-2">
        <button className="btn btn-primary btn-sm" onClick={add}>Add</button>
        <button className="btn btn-primary btn-sm" onClick={() => remove(0)}>Remove 0</button>
        <button className="btn btn-primary btn-sm" onClick={clear}>Empty</button>
      </nav>
      <ReactInteractiveListUI
        name="i1"
        ref={ref1}
        listProps={{ className: 'y-1', as: 'section' }}
        value={items}
        template={template}
        defaults={defaults}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
