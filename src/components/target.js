
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

const RADIUS = 25

class Target extends PureComponent {

    constructor(props) {
        super(props);
        // maybe enforce y-coordinate here?
    }


    render() {
        const x = this.props.position[0] - RADIUS / 2;
        const y = this.props.position[1] - RADIUS / 2;
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
    borderRadius: RADIUS * 2
  },
});


export { Target };