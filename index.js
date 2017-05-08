/**
 * HSL-sovellusproto React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import FakeSideMenu from './app/components/FakeSideMenu';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
// import Test from './app/components/Test';

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const RouterWithRedux = connect()(Router);

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: colors.brandColor,
        opacity: 1,
    },
    iconText: {
        fontSize: 8,
    },
    tabView: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 60,
    },
});

const TabIcon = (props) => {
    const icon = props.materialIcon ?
        <MaterialIcon name={props.iconName} size={props.iconSize} color={props.selected ? 'white' : 'black'} /> :
        <Icon name={props.iconName} size={props.iconSize} color={props.selected ? 'white' : 'black'} />;
    const text = props.title !== '' ?
        (<Text style={[styles.iconText, {color: props.selected ? 'white' : 'black'}]}>
            {props.title}
        </Text>) :
        null;
    return (
        <View style={[styles.tabView]}>
            {icon}
            {text}
        </View>
    );
};

TabIcon.propTypes = {
    iconName: React.PropTypes.string.isRequired,
    iconSize: React.PropTypes.number,
    materialIcon: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
};

TabIcon.defaultProps = {
    iconSize: 18,
    materialIcon: false,
    selected: false,
};

function HSLProto() {
    return (
        <Provider store={store}>
            <RouterWithRedux>
                <Scene key="tabbar" tabs tabBarStyle={styles.tabBarStyle}>
                    <Scene iconName="address" key="homeTab" title="REITTIOPAS" icon={TabIcon}>
                        <Scene key="home" component={Main} title="Reittiopas" />
                    </Scene>
                    <Scene iconName="news" key="newsTab" title="UUTISET" icon={TabIcon}>
                        <Scene key="news" component={News} title="Uutiset" />
                    </Scene>
                    <Scene iconName="ticket" key="mobileTicketTab" title="OSTA LIPPUJA" icon={TabIcon}>
                        <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                    </Scene>
                    <Scene iconName="menu" key="menuTab" title="" icon={TabIcon} iconSize={30} component={FakeSideMenu}>
                        <Scene key="cityBike" title="Kaupunkipyörät" />
                        <Scene key="login" title="Kirjaudu" />
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    );
}

AppRegistry.registerComponent('HSLProto', () => HSLProto);
