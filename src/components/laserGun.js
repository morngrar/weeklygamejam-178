
import * as common from "../common";

import React, { PureComponent } from "react";
import { StyleSheet, Image } from "react-native";

const RADIUS = common.POWERUP_RADIUS;

class LaserGunPowerup extends PureComponent {

    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
    }


    render() {
        const x = this.getState().position[0] - RADIUS / 2;
        const y = this.getState().position[1] - RADIUS / 2;
        return (
            <Image 
                style={[styles.target, { left: x, top: y }]} 
                source={require("../../assets/laserpickup.png")}/>
        );
    }
}


const styles = StyleSheet.create({
  target: {
    position: "absolute",
    width: RADIUS * 2,
    height: RADIUS * 2,
  },
});


export { LaserGunPowerup };