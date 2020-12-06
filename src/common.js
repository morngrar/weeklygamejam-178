
export const SCORE_BAR_HEIGHT = 30;
export const H_MARGIN = 20;

export const GIFT_SCORE_VALUE = 3;
export const CAKE_SCORE_VALUE = 9;

export const GIFT_RADIUS = 25;
export const CAKE_RADIUS = 30;
export const BOMB_RADIUS = 30;
export const BLADE_RADIUS = 80;
export const POWERUP_RADIUS = 30;

export const ENTITY_TYPES = {
    NONE: "none",
    GIFT: "gift",
    CAKE: "cake",
    BOMB: "bomb",
    BLADE: "blade",
    BULLET: "bullet",
    LASER_GUN: "lasergun",
    LASER_BULLET: "laserbullet",
};
export const GIFT_MAX_SPEED = 0.004;
export const GIFT_MIN_SPEED = 0.002;

let lastChildId = -1;
export function getNewChildId() {
    return ++lastChildId;
}


export const SHOOTER_RADIUS = 35;
export const SHOOTER_Y = 0.9;