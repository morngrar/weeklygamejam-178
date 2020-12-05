
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";


const RADIUS = 5;

class Bullet extends PureComponent {
    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
        this.radius = RADIUS;
        console.log("Bullet created!")
    }

    render() {
        const state = this.getState();
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


const DIAMETER = RADIUS * 2;
const styles = StyleSheet.create({
    bullet: {
        position: "absolute",
        backgroundColor: "#e0d19b",
        width: DIAMETER,
        height: DIAMETER,
        borderRadius: DIAMETER,
    },
});


export { Bullet };