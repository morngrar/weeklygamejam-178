import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";


const RADIUS = 25

class Shooter extends PureComponent {

    constructor(props) {
        super(props);
        const HEIGHT = props.screenHeight;
        this.y = HEIGHT * 0.9;

        this.stateGetter = props.state.stateGetter;
    }


    render() {
        const state = this.stateGetter();
        const x = state.x - RADIUS;
        const y = this.y 
        return (
            <View style={
                [
                    state.cooldown ? styles.tappedShooter : styles.shooter, 
                    { left: x, top: y }
                ]
            } />
        );
    }
}

const DIAMETER = RADIUS * 2;

const styles = StyleSheet.create({
  shooter: {
    position: "absolute",
    backgroundColor: "#46915a",
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER,
  },
  tappedShooter: {
    position: "absolute",
    backgroundColor: "blue",
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER,
  }
});

export {Shooter};