/**
 * HSL-sovellusproto React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {ActivityIndicator, AppRegistry, AsyncStorage, StyleSheet, Text, View} from 'react-native';
import {persistStore} from 'redux-persist';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import immutableTransform from 'redux-persist-transform-immutable';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import FakeSideMenu from './app/components/FakeSideMenu';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
import Beacon from './app/components/Beacon';
// import Test from './app/components/Test';

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const RouterWithRedux = connect()(Router);

const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.brandColor,
        borderBottomWidth: 1,
        borderColor: colors.brandColor,
        flex: 1,
        justifyContent: 'center',
        marginBottom: 50,
    },
    spinner: {
        height: 80,
        position: 'absolute',
        zIndex: 2,
    },
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
            {props.title.toUpperCase()}
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

class HSLProto extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        rehydrated: false,
    }
    componentWillMount() {
        persistStore(store, {
            storage: AsyncStorage,
            transforms: [immutableTransform()],
        }, () => {
            this.setState({rehydrated: true});
        });
    }
    render() {
        if (!this.state.rehydrated) {
            return (
                <View
                    style={styles.container}
                >
                    <ActivityIndicator
                        animating
                        size="large"
                        style={[styles.centering, styles.spinner]}
                    />
                </View>
            );
        }
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key="tabbar" tabs tabBarStyle={styles.tabBarStyle}>
                        <Scene iconName="address" key="homeTab" title="Reittiopas" icon={TabIcon}>
                            <Scene key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene iconName="news" key="newsTab" title="Ajankohtaista" icon={TabIcon}>
                            <Scene key="news" component={News} title="Ajankohtaista" />
                        </Scene>
                        <Scene iconName="ticket" key="mobileTicketTab" title="Osta lippuja" icon={TabIcon}>
                            <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                        </Scene>
                        <Scene iconName="menu" key="menuTab" title="Lisää" icon={TabIcon} component={FakeSideMenu}>
                            <Scene key="cityBike" title="Kaupunkipyörät" />
                            <Scene key="login" title="Kirjaudu sisään" />
                        </Scene>
                        <Scene iconName="code" key="beaconTab" title="Beacon" icon={TabIcon}>
                            <Scene key="beacons" component={Beacon} title="Beacon" />
                        </Scene>
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('HSLProto', () => HSLProto);
