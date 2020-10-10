import React from 'react';
import './App.css';
import Header from './Components/header.js'

class App extends React.Component {

  render(){
    
    return (
      <div className="App">
        <Header {...this.props} />
      </div>
    );
  }

}

export default App;
