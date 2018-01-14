import React, { Component } from 'react'

class Canvas extends Component {
    constructor(props){
        super(props)
        this.state = {
            height: null,
            width: null,
            particles: [],
            C: null,
            colors: [],
            CANVAS: null,
            mouse_x: null,
            mouse_y: null,
        }
    }

    componentWillReceiveProps(nextProps){
        this.props !== nextProps ? this.setState({...nextProps}) : null
    }
    componentWillMount(){
        this.setState({
             height: this.props.height,
             width: this.props.width,
            })
    }
    componentDidMount(){
        console.log(this.refs.canvas)
        let canvas = this.refs.canvas
        let context = canvas.getContext('2d')
        this.setState({C: context, CANVAS: canvas})
        this.init()
    }
    capture_mouse(e){
       let x =  e.nativeEvent.offsetX
       let y = e.nativeEvent.offsetY
       this.setState({mouse_x: x, mouse_y: y})
    }

    Particle(x, y, radius){
        const c = this.state.C
        let particles = this.state.particles
        let width = this.state.width
        let heigh = this.state.height
        let mouse_x = this.state.mouse_x
        let mouse_y = this.state.mouse_y

        let particle = (x,y, radius, c, particles, width, height, mouse_x, mouse_y)=> {
            this.particles = particles
            this.mouse_x = mouse_x
            this.mouse_y = mouse_y
            this.heigh = heigh
            this.width = width
            this.c = c
            this.x = x
            this.y = y
            this.opacity = 0
            this.velocity = {
                x: (Math.random() - .5)*5,
                y: (Math.random() - .5)*5
            }
            this.get_distance = this.get_distance.bind(this)
            this.distance = this.distance.bind(this)
            this.rotate = this.rotate.bind(this)
            this.resolve_collision= this.resolve_collision.bind(this)
            this.update = this.update.bind(this)
            this.draw = this.draw.bind(this)
            this.mass = 1
            this.radius = radius
            this.color = 'red' //this.random_color(colors)
            this.draw =()=> {
                this.c.beginPath()
                this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
                this.c.save()
                this.c.globalAlpha = this.opacity
                this.c.fillStyle = this.color 
                this.c.fill()
                this.c.restore()
               
                this.c.strokeStyle = this.color
                this.c.stroke()
                this.c.closePath()
            }
            this.get_distance =(x1, y1, x2 ,y2)=>{
                let x_distance = x2 - x1
                let y_distance = y2 - y1
                return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2))
            }
            this.resolve_collision =(particle, other_particle)=>{
                // use one dimentional newtonion equation 
                const x_velocity_dif = particle.velocity.x - other_particle.velocity.x
                const y_velocity_dif = particle.velocity.y - other_particle.velocity.y
            
                const x_distance = other_particle.x - particle.x
                const y_distance = other_particle.y - particle.y
            
                // prevent accidental overlap 
                if(x_velocity_dif * x_distance + y_velocity_dif * y_distance >= 0){
                    // get the angle of two coliding particles
                    const angle = -Math.atan2(other_particle.y - particle.y, other_particle.x - particle.x)
                    // variables for better readability 
                    const m1 = particle.mass
                    const m2 = other_particle.mass
                    // store velocity
                    const u1 = this.rotate(particle.velocity, angle)
                    const u2 = this.rotate(other_particle.velocity, angle)
                    // velocirt after collision detection
                    const v1 = { x: u1.x * (m1-m2)/(m1+m2)+u2.x*2*m2/(m1+m2), y: u1.y}
                    const v2 = { x: u2.x * (m1-m2)/(m1+m2)+u1.x*2*m2/(m1+m2), y: u2.y}
                    // final velocity after rotating axis back to the original location
                    const f_v_p1 = this.rotate(v1, -angle)
                    const f_v_p2 = this.rotate(v2, -angle)
                    // swap particle velocities for realistic bounce effect
                    particle.velocity.x = f_v_p1.x
                    particle.velocity.y = f_v_p1.y
            
                    other_particle.velocity.x = f_v_p2.x
                    other_particle.velocity.y = f_v_p2.y
                }
            }
            this.rotate =(velocity, angle)=>{
                const rotated_velocities = {
                    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
                    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
                }
                return rotated_velocities
            }
            this.distance = (x1, y1, x2, y2) =>{
                const xDist = x2 - x1
                const yDist = y2 - y1
                return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
            }
            this.update = (particles, width, height) => { 
                this.draw()
                for(let i = 0; i < particles.length; i++){
                    if(this === particles[i]) continue;
                    if(this.get_distance(this.x,this.y,particles[i].x,particles[i].y)- this.radius * 2 < 0){
                        this.resolve_collision(this, particles[i])
                    }
                }
                // function to bounce particles off screen bounds
                if(this.x - this.radius <= 0 || this.x + this.radius >= width){
                    this.velocity.x = - this.velocity.x
                }
                if(this.y - this.radius <= 0 || this.y + this.radius >= height){
                    this.velocity.y = - this.velocity.y
                }
                // mouse collision detection
                if(this.distance(mouse_x, mouse_y, this.x, this.y) < 50 && this.opacity < .2){
                    this.opacity += .5
                } else if(this.opacity > 0){
                    this.opacity -= .5
                    this.opacity = Math.max(0, this.opacity)
                }
                // implement movement by adding the velocity to the current x and y positions
                this.x += this.velocity.x;
                this.y += this.velocity.y;
        
            }
        }
        return particle
    }

    init() {
        let particles = []
        let width = this.state.width
        let height = this.state.height
        let distance = this.distance
        for(let i = 0; i < 50; i++){
            const radius = 10
            // ensure that particles are spawned at random coordinates 
            let x = this.random_int_from_range(radius, width - radius);
            let y = this.random_int_from_range(radius, height - radius);
           
            const color = 'red'
            // make sure particles are not untop of 1 another 
            if(i !== 0){
                for(let j = 0; j <particles.length; j++){
                    // compare cordinates with util function 
                    if(this.distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0){
                        // re assign x & y vals
                        x = this.random_int_from_range(radius, this.state.width - radius);
                        y = this.random_int_from_range(radius, this.state.height - radius);
                        // restart the loop 
                        j = -1
                    }
                }
            }
            particles.push(this.Particle(x, y, radius))
        }
        this.setState({particles: particles})
    }
    animate(){
        let animate = this.animate
        requestAnimationFrame(animate)
        let c = this.state.C
        let particles = this.state.particles
        let width = this.state.width
        let height = this.state.height
        c.clearRect(0, 0, width, height) 
        particles.forEach(i => i.update(particles))
    }
    random_int_from_range(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    distance(x1, y1, x2, y2) {
        const xDist = x2 - x1
        const yDist = y2 - y1
        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
    }

    render(){
        return(
            <canvas onMouseMove={this.capture_mouse.bind(this)} ref='canvas' width= {this.props.width} height={this.props.height} style={{zIndex: 300, position: 'absolute'}}></canvas>
        )
    }
}

export default Canvas