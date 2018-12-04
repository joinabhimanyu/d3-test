import * as React from 'react';
import './App.css';
import NavMenu from './components/navMenu';
import { Switch, Route } from 'react-router-dom';
import UsersBarChart from './components/usersBarChart';
import LineChart from './components/lineChart';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <NavMenu />
        <Switch>
          <Route exact path='/' component={UsersBarChart} />
          <Route exact path='/users-bar-chart' component={UsersBarChart} />
          <Route path='/line-chart' component={LineChart} />
        </Switch>
      </div >
    );
  }
}

export default App;
