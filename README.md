# react-interactive-list
> React interactive-list.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-interactive-list
```

## usage
1. import css
  ```scss
  @import "~@jswork/react-interactive-list/dist/style.css";

  // or use sass
  @import "~@jswork/react-interactive-list/dist/style.scss";

  // customize your styles:
  $react-interactive-list-options: ()
  ```
2. import js
  ```js
  import React, { useState } from 'react';
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

    .actions{
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
        <nav className='actions'>
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
          harmony
          reverse
          listProps={{ className: 'react-list-x', as: 'section' }}
          items={items}
          template={template}
          templateCreate={templateCreate}
          templateDefault={templateDefault}
          onChange={handleChange}
        />
      </Container>
    );
  };

  ```
3. import `global.d.ts`
```ts
/// <reference types="@jswork/react-interactive-list/global.d.ts" />
```

## preview
- https://afeiship.github.io/react-interactive-list/

## license
Code released under [the MIT license](https://github.com/afeiship/react-interactive-list/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-interactive-list
[version-url]: https://npmjs.org/package/@jswork/react-interactive-list

[license-image]: https://img.shields.io/npm/l/@jswork/react-interactive-list
[license-url]: https://github.com/afeiship/react-interactive-list/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/react-interactive-list
[size-url]: https://github.com/afeiship/react-interactive-list/blob/master/dist/react-interactive-list.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/react-interactive-list
[download-url]: https://www.npmjs.com/package/@jswork/react-interactive-list
