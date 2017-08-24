import React, { Component } from 'react';
import Logo from './logo.svg';
import ReservationsPage from './ReservationsPage.jsx';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Logo className="App-logo" alt="logo" />
          <h2>Welcome to my great room reservation service.</h2>
        </div>
				<ReservationsPage />
      </div>
    );
  }
}

export default App;
