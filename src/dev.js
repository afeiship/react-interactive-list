import './dev.scss';
import ReactBadge from './main';


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


ReactDOM.render(
    <App />,
    document.getElementById('app')
);
