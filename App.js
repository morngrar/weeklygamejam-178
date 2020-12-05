
import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, StatusBar } from "react-native";
import { GameLoop } from "react-native-game-engine";
import { BulletContainer } from "./src/bulletContainer";
import { Bullet } from "./src/components/bullet";

// components
import { Shooter } from "./src/components/shooter";
import { Target } from "./src/components/target";

// entities
import { Entity } from "./src/entities/entity";


export const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BULLET_VELOCITY = HEIGHT * 0.02;


let lastBulletId = -1;
function newBulletState(pos) {
  return {
    id: ++lastBulletId,
    position: pos,
    radius: 5,
  };
}

export default class BestGameEver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shooter: {
        x: WIDTH / 2,
        cooldown: 0,
      },
      bullets: [],
      targets: [
        new Entity([WIDTH/2, HEIGHT/2], 25),
      ]
    };

  }

  updateHandler = ({ touches, screen, layout, time }) => {
    let move = touches.find(x => x.type === "move");
    let press = touches.find(x => x.type === "press");
    if (press && !this.state.shooter.cooldown) {

      this.setState({
        ...this.state,
        shooter: {
          ...this.state.shooter,
          cooldown: 25,
        },
        bullets: [
          ...this.state.bullets,
          newBulletState([
            this.state.shooter.x,
            HEIGHT * 0.9 - 30,
          ]),
        ]
      });
    } else if (this.state.shooter.cooldown > 0) {
      this.setState({
        ...this.state,
        shooter: {
          ...this.state.shooter,
          cooldown: --this.state.shooter.cooldown,
        }
      });
    }

    if (touches.find(x => x.type === "long-press")) {
      console.log("long press detected!");
      this.setState(
        {
          ...this.state,
          bullets: [],
        }
      )
    }



    if (move) {
      this.setState({
        ...this.state,
        shooter: {
          x: move.event.pageX,
          cooldown: this.state.shooter.cooldown,
        }
      });
    }

    // Move bullets upward
    let new_bullets = [];
    this.state.bullets.forEach(bullet => {
      bullet.position[1] -= BULLET_VELOCITY;


      // TODO: collision detection against targets
      this.state.targets.forEach(target => {
        if (target.collidesWith(bullet)) {
          this.setState({
            ...this.state,
            targets: this.state.targets.filter(entity => entity.id != target.id)
          });
          bullet = null;
        }
      });

      if (bullet !== null && bullet.position[1] >= 0) {
        new_bullets = [
          ...new_bullets,
          bullet
        ]
      }
    });
    this.setState(
      {
        ...this.state,
        bullets: new_bullets,
      }
    );


  };


  render() {
    // console.log("Main component render with state: ", this.state);
    return (
      <GameLoop style={styles.container} onUpdate={this.updateHandler}>
        <StatusBar hidden={true} />

        <BulletContainer stateGetter={() => this.state.bullets} />

        {this.state.targets.map(target => {
          return (<Target key={target.id} position={target.position} />);
        })}

        <Shooter
          screenHeight={HEIGHT}
          state={{ stateGetter: () => this.state.shooter }} />

      </GameLoop>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#160561"
  },
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);