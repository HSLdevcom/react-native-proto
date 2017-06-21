/**
 * HSL-sovellusproto React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {ActivityIndicator, AppRegistry, AppState, AsyncStorage, DeviceEventEmitter, Platform, StyleSheet, Text, View} from 'react-native';
import {persistStore} from 'redux-persist';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import immutableTransform from 'redux-persist-transform-immutable';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Beacons from 'react-native-beacons-manager';
import BackgroundJob from 'react-native-background-job';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import FakeSideMenu from './app/components/FakeSideMenu';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
import Beacon from './app/components/Beacon';
// import Test from './app/components/Test';
const beaconConfig = require('./beaconconfig');

// How many times backgroundJob is called during this "session"
let backgroundRuns = 0;

const test = () => {
    console.log('Running in background');
    console.log(new Date());
    console.log('AppState.currentState: ', AppState.currentState);
    console.log('backgroundRuns: ', backgroundRuns);
    /*
    * This is compromise that tries to add region eventlisteners only once while screen is open
    * and background task is looping
    * AppState.currentState is background when phone is in use but this app isn't open
    * AppState.currentState is uninitialized OR active when phone is waked up from sleep and
    * that is the case we want to handle(?)
    * It seems that Android 7 is not stopping monitoring at all even if phone is sleeping
    */
    if (backgroundRuns === 0 && AppState.currentState !== 'background') {
        Beacons.stopMonitoringForRegion(beaconConfig.vehicleBeaconRegion.ios);
        Beacons.detectIBeacons();
        Beacons.startMonitoringForRegion(beaconConfig.vehicleBeaconRegion.ios)
        .then(() => console.log('startMonitoringForRegion vehicleBeaconRegion'))
        .catch(e => console.log(e));
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('MONITORING - regionDidEnter data: ', data);
            }
        );
        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('MONITORING - regionDidExit data: ', data);
            }
        );
    }
    backgroundRuns += 1;
};

const handleAppStateChange = (nextAppState) => {
    console.log('nextAppState: ', nextAppState);
    if (nextAppState === 'background') {
        const backgroundSchedule = {
            jobKey: 'testBackgroundJob',
            timeout: 60000,
            period: 15000, //android sdk version affects how this time is handled
        };
        console.log('schedule gogo!');
        BackgroundJob.schedule(backgroundSchedule);
    } else if (nextAppState === 'active') {
        BackgroundJob.cancelAll();
    }
};

if (Platform.OS === 'android') {
    const backgroundJob = {
        jobKey: 'testBackgroundJob',
        job: () => test(),
    };

    BackgroundJob.register(backgroundJob);
    AppState.addEventListener('change', handleAppStateChange);
}
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
        const scenes = Platform.OS === 'android' ?
            (
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
