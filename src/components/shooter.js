import React, { PureComponent } from "react";
import { StyleSheet, Image } from "react-native";
import * as common from "../common";


const RADIUS = common.SHOOTER_RADIUS;

class Shooter extends PureComponent {

  constructor(props) {
    super(props);
    const HEIGHT = props.screenHeight;
    this.y = HEIGHT * common.SHOOTER_Y;

    this.stateGetter = props.state.stateGetter;
  }


  render() {
    const state = this.stateGetter();
    const x = state.x - RADIUS;
    const y = this.y

    if (state.basket) {
      return (
        <Image
          style={[styles.shooter, { left: x, top: y }]}
          source={require("../../assets/basket.png")} />
      );
    } else if (state.laser) {

      if (state.cooldown) {
        return (
          <Image
            style={[styles.shooter, { left: x, top: y }]}
            source={require("../../assets/laser-smoking.png")} />
        );
      } else {
        return (
          <Image
            style={[styles.shooter, { left: x, top: y }]}
            source={require("../../assets/laser-ready.png")} />
        );

      }
    } else {
      if (state.cooldown) {
        return (
          <Image
            style={[styles.shooter, { left: x, top: y }]}
            source={require("../../assets/smoking.png")} />
        );
      } else {
        return (
          <Image
            style={[styles.shooter, { left: x, top: y }]}
            source={require("../../assets/ready.png")} />
        );

      }
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

export { Shooter };