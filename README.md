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
  ```
2. import js
  ```js
  import React, { useEffect, useRef, useState } from 'react';
  import ReactInteractiveListUI, { ReactInteractiveList } from '@jswork/react-interactive-list';
  import '@jswork/react-interactive-list/dist/style.scss';

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


  function App() {
    const [items, setItems] = useState(messages);
    const [items2, setItems2] = useState([...messages.slice(0, 3)]);
    const ref1 = useRef(null);

    const template = ({ item, index }) => {
      const idx = index + 1;
      return (
        <div className="bg-gray-100 p-1 hover:bg-gray-200 cursor-pointer" key={item.id}>
          <nav className="x-2">
            <button className="btn btn-primary btn-sm" onClick={() => {
              ReactInteractiveList.event.emit('i1:remove', index);
            }}>DELETE
            </button>
            <button className="btn btn-primary btn-sm" disabled={index === 0}
                    onClick={() => ReactInteractiveList.event.emit('i2:up', index)}>Up
            </button>
            <button className="btn btn-primary btn-sm" disabled={index === items2.length - 1}
                    onClick={() => ReactInteractiveList.event.emit('i2:down', index)}>Down
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

    return (
      <div className="wp-5 mx-auto y-5 p-2">
        <nav className="x-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              ReactInteractiveList.event.emit('i1:add');
            }}>
            Add
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              ReactInteractiveList.event.emit('i1:remove', 0);
            }}>
            Remove 0
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              ReactInteractiveList.event.emit('i1:clear');
            }}>
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
        <hr />
        <ReactInteractiveListUI
          name="i2"
          initial={3}
          listProps={{ className: 'y-1', as: 'section' }}
          value={items2}
          template={template}
          defaults={defaults}
          onChange={handleChange2}
        />
      </div>
    );
  }

  export default App;
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
