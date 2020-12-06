
import React, { PureComponent } from "react";

import { StyleSheet, View, Text } from "react-native";

class ScoreBar extends PureComponent {
    constructor(props) {
        super(props);


        this.styles = StyleSheet.create({
            bar: {
                position: "absolute",
                backgroundColor: "#265aad",
                width: props.width,
                height: props.height,
            },
            text: {
                color: "#e6d087",
            }
        });

        this.getState = props.stateGetter;
    }

    render() {
        const state = this.getState();
        let text = "Score: " + state.score
        return (
            <View style={[this.styles.bar, {left: 0, top: 0}]} >
                <Text style={[this.styles.text, {left: 5, top: 5}]}>
                    {text}
                </Text>
            </View>
        );

    }
}


export { ScoreBar };