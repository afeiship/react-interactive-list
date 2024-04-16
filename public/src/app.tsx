import React, { useState } from 'react';
import ReactInteractiveList from '../../src/main';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 30px auto 0;

  .message {
    border-radius: 1em;
    margin: 0.5em;
    line-height: 1.1em;
    background-color: lightblue;
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
        <p>
          <span>
            {idx}.{item}
          </span>
          <button onClick={cb}>DELETE</button>
        </p>
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
    setItems(value);
  };

  console.log('render...');

  return (
    <Container>
      <ReactInteractiveList
        items={items}
        template={template}
        templateCreate={templateCreate}
        templateDefault={templateDefault}
        onChange={handleChange}
      />
    </Container>
  );
};
