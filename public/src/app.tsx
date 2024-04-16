import React, { useState } from 'react';
import ReactInteractiveList from '../../src/main';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 30px auto 0;
  button {
    margin-right: 10px;
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
  const [items, setItems] = useState([
    'I wondered why the baseball was getting bigger. Then it hit me.',
    'Police were called to a day care, where a three-year-old was resisting a rest.',
    'Did you hear about the guy whose whole left side was cut off? He’s all right now.',
    'The roundest knight at King Arthur’s round table was Sir Cumference.',
    'To write with a broken pencil is pointless.',
    'When fish are in schools they sometimes take debate.',
    'The short fortune teller who escaped from prison was a small medium at large.',
    'A thief who stole a calendar… got twelve months.',
    'A thief fell and broke his leg in wet cement. He became a hardened criminal.'
  ]);

  const template = ({ item, index }, cb) => {
    const idx = index + 1;
    return (
      <div className="message" key={index}>
        <button onClick={cb}>DELETE</button>
        <span>
          {idx}.{item}
        </span>
      </div>
    );
  };

  const templateCreate = (_, cb) => {
    return <button onClick={cb}>Create</button>;
  };

  const templateDefault = () => {
    return 'New Item';
  };

  const handleChange = (e) => {
    const { value } = e.target;
    console.log('current items: ', value);
    setItems(value);
  };

  console.log('items: ', items);

  return (
    <Container>
      <ReactInteractiveList
        wrapped
        items={items}
        template={template}
        templateCreate={templateCreate}
        templateDefault={templateDefault}
        onChange={handleChange}
      />
    </Container>
  );
};
