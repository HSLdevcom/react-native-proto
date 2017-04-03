import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';

import Main from './Main';
import Test from './Test';

class App extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="main" component={Main} title="Main" />
                    <Scene key="test" component={Test} title="Test" />
                </Scene>
            </Router>
        );
    }
}

export default App;
