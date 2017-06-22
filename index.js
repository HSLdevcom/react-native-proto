/**
 * HSL-sovellusproto React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {ActivityIndicator, AppRegistry, AsyncStorage, Platform, StyleSheet, Text, View, Image} from 'react-native';
import {persistStore} from 'redux-persist';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import immutableTransform from 'redux-persist-transform-immutable';
import Icon from 'react-native-vector-icons/Entypo';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import FakeSideMenu from './app/components/FakeSideMenu';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
import Beacon from './app/components/Beacon';
// import Test from './app/components/Test';
import CityBikesData from './app/components/CityBikesData';

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
        color: 'white',
        fontSize: 8,
        padding: 3,
    },
    icon: {
        marginBottom: 5,
        marginTop: 5,
        padding: 3,
    },
    tabView: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 60,
    },
});

const getIcon = (icon) => {
    let image;
    switch (icon) {
    case 'reittiopas':
        image = (<Image
            style={[styles.icon, {width: 20, height: 16}]}
            source={require('./app/img/icon-reittiopas.png')} //eslint-disable-line global-require
        />);
        break;
    case 'news':
        image = (<Image
            style={[styles.icon, {width: 16, height: 16}]}
            source={require('./app/img/icon-news.png')} //eslint-disable-line global-require
        />);
        break;
    case 'ticket':
        image = (<Image
            style={[styles.icon, {width: 16, height: 16}]}
            source={require('./app/img/icon-tickets.png')} //eslint-disable-line global-require
        />);
        break;
    case 'more':
        image = (<Image
            style={[styles.icon,
                {width: 20,
                    height: 5,
                    marginBottom: 8,
                    marginTop: 13,
                    padding: 0}]}
            source={require('./app/img/icon-more.png')} //eslint-disable-line global-require
        />);
        break;
    default:
        image = (<Image
            style={[styles.icon, {width: 20, height: 16}]}
            source={require('./app/img/icon-reittiopas.png')} //eslint-disable-line global-require
        />);
    }
    return image;
};

const TabIcon = (props) => {
    const icon = props.HSLIcon ?
        getIcon(props.iconName) :
        <Icon name={props.iconName} size={props.iconSize} color="white" />;
    const text = props.title !== '' ?
        (<Text style={[styles.iconText]}>
            {props.title.toUpperCase()}
        </Text>) :
        null;
    return (
        <View style={[styles.tabView, {borderBottomWidth: props.selected ? 3 : 0, borderBottomColor: 'white'}]}>
            {icon}
            {text}
        </View>
    );
};

TabIcon.propTypes = {
    iconName: React.PropTypes.string.isRequired,
    iconSize: React.PropTypes.number,
    HSLIcon: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
};

TabIcon.defaultProps = {
    iconSize: 18,
    HSLIcon: false,
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
        const scenes = Platform.OS === 'android' ?
            (
                <Scene key="tabbar" tabs tabBarStyle={styles.tabBarStyle}>
                    <Scene HSLIcon iconName="reittiopas" key="homeTab" title="Reittiopas" icon={TabIcon}>
                        <Scene key="home" component={Main} title="Reittiopas" />
                    </Scene>
                    <Scene HSLIcon iconName="news" key="newsTab" title="Ajankohtaista" icon={TabIcon}>
                        <Scene key="news" component={News} title="Ajankohtaista" />
                    </Scene>
                    <Scene HSLIcon iconName="ticket" key="mobileTicketTab" title="Osta lippuja" icon={TabIcon}>
                        <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                    </Scene>
                    <Scene HSLIcon iconName="more" key="menuTab" title="Lisää" icon={TabIcon} component={FakeSideMenu}>
                        <Scene hideNavBar key="camera" title="Kamera" />
                        <Scene key="microphone" title="Äänitys" />
                        <Scene key="nfc" title="NFC" />
                        <Scene key="form" title="Pikapalaute" />
                        <Scene key="cityBike" title="Kaupunkipyörät" />
                        <Scene key="login" title="Kirjaudu sisään" />
                    </Scene>
                    <Scene iconName="code" key="beaconTab" title="Beacon" icon={TabIcon}>
                        <Scene key="beacons" component={Beacon} title="Beacon" />
                    </Scene>
                </Scene>
            ) :
            (
                <Scene key="tabbar" tabs tabBarStyle={styles.tabBarStyle}>
                    <Scene HSLIcon iconName="reittiopas" key="homeTab" title="Reittiopas" icon={TabIcon}>
                        <Scene key="home" component={Main} title="Reittiopas" />
                    </Scene>
                    <Scene HSLIcon iconName="news" key="newsTab" title="Ajankohtaista" icon={TabIcon}>
                        <Scene key="news" component={News} title="Ajankohtaista" />
                    </Scene>
                    <Scene HSLIcon iconName="ticket" key="mobileTicketTab" title="Osta lippuja" icon={TabIcon}>
                        <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                    </Scene>
                    <Scene HSLIcon iconName="more" key="menuTab" title="Lisää" icon={TabIcon} component={FakeSideMenu}>
                        <Scene hideNavBar key="camera" title="Kamera" />
                        <Scene key="microphone" title="Äänitys" />
                        <Scene key="form" title="Pikapalaute" />
                        <Scene key="cityBike" title="Kaupunkipyörät" />
                        <Scene key="login" title="Kirjaudu sisään" />
                    </Scene>
                    <Scene iconName="code" key="beaconTab" title="Beacon" icon={TabIcon}>
                        <Scene key="beacons" component={Beacon} title="Beacon" />
                    </Scene>
                </Scene>
            );
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    {scenes}
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('HSLProto', () => HSLProto);
