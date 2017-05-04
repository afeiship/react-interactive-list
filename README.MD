# react-badge
> Badge component for react.

## size:
+ 8.0K	react-badge.js
+ 44K	react-badge.js.map

## properties:
```javascript
  static propTypes = {
    className:PropTypes.string,
    filter:PropTypes.func
  };
```

## usage:
```jsx
class App extends React.Component{
  _filter(inValue){
    var value = parseInt(inValue);
    return value>1000 ? '1000+': value;
  }
  render(){
    return (
      <div className="hello-react-badge">
        <ReactBadge children="22" filter={this._filter.bind(this)} />
        <ReactBadge children="99" filter={this._filter.bind(this)} />
        <ReactBadge children="1000" filter={this._filter.bind(this)} />
        <ReactBadge children="10002" filter={this._filter.bind(this)} />
    </div>
    );
  }
}
```

## resource:
+ http://www.cnblogs.com/Kummy/p/4966937.html
+ https://github.com/steven5538/vue-button
+ https://yarnpkg.com/en/docs/install

