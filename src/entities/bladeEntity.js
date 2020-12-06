

import * as common from "../common";

import { Entity } from "./entity";

class BladeEntity extends Entity {
    constructor(screenWidth, screenHeight) {
        let x = Math.random() * screenWidth;

        if (x + common.BLADE_RADIUS > screenWidth)
            x = screenWidth - common.BLADE_RADIUS;
        else if (x - common.BLADE_RADIUS < 0)
            x = 0;

        let position = [x, 0];
        super(position, common.BLADE_RADIUS)
        this.type = common.ENTITY_TYPES.BLADE;
        this.ySpeed = screenHeight * (Math.random() * common.GIFT_MAX_SPEED + common.GIFT_MIN_SPEED);

    }
}


export { BladeEntity };