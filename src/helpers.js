export function get_distance(x1, y1, x2 ,y2){
    let x_distance = x2 - x1
    let y_distance = y2 - y1

    return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2))
}

export function random_int_from_range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function random_color(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

export function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
export function rotate(velocity, angle){
    const rotated_velocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    }
    return rotated_velocities
}

export function resolve_collision(particle, other_particle){
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