import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';

import Main from './Main';
import News from './News';
import Test from './Test';
import TicketsAndFares from './TicketsAndFares';

const TabIcon = ({selected, title}) => <Text style={{color: selected ? 'red' : 'black'}}>{title}</Text>;

TabIcon.propTypes = {
    selected: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
};

TabIcon.defaultProps = {
    selected: false,
};

const styles = StyleSheet.create({
    tabBarStyle: {
        borderTopWidth: 0.5,
        borderColor: '#b7b7b7',
        backgroundColor: 'white',
        opacity: 1,
    },
});
class App extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene
                        key="tabbar"
                        tabs
                        tabBarStyle={styles.tabBarStyle}
                        hideNavBar
                    >
                        <Scene key="homeTab" title="Reittiopas" icon={TabIcon}>
                            <Scene key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene key="newsTab" title="Uutiset" icon={TabIcon}>
                            <Scene key="news" component={News} title="Uutiset" />
                        </Scene>
                        <Scene key="ticketsFaresTab" title="Liput ja hinnat" icon={TabIcon}>
                            <Scene key="ticketsAndFares" component={TicketsAndFares} title="Liput ja hinnat" />
                        </Scene>
                        <Scene key="testing" title="Test" icon={TabIcon}>
                            <Scene key="test" component={Test} title="Test" />
                        </Scene>
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

export default App;
