
import React, { PureComponent } from "react";

import * as common from "./common";
import { Gift } from "./components/gift";



class TargetContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.getState = props.stateGetter;
    }

    render() {
        const state = this.getState();
        if (state.length > 0) {
            return (
                state.map(target => {
                    switch (target.type) {
                        case common.ENTITY_TYPES.GIFT:
                            return (<Gift key={target.id} stateGetter={() => target} />);

                        default: return null;

                    }
                })
            );
        }

        return null;
    }
}


export { TargetContainer };