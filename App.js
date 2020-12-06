
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
import * as SQlite from "expo-sqlite";

// components
import { Shooter } from "./src/components/shooter";
import { ScoreBar } from "./src/components/scoreBar";

// entities
import { GiftEntity } from "./src/entities/giftEntity";
import { CakeEntity } from "./src/entities/cakeEntity";
import { BombEntity } from "./src/entities/bombEntity";
import { BladeEntity } from "./src/entities/bladeEntity";
import { LaserGunEntity } from "./src/entities/laserGunEntity";

// misc
import * as common from "./src/common";
import { TargetContainer } from "./src/targetContainer";
import { BulletContainer } from "./src/bulletContainer";


export const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const LOWER_HEIGHT = HEIGHT / 3;
const UPPER_HEIGHT = HEIGHT - LOWER_HEIGHT;

const BULLET_VELOCITY = HEIGHT * 0.02;


function newBulletState(pos) {
  return {
    id: common.getNewChildId(),
    position: pos,
    radius: 5,
    type: common.ENTITY_TYPES.BULLET,
  };
}

function newLaserBulletState(pos) {
  return {
    id: common.getNewChildId(),
    position: pos,
    radius: 10,
    type: common.ENTITY_TYPES.LASER_BULLET,
  };
}

const BLANK_STATE = {
  shooter: {
    x: WIDTH / 2,
    cooldown: 0,
    basket: true,
    laser: false,
  },
  bullets: [],
  targets: [],
  spawnCooldown: 0,
  score: 0,
  scoreMultiplier: 1,
  gameOver: false,
}

const DB = SQlite.openDatabase("giftsnatcher.db");

export default class GiftSnatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...BLANK_STATE,
      highScore: 0
    };


  }

  componentDidMount() {
    DB.transaction(tx => {
      tx.executeSql(
        "create table if not exists highscore (id integer primary key not null, value integer );"
      );
    });


    // load any highscore there may be
    DB.transaction(tx => {
      tx.executeSql(
        "SELECT value FROM highscore",
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            let value = result.rows._array[0].value;
            this.setState({
              ...this.state,
              highScore: value
            })
          }
        },
        (_, result) => {
          console.log("Error in sql query: ", result);
        }
      )
    });

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
      else if (rng < 0.08)
        entity = new BladeEntity(WIDTH, HEIGHT);
      else if (rng < 0.1)
        entity = new LaserGunEntity(WIDTH, HEIGHT);
      else if (rng < 0.3)
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


    
    let press = touches.find(x => x.type === "press");

    // detect swapping of tool    -- presses in the upper two thirds of the screen
    if (press && press.event.pageY < UPPER_HEIGHT) {
      this.setState(
        {
          ...this.state,
          shooter: {
            ...this.state.shooter,
            basket: !this.state.shooter.basket,
          }
        }
      )
    }

    // detecting firing of shots -- presses in the lower half 
    if (
      press
      && press.event.pageY >= UPPER_HEIGHT
      && !this.state.shooter.cooldown
      && !this.state.shooter.basket
    ) {

      if (this.state.shooter.laser) {
        this.setState({
          ...this.state,
          shooter: {
            ...this.state.shooter,
            cooldown: 25,
          },
          bullets: [
            ...this.state.bullets,
            newLaserBulletState([
              this.state.shooter.x,
              HEIGHT * 0.9 - 30,
            ]),
          ]
        });
      } else {
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
      }
    } else if (this.state.shooter.cooldown > 0) {
      this.setState({
        ...this.state,
        shooter: {
          ...this.state.shooter,
          cooldown: --this.state.shooter.cooldown,
        }
      });
    }





    // detect tool movement
    let move = touches.find(x => x.type === "move");
    if (move) {
      this.setState({
        ...this.state,
        shooter: {
          ...this.state.shooter,
          x: move.event.pageX,
          cooldown: this.state.shooter.cooldown,
        }
      });
    }

    // move targets downward
    let new_targets = [];
    this.state.targets.forEach(target => {
      target.position[1] += target.ySpeed;

      // collision detection against basket/gun
      if (
        target.position[0] + target.radius > this.state.shooter.x - common.SHOOTER_RADIUS
        && !(target.position[0] - target.radius > this.state.shooter.x + common.SHOOTER_RADIUS)
        && target.position[1] >= HEIGHT * common.SHOOTER_Y - common.SHOOTER_RADIUS
      ) {
        switch (target.type) {
          case common.ENTITY_TYPES.GIFT:
            if (!this.state.shooter.basket)
              break;

            this.setState({
              ...this.state,
              score: this.state.score + this.state.scoreMultiplier * common.GIFT_SCORE_VALUE,
            });
            break;

          case common.ENTITY_TYPES.CAKE:
            if (!this.state.shooter.basket)
              break;

            this.setState({
              ...this.state,
              score: this.state.score + this.state.scoreMultiplier * common.CAKE_SCORE_VALUE,
              scoreMultiplier: this.state.scoreMultiplier + 1,
            });
            break;

          case common.ENTITY_TYPES.LASER_GUN:
            if (!this.state.shooter.basket)
              break;

            this.setState({
              ...this.state,
              shooter: {
                ...this.state.shooter,
                laser: true,
              }
            });
            break;

          case common.ENTITY_TYPES.BOMB:
            this.setState({
              ...this.state,
              gameOver: true,
            })
            return;

          case common.ENTITY_TYPES.BLADE:
            this.setState({
              ...this.state,
              gameOver: true,
            })
            return;
        }

        if (this.state.shooter.basket)
          return;
      }


      if (target.position[1] > HEIGHT) {
        if (target.type == common.ENTITY_TYPES.BOMB) {
          this.setState({
            ...this.state,
            gameOver: true,
          });
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
          target.type != common.ENTITY_TYPES.BULLET
          && target.collidesWith(bullet)
        ) {
          this.setState({
            ...this.state,
            targets: this.state.targets.filter(entity => entity.id != target.id)
          });

          if (bullet.type == common.ENTITY_TYPES.BULLET)
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


    if (this.state.gameOver) {
      //potentially set highscore
      if (this.state.highScore < this.state.score) {

        let tmp = this.state.highScore; // to know if updating or inserting
        this.setState({
          ...this.state,
          highScore: this.state.score,
        })

        if (tmp > 0) {
          DB.transaction(tx => {
            tx.executeSql(
              "UPDATE highscore SET value = ? WHERE id = 1",
              [this.state.score],
              (_, result) => {

                console.log("Success!")


              },
              (_, result) => {
                console.log("Error in sql query: ", result);
              }
            )
          });
        } else {
          // no previous highscore, insert row
          DB.transaction(tx => {
            tx.executeSql(
              "INSERT INTO highscore (value) VALUES (?)",
              [this.state.score],
              (_, result) => {

                console.log("Success!")

              },
              (_, result) => {
                console.log("Error in sql query: ", result);
              }
            )
          });
        }
      }
    }


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
                  top: HEIGHT / 2 - 90,
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
                  top: HEIGHT / 2 - 40,
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
                  top: HEIGHT / 2 - 40,
                }
              ]
            }>
            {scoreText}
          </Text>


          <Text
            style={
              [
                styles.text,
                {
                  left: common.H_MARGIN,
                  top: HEIGHT / 2 - 40,
                }
              ]
            }>
            {"High Score: "}
          </Text>

          <Text
            style={
              [
                styles.scoreValue,
                {
                  left: common.H_MARGIN,
                  top: HEIGHT / 2 - 40,
                }
              ]
            }>
            {this.state.highScore}
          </Text>

          <Button
            style={[styles.button, { top: HEIGHT - 100 }]}
            title="New Game"
            onPress={() => {
              this.setState({
                ...this.state,
                ...BLANK_STATE,
              })
            }} />


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
    backgroundColor: "#3711a8"
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