import React, { Component } from 'react';
import Canvas from './canvas.jsx'
import Body from './body.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { height: '', width: '' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
}
componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
}

componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
} 
  render() {
    return (
      <div  style={{height: this.state.height, width: this.state.width}}>
        <Canvas height={this.state.height} width={this.state.width}/>
        <Body style={{height: '100%', width: '100%', zIndex: 100, position: 'absolute'}}/>
      </div>
      
    );
  }
}

export default App;
