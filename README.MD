# react-round
> React component for badge/label/tag and other radius view.

## size:
+ 8.0K	react-round.js
+ 44K	react-round.js.map

## properties:
```javascript
  static propTypes = {
    className:PropTypes.string,
    filter:PropTypes.func
  };
```

## usage:
```jsx
class App extends React.Component {
  _filter(inValue) {
    var value = parseInt(inValue);
    if (value) {
      return value > 1000 ? '1000+' : value;
    }
    return '';
  }

  render() {
    return (
      <div className="hello-react-round">
        <h1>Badge</h1>
        <ReactRound children="0" filter={this._filter.bind(this)}/>
        <ReactRound children="22" filter={this._filter.bind(this)}/>
        <ReactRound children="10002" filter={this._filter.bind(this)}/>
        <div className="blank-10"></div>
        <div className="blank-10"></div>
        <h1>Tag</h1>
        <ReactRound radius="5px" children="22" filter={this._filter.bind(this)}/>
        <ReactRound radius="5px" children="10002" filter={this._filter.bind(this)}/>
      </div>
    );
  }
}
```

## resource:
+ http://www.cnblogs.com/Kummy/p/4966937.html
+ https://github.com/steven5538/vue-button
+ https://yarnpkg.com/en/docs/install

