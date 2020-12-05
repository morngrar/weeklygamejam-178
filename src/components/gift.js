
import * as common from "../common";

import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

const RADIUS = common.GIFT_RADIUS;

class Gift extends PureComponent {

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
    backgroundColor: "red",
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: 2
  },
});


export { Gift };