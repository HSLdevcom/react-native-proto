/**
 * Sample HSL React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
// import Test from './app/components/Test';

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
        marginTop: 3,
    },
});

const TabIcon = props =>
    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Icon name={props.iconName} size={15} color={props.selected ? 'white' : 'black'} />
        <Text style={[styles.iconText, {color: props.selected ? 'white' : 'black'}]}>
            {props.title}
        </Text>
    </View>;

TabIcon.propTypes = {
    iconName: React.PropTypes.string.isRequired,
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
                        <Scene iconName="address" key="homeTab" title="REITTIOPAS" icon={TabIcon}>
                            <Scene key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene iconName="news" key="newsTab" title="UUTISET" icon={TabIcon}>
                            <Scene key="news" component={News} title="Uutiset" />
                        </Scene>
                        <Scene iconName="ticket" key="mobileTicketTab" title="OSTA LIPPUJA" icon={TabIcon}>
                            <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                        </Scene>
                        {/* <Scene key="testing" title="TEST" icon={TabIcon}>
                            <Scene key="test" component={Test} title="Test" />
                        </Scene> */}
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    );
}

AppRegistry.registerComponent('HSLReactNativeProto', () => HSLReactNativeProto);
