
import React, { PureComponent } from "react";

import {Bullet} from "./components/bullet";



class BulletContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
    }

    render() {
        const state = this.getState();
        if (state.length > 0) {
            return (
                state.map(bullet => {
                    return (<Bullet key={bullet.id} stateGetter={() => bullet} />);
                })
            );
        }

        return null;
    }
}


export { BulletContainer };