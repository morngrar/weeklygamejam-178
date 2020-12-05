import {ENTITY_TYPES, getNewChildId} from "../common";


class Entity {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.id = getNewChildId();
        this.type = ENTITY_TYPES.NONE;
        this.ySpeed = 0;
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