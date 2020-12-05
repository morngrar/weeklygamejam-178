
import * as common from "../common";

import { Entity } from "./entity";

class CakeEntity extends Entity {
    constructor(screenWidth, screenHeight) {
        let x = Math.random() * screenWidth;

        if (x + common.CAKE_RADIUS > screenWidth)
            x = screenWidth - common.CAKE_RADIUS;
        else if (x - common.CAKE_RADIUS < 0)
            x = 0;

        let position = [x, 0];
        super(position, common.CAKE_RADIUS)
        this.type = common.ENTITY_TYPES.CAKE;
        this.ySpeed = screenHeight * (Math.random() * common.GIFT_MAX_SPEED + common.GIFT_MIN_SPEED);

        // sprites will be added here, i think
    }
}


export { CakeEntity };