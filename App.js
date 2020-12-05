
import React, { PureComponent } from "react";
import { 
  AppRegistry, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  View, 
  Button,
  Text, 
} from "react-native";
import { GameLoop } from "react-native-game-engine";
import { BulletContainer } from "./src/bulletContainer";

// components
import { Shooter } from "./src/components/shooter";
import { Gift } from "./src/components/gift";
import { ScoreBar } from "./src/components/scoreBar";

// entities
import { Entity } from "./src/entities/entity";
import { GiftEntity } from "./src/entities/giftEntity";
import { CakeEntity } from "./src/entities/cakeEntity";
import { BombEntity } from "./src/entities/bombEntity";

import * as common from "./src/common";
import { TargetContainer } from "./src/targetContainer";


export const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BULLET_VELOCITY = HEIGHT * 0.02;


function newBulletState(pos) {
  return {
    id: common.getNewChildId(),
    position: pos,
    radius: 5,
  };
}

const BLANK_STATE = {
      shooter: {
        x: WIDTH / 2,
        cooldown: 0,
      },
      bullets: [],
      targets: [],
      spawnCooldown: 0,
      score: 0,
      scoreMultiplier: 1,
      gameOver: false,
}

export default class BestGameEver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = BLANK_STATE;
  }

  updateHandler = ({ touches, screen, layout, time }) => {
    if (this.state.spawnCooldown > 0) {
      this.setState({
        ...this.state,
        spawnCooldown: this.state.spawnCooldown - time.delta,
      });
    } else if (this.state.spawnCooldown <= 0) {
      // spawn random target
      // radomly decide target type
      let entity = null;
      let rng = Math.random()
      if (rng > 0.95)
        entity = new CakeEntity(WIDTH, HEIGHT);
        else if (rng < 0.4)
        entity = new BombEntity(WIDTH, HEIGHT);
      else
        entity = new GiftEntity(WIDTH, HEIGHT);

      // add the entity
      this.setState({
        ...this.state,
        targets: [
          ...this.state.targets,
          entity,
        ],
        spawnCooldown: 800 * Math.random() + 800,
      })
    }

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

    // move targets downward
    let new_targets = [];
    this.state.targets.forEach(target => {
      target.position[1] += target.ySpeed;
      // console.log("ySpeed: ", target.ySpeed);
      // console.log("pos: ", target.position);
      // perhaps check for collisions here (net at level2)

      if (target.position[1] > HEIGHT) {
        // if gift, we've snatched it!
        switch (target.type) {
          case common.ENTITY_TYPES.GIFT:
            this.setState({
              ...this.state,
              score: this.state.score + this.state.scoreMultiplier * common.GIFT_SCORE_VALUE,
            });
            break;
          case common.ENTITY_TYPES.CAKE:
            this.setState({
              ...this.state,
              score: this.state.score + this.state.scoreMultiplier * common.CAKE_SCORE_VALUE,
              scoreMultiplier: this.state.scoreMultiplier + 1,
            });
            break;
          case common.ENTITY_TYPES.BOMB:
            this.setState({
              ...this.state,
              gameOver: true,
            })
        }

        // destroy the target
        return;
      }


      new_targets = [
        ...new_targets,
        target,
      ]
    });
    this.setState(
      {
        ...this.state,
        targets: new_targets,
      }
    );

    // Move bullets upward
    let new_bullets = [];
    this.state.bullets.forEach(bullet => {
      bullet.position[1] -= BULLET_VELOCITY;
      let collision = false;

      this.state.targets.forEach(target => {
        if (
          target.type != common.ENTITY_TYPES.NONE
          && target.collidesWith(bullet)
        ) {
          this.setState({
            ...this.state,
            targets: this.state.targets.filter(entity => entity.id != target.id)
          });
          collision = true;
        }


      });

      if (collision) {
        bullet = null;
      }

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
    if (this.state.gameOver) {
      let scoreText = this.state.score
      return (
        <View style={styles.gameOverScreen}>
          <Text
            style={
              [
                styles.text,
                {
                  left: common.H_MARGIN,
                  top: HEIGHT / 2 - 50,
                }
              ]
            }>
            {"Game Over!"}
          </Text>

          <Text
            style={
              [
                styles.text,
                {
                  left: common.H_MARGIN,
                  top: HEIGHT / 2,
                }
              ]
            }>
            {"Score: "}
          </Text>

          <Text
            style={
              [
                styles.scoreValue,
                {
                  left: common.H_MARGIN,
                  top: HEIGHT / 2,
                }
              ]
            }>
            {scoreText}
          </Text>

            <Button style={[styles.button, {top: HEIGHT - 100}]} title="New Game" onPress={() => this.setState(BLANK_STATE)} />


        </View>
      );
    } else {

      return (
        <GameLoop style={styles.container} onUpdate={this.updateHandler}>
          <StatusBar hidden={true} />

          <BulletContainer stateGetter={() => this.state.bullets} />
          <TargetContainer stateGetter={() => this.state.targets} />

          <Shooter
            screenHeight={HEIGHT}
            state={{ stateGetter: () => this.state.shooter }} />

          <ScoreBar width={WIDTH} height={common.SCORE_BAR_HEIGHT} stateGetter={() => this.state} />
        </GameLoop>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#160561"
  },
  gameOverScreen: {
    flex: 2,
    backgroundColor: "#160561"
  },
  text: {
    fontSize: 28,
    color: "white",
  },
  scoreValue: {
    fontSize: 18,
    color: "white",
  },
  button: {
    position: "absolute",
    width: 300
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);