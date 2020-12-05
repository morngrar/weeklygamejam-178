//it's not a lie


import * as common from "../common";

import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

const RADIUS = common.CAKE_RADIUS;

class Cake extends PureComponent {

    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
    }


    render() {
        const x = this.getState().position[0] - RADIUS / 2;
        const y = this.getState().position[1] - RADIUS / 2;
        return (
            <View style={[styles.target, { left: x, top: y }]} />
        );
    }
}


const styles = StyleSheet.create({
  target: {
    position: "absolute",
    backgroundColor: "#d4c99f",
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: 2
  },
});


export { Cake };