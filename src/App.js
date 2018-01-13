import React, {
  Component
} from 'react';
import Body from './body.jsx'
import Particle from './canvas_particles/particle.jsx'
import {random_int_from_range , distance} from './helpers'

class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        height: window.innerHeight,
        width: window.innerWidth,
        ratio: window.devicePixelRatio || 1
      },
      context:null
    }
    this.particles= []
  }
  
  handle_resize(value) {
    const context = this.refs.canvas.getContext('2d')
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: context
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handle_resize.bind(this));
    const context = this.refs.canvas.getContext('2d')
    this.setState({context:context})
    this.init()
    requestAnimationFrame(() => {this.update_context()});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handle_resize);
  }

  update_context(){
    const context = this.state.context
    if(context != null){
      context.clearRect(0, 0, this.state.screen.width, this.state.screen.height);
      this.particles.map(i => i.update(context))
    }
    requestAnimationFrame(()=> this.update_context())
  }
  init(){
    for(let i = 0; i< 2000; i++){
      const radius = Math.random() * 5 + 1;
      let x = random_int_from_range(radius, this.state.screen.width - radius);
      let y = random_int_from_range(radius, this.state.screen.height - radius);
   
      let particle = new Particle({x,y, radius})
      console.log(particle)
      this.particles.push(particle)
    }
  }
    
  render() {
    console.log('render')
      return (
        < div height= {this.state.height} width= {this.state.width}>
          <canvas ref='canvas' style={{zIndex:-1, width:this.state.screen.width, height:this.state.screen.height}}/>
        </div>
      );
  }
}

export default App;