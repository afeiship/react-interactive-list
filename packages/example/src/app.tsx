import React, { useRef, useState } from 'react';
import ReactInteractiveListUI, { useCommand } from '@jswork/react-interactive-list/src/main';
import TemplateItem from './compnoents/template-item.tsx';

const messages = [
  'I wondered why the baseball was getting bigger. Then it hit me.',
  'Police were called to a day care, where a three-year-old was resisting a rest.',
  'Did you hear about the guy whose whole left side was cut off? He’s all right now.',
  'The roundest knight at King Arthur’s round table was Sir Cumference.',
  'To write with a broken pencil is pointless.',
].map((message, index) => ({ message, index, id: `id_${index}` }));

function App() {
  const [items, setItems] = useState(messages);
  const ref1 = useRef(null);
  const { add, remove, clear, up, down, top, bottom, notify } = useCommand('i1');

  const template = ({ item, index }) => {
    return <TemplateItem key={index} item={item} index={index} items={items} />;
  };

  const defaults = () => {
    return {
      message: 'New items',
      id: `id_${Math.random()}`,
    };
  };

  const handleChange = (value) => {
    setItems(value);
    console.log('value: ', value);
  };

  return (
    <div className="wp-5 mx-auto y-5 p-2">
      <nav className="x-2">
        <button className="btn1" onClick={add}>
          Add
        </button>
        <button className="btn1" onClick={() => remove(0)}>
          Remove 0
        </button>
        <button className="btn1" onClick={clear}>
          Empty
        </button>
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
