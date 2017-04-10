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
import MobileTicket from './app/components/MobileTicket';
import Test from './app/components/Test';

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const RouterWithRedux = connect()(Router);

const styles = StyleSheet.create({
    tabBarStyle: {
        borderTopWidth: 0.5,
        borderColor: '#b7b7b7',
        backgroundColor: colors.brandColor,
        opacity: 1,
    },
    iconText: {
        fontSize: 12,
    },
});

const TabIcon = ({selected, title}) => <Text style={[styles.iconText, {color: selected ? 'white' : 'black'}]}>{title}</Text>;

TabIcon.propTypes = {
    selected: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
};

TabIcon.defaultProps = {
    selected: false,
};

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
                        <Scene key="homeTab" title="REITTIOPAS" icon={TabIcon}>
                            <Scene key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene key="mobileTicketTab" title="OSTA LIPPUJA" icon={TabIcon}>
                            <Scene key="mobileTicket" component={MobileTicket} title="Mobiililippu" />
                        </Scene>
                        <Scene key="testing" title="TEST" icon={TabIcon}>
                            <Scene key="test" component={Test} title="Test" />
                        </Scene>
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    );
}

AppRegistry.registerComponent('HSLReactNativeProto', () => HSLReactNativeProto);
