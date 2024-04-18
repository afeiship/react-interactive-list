import React, { useState } from 'react';
import ReactInteractiveList from '../../src/main';
import styled from 'styled-components';
import '@jswork/next';;

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

  const template = ({ item, index }, cb) => {
    const idx = index + 1;
    return (
      <div className="message" key={item.id}>
        <button onClick={cb}>DELETE</button>
        <span>
          {idx}.{item.message}
        </span>
      </div>
    );
  };

  const templateCreate = (_, cb) => {
    return <button onClick={cb}>Create</button>;
  };

  const templateDefault = () => {
    return {
      message: 'New items',
      id: `id_${Math.random()}`
    };
  };

  const handleChange = (e) => {
    const { value } = e.target;
    console.log('current items: ', value);
    setItems(value);
  };

  return (
    <Container>
      <ReactInteractiveList
        harmony
        wrapped
        reverse
        items={items}
        template={template}
        templateCreate={templateCreate}
        templateDefault={templateDefault}
        onChange={handleChange}
      />
    </Container>
  );
};
