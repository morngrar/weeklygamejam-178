
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { ENTITY_TYPES } from "../common";


const RADIUS = 5;
const LASER_RADIUS = 10;

class Bullet extends PureComponent {
    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
        if (this.getState().type == ENTITY_TYPES.LASER_BULLET)
            this.radius = LASER_RADIUS;
        else
            this.radius = RADIUS;
    }

    render() {
        const state = this.getState();
        if (state.type == ENTITY_TYPES.LASER_BULLET) {

            return (
                <View style={[
                    styles.laserBullet,
                    //vector so I can use velocity
                    {
                        left: state.position[0] - RADIUS,
                        top: state.position[1] - RADIUS
                    }
                ]} />)

        } else {

            return (
                <View style={[
                    styles.bullet,
                    //vector so I can use velocity
                    {
                        left: state.position[0] - RADIUS,
                        top: state.position[1] - RADIUS
                    }
                ]} />
            );
        }
    }
}


const DIAMETER = RADIUS * 2;
const LASER_DIAMETER = LASER_RADIUS * 2;
const styles = StyleSheet.create({
    bullet: {
        position: "absolute",
        backgroundColor: "#e0d19b",
        width: DIAMETER,
        height: DIAMETER,
        borderRadius: DIAMETER,
    },
    laserBullet: {
        position: "absolute",
        backgroundColor: "#ff3224",
        width: LASER_DIAMETER,
        height: LASER_DIAMETER,
        borderRadius: LASER_DIAMETER,
    }
});


export { Bullet };