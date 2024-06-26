import React, { useEffect, useRef, useState } from 'react';
import ReactInteractiveList from '../../src/main';
import styled from 'styled-components';
import '@jswork/next';

const messages = [
  'I wondered why the baseball was getting bigger. Then it hit me.',
  'Police were called to a day care, where a three-year-old was resisting a rest.',
  'Did you hear about the guy whose whole left side was cut off? He’s all right now.',
  'The roundest knight at King Arthur’s round table was Sir Cumference.',
  'To write with a broken pencil is pointless.',
  'When fish are in schools they sometimes take debate.',
  'The short fortune teller who escaped from prison was a small medium at large.',
  'A thief who stole a calendar… got twelve months.',
  'A thief fell and broke his leg in wet cement. He became a hardened criminal.'
].map((message, index) => ({ message, index, id: `id_${index}` }));

const Container = styled.div`
    width: 80%;
    margin: 30px auto 0;

    button {
        margin-right: 10px;
    }

    .actions {
        margin-bottom: 10px;
        background-color: #eee;
        padding: 6px 12px;
        border-radius: 4px;
    }

    .react-list {
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        border-radius: 3px;
        margin: 4px auto;
        transition: background-color 0.3s;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    .message {
        border-radius: 1em;
        padding: 6px 12px;
        margin: 0.5em;
        line-height: 1.1em;
        background-color: lightblue;
        transition: background-color 0.3s;

        &:hover {
            background-color: lightcoral;
        }
    }
`;

export default () => {
  const [items, setItems] = useState(messages);
  const [items2, setItems2] = useState([...messages.slice(0, 3)]);
  const ref1 = useRef(null);

  const template = ({ item, index }, cb) => {
    const idx = index + 1;
    return (
      <div className="message" key={item.id}>
        <nav>
          <button onClick={cb}>DELETE</button>
          <button disabled={index === 0} onClick={() => nx.$ilist.event.emit('i2:up', index)}>Up</button>
          <button disabled={index === items2.length - 1} onClick={() => nx.$ilist.event.emit('i2:down', index)}>Down
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

  const handleChange2 = (value) => {
    setItems2(value);
  };

  useEffect(() => {
    window['ref1'] = ref1;
  }, []);

  return (
    <Container>
      <nav className="actions">
        <button
          onClick={() => {
            nx.$ilist.event.emit('i1:add');
          }}>
          Add
        </button>
        <button
          onClick={() => {
            nx.$ilist.event.emit('i1:remove', 0);
          }}>
          Remove 0
        </button>
        <button
          onClick={() => {
            nx.$ilist.event.emit('i1:clear');
          }}>
          Empty
        </button>
      </nav>
      <ReactInteractiveList
        name="i1"
        ref={ref1}
        harmony
        listProps={{ className: 'react-list-x', as: 'section' }}
        value={items}
        template={template}
        defaults={defaults}
        onChange={handleChange}
      />
      <hr />
      <ReactInteractiveList
        name="i2"
        initial={3}
        harmony
        listProps={{ className: 'react-list-x', as: 'section' }}
        value={items2}
        template={template}
        defaults={defaults}
        onChange={handleChange2}
      />
    </Container>
  );
};
