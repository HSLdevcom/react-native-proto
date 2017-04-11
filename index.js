/**
 * Sample HSL React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {AppRegistry, StyleSheet, Text} from 'react-native';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import News from './app/components/NewsFeed';
import Test from './app/components/Test';
import TicketsAndFares from './app/components/TicketsAndFares';

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const RouterWithRedux = connect()(Router);

const TabIcon = ({selected, title}) => <Text style={{color: selected ? colors.brandColor : 'black'}}>{title}</Text>;

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
        backgroundColor: colors.lightGrayBg,
        opacity: 1,
    },
});

function HSLReactNativeProto() {
    return (
        <Provider store={store}>
            <RouterWithRedux>
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
            </RouterWithRedux>
        </Provider>
    );
}

AppRegistry.registerComponent('HSLReactNativeProto', () => HSLReactNativeProto);
