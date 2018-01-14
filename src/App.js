import React, {
  Component
} from 'react';
// import Body from './body.jsx'
import Particle from './canvas_particles/particle.jsx'
import {random_int_from_range } from './helpers'

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
    this.mouseX = null
    this.mouseY = null
    this.particles= []
  }
  
  handle_resize(value) {
    console.log(window.innerWidth)
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
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
    let c = this.state.context
    let width =  this.state.screen.width
    let height =  this.state.screen.height
    c.clearRect(0, 0, width, height) 
    if(c != null){
      this.particles.map(p => p.render(this.state))
      requestAnimationFrame(()=> this.update_context())
    }
 
  }
  init(){
    for(let i = 0; i< 1000; i++){
      const radius =5;
      let x = random_int_from_range(radius, this.state.screen.width - radius);
      let y = random_int_from_range(radius, this.state.screen.height - radius);
   
      let particle = new Particle({x,y, radius})
      this.particles.push(particle)
    }
  }
  update_mouse(e){
    console.log(e.clientY - e.target.offsetTop)
    this.mouseY = e.clientY
    this.mouseX = e.clientX
  }
  render() {
      return (
        < div height= {this.state.height} width= {this.state.width}>
          <canvas onMouseMove={this.update_mouse.bind(this)} ref='canvas' style={{zIndex:-1, width:this.state.screen.width, height:this.state.screen.height}}/>
        </div>
      );
  }
}

export default App;