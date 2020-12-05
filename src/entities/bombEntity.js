
import * as common from "../common";

import { Entity } from "./entity";

class BombEntity extends Entity {
    constructor(screenWidth, screenHeight) {
        let x = Math.random() * screenWidth;

        if (x + common.BOMB_RADIUS > screenWidth)
            x = screenWidth - common.BOMB_RADIUS;
        else if (x - common.BOMB_RADIUS < 0)
            x = 0;

        let position = [x, 0];
        super(position, common.BOMB_RADIUS)
        this.type = common.ENTITY_TYPES.BOMB;
        this.ySpeed = screenHeight * (Math.random() * common.GIFT_MAX_SPEED + common.GIFT_MIN_SPEED);

        // sprites will be added here, i think
    }
}


export { BombEntity };