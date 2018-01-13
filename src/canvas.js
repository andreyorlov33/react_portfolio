// process
// 1 objects cannot spawn untop of each other
// 2 for each particle you need to calculate the distance appart from themsleves and every other particle
// 3 once particles have colided we need to change their movement in a realistic manner

// Initial Setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// Variables
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['yellow', 'blue', 'red', 'green']

// Event Listeners

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
})

addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

// Utility Functions
function get_distance(x1, y1, x2 ,y2){
    let x_distance = x2 - x1
    let y_distance = y2 - y1

    return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2))
}

function random_int_from_range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function random_color(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
function rotate(velocity, angle){
    const rotated_velocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    }
    return rotated_velocities
}

function resolve_collision(particle, other_particle){
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
        const u1 = rotate(particle.velocity, angle)
        const u2 = rotate(other_particle.velocity, angle)
        // velocirt after collision detection
        const v1 = { x: u1.x * (m1-m2)/(m1+m2)+u2.x*2*m2/(m1+m2), y: u1.y}
        const v2 = { x: u2.x * (m1-m2)/(m1+m2)+u1.x*2*m2/(m1+m2), y: u2.y}
        // final velocity after rotating axis back to the original location
        const f_v_p1 = rotate(v1, -angle)
        const f_v_p2 = rotate(v2, -angle)
        // swap particle velocities for realistic bounce effect
        particle.velocity.x = f_v_p1.x
        particle.velocity.y = f_v_p1.y

        other_particle.velocity.x = f_v_p2.x
        other_particle.velocity.y = f_v_p2.y
    }
}
// Objects
function Particle(x, y, radius, color) {
    this.x = x
    this.y = y
    this.opacity = 0
    this.velocity = {
        x: (Math.random() - .5)*5,
        y: (Math.random() - .5)*5
    }
    this.mass = 1
    this.radius = radius
    this.color = random_color(colors)
    // collision detection
    this.update = particles => { 
        this.draw()
        for(let i = 0; i < particles.length; i++){
            if(this === particles[i]) continue;
            if(get_distance(this.x,this.y,particles[i].x,particles[i].y)- this.radius * 2 < 0){
                resolve_collision(this, particles[i])
            }
        }
        // function to bounce particles off screen bounds
        if(this.x - this.radius <= 0 || this.x + this.radius >= innerWidth){
            this.velocity.x = - this.velocity.x
        }
        if(this.y - this.radius <= 0 || this.y + this.radius >= innerHeight){
            this.velocity.y = - this.velocity.y
        }
        // mouse collision detection
        if(distance(mouse.x, mouse.y, this.x, this.y) < 50 && this.opacity < .2){
            this.opacity += .5
        } else if(this.opacity > 0){
            this.opacity -= .5
            this.opacity = Math.max(0, this.opacity)
        }
        // implement movement by adding the velocity to the current x and y positions
        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
    this.draw =()=> {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.save()
        c.globalAlpha = this.opacity
        c.fillStyle = this.color 
        c.fill()
        c.restore()
       
        c.strokeStyle = this.color
        c.stroke()
        c.closePath()
    }
}

// Implementation
let particles 
function init() {
    particles = []
    for(let i = 0; i < 50; i++){
        const radius = 10
        // ensure that particles are spawned at random coordinates 
        let x = random_int_from_range(radius, canvas.width - radius);
        let y = random_int_from_range(radius, canvas.height - radius);
       
        const color = 'red'
        // make sure particles are not untop of 1 another 
        if(i !== 0){
            for(let j = 0; j <particles.length; j++){
                // compare cordinates with util function 
                if(distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0){
                    // re assign x & y vals
                    x = random_int_from_range(radius, canvas.width - radius);
                    y = random_int_from_range(radius, canvas.height - radius);
                    // restart the loop 
                    j = -1
                }
            }
        }
        particles.push(new Particle(x, y, radius, color))
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height) 
    particles.forEach(i => i.update(particles))
}

init()
animate()