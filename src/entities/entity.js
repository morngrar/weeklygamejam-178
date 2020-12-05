

let lastId = -1;

class Entity {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.id = ++lastId;
    }

    collidesWith(entity) {
        return (
            this.position[0] + this.radius > entity.position[0] - entity.radius
            && !(this.position[0] - this.radius > entity.position[0] + entity.radius)
            && this.position[1] + this.radius > entity.position[1] - entity.radius
            && !(this.position[1] - this.radius > entity.position[1] + entity.radius)
        );
    }
}


export { Entity };