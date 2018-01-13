import {random_color} from '../helpers'
const colors = [
    '#56B9D0',
    '#981e89',
    '#FBBA42',
    '#F24C27',
    '#3B3F42'
]

export default class Particle {
    constructor(args){
        this.x = args.x
        this.y = args.y
        this.opacity = 1
        this.velocity = {
            x: (Math.random() - .5)*5,
            y: (Math.random() - .5)*5
        }
       
        this.mass = 1
        this.radius = args.radius
        this.min_radious = this.radius
        this.color = random_color(colors)
    }
    draw(c){
        c.beginPath();
        c.arc(this.x , this.y , this.radius, 0 , Math.PI*2, false)
        c.globalAlpha = this.opacity
        c.fillStyle = this.color
        c.fill()
        c.restore()
        c.strokeStyle = this.color
        c.stroke()
        c.closePath()
    }
    update(context){
        
            // bounce off edge
            if(this.x - this.radius <= 0 || this.x + this.radius >= window.innerWidth){
                this.velocity.x = - this.velocity.x
            }
            if(this.y - this.radius <= 0 || this.y + this.radius >= window.innerHeight){
                this.velocity.y = - this.velocity.y
            }
        //
        this.x += this.velocity.x
        this.y += this.velocity.y
        //Draw
        this.draw(context)
    }
}