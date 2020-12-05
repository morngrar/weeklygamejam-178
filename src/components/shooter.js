import React, { PureComponent } from "react";
import { StyleSheet, Image } from "react-native";


const RADIUS = 35;

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

        if (state.cooldown) {
          return (
            <Image 
                style={[styles.shooter, { left: x, top: y }]} 
                source={require("../../assets/smoking.png")}/>
          );
        } else {
          return (
            <Image 
                style={[styles.shooter, { left: x, top: y }]} 
                source={require("../../assets/ready.png")}/>
          );

        }
    }
}

const DIAMETER = RADIUS * 2;

const styles = StyleSheet.create({
  shooter: {
    position: "absolute",
    width: DIAMETER,
    height: DIAMETER,
  },
});

export {Shooter};