
import * as common from "../common";

import { Entity } from "./entity";

class LaserGunEntity extends Entity {
    constructor(screenWidth, screenHeight) {
        let x = Math.random() * screenWidth;

        if (x + common.POWERUP_RADIUS > screenWidth)
            x = screenWidth - common.POWERUP_RADIUS;
        else if (x - common.POWERUP_RADIUS < 0)
            x = 0;

        let position = [x, 0];
        super(position, common.POWERUP_RADIUS)
        this.type = common.ENTITY_TYPES.LASER_GUN;
        this.ySpeed = screenHeight * (Math.random() * common.GIFT_MAX_SPEED + common.GIFT_MIN_SPEED);

    }
}


export { LaserGunEntity };