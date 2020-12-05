import * as common from "../common";

import { Entity } from "./entity";

class GiftEntity extends Entity {
    constructor(screenWidth, screenHeight) {
        let x = Math.random() * screenWidth;

        if (x + common.GIFT_RADIUS > screenWidth)
            x = screenWidth - common.GIFT_RADIUS;
        else if (x - common.GIFT_RADIUS < 0)
            x = 0;

        let position = [x, 0];
        super(position, common.GIFT_RADIUS)
        this.type = common.ENTITY_TYPES.GIFT;
        this.ySpeed = screenHeight * (Math.random() * common.GIFT_MAX_SPEED + common.GIFT_MIN_SPEED);

        // sprites will be added here, i think
    }
}


export { GiftEntity };