/**
 * HSL-sovellusproto React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {ActivityIndicator, AppRegistry, AppState, AsyncStorage, DeviceEventEmitter, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {persistStore} from 'redux-persist';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import immutableTransform from 'redux-persist-transform-immutable';
import Icon from 'react-native-vector-icons/Entypo';
import Beacons from 'react-native-beacons-manager';
import BackgroundJob from 'react-native-background-job';
import store from './app/store';
import colors from './app/colors';
import {getBeaconData, getWorkingBeacons, getWorkingVehicleBeacons, stopRanging} from './app/actions/beacons';
import Main from './app/components/Main';
import FakeSideMenu from './app/components/FakeSideMenu';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
// import Test from './app/components/Test';
const beaconConfig = require('./beaconconfig');

const beaconRegion = beaconConfig.beaconRegion.ios;
const vehicleBeaconRegion = beaconConfig.vehicleBeaconRegion.ios;
const liviBeaconRegion = beaconConfig.liviBeaconRegion.ios;
let rangingStopped = false;

const regionDidExitHandler = (data) => {
    console.log('MONITORING ACTION - regionDidExit data: ', data);
    const beacons = getWorkingBeacons();
    console.log('getWorkingBeacons: ', beacons);
    console.log('getWorkingVehicleBeacons: ', getWorkingVehicleBeacons());
    if (getWorkingVehicleBeacons().length === 0 && (!beacons || !beacons.length)) {
        rangingStopped = true;
        stopRanging();
    }
};
const regionDidEnterHandler = (data) => {
    console.log('MONITORING ACTION - regionDidEnter data: ', data);
    rangingStopped = false;
    store.dispatch(getBeaconData());
};

// How many times backgroundJob is called during this "session"
let backgroundRuns = 0;

const test = () => {
    console.log('Running in background');
    console.log(new Date());
    console.log('AppState.currentState: ', AppState.currentState);
    console.log('backgroundRuns: ', backgroundRuns);
    console.log('rangingStopped: ', rangingStopped);
    /*
    * This is compromise that tries to add region eventlisteners only once while screen is open
    * and background task is looping
    * AppState.currentState is background when phone is in use but this app isn't open
    * AppState.currentState is uninitialized OR active when phone is waked up from sleep and
    * that is the case we want to handle(?)
    * It seems that Android 7 is not stopping monitoring at all even if phone is sleeping
    */
    if (rangingStopped) {
        store.dispatch(getBeaconData());
        rangingStopped = false;
        Beacons.detectIBeacons();
        Beacons.startMonitoringForRegion(beaconRegion);
        Beacons.startMonitoringForRegion(vehicleBeaconRegion);
        Beacons.startMonitoringForRegion(liviBeaconRegion);
        // DeviceEventEmitter.addListener(
        //     'regionDidEnter',
        //     (data) => {
        //         regionDidEnterHandler(data);
        //     }
        // );
        // DeviceEventEmitter.addListener(
        //     'regionDidExit',
        //     (data) => {
        //         regionDidExitHandler(data);
        //     }
        // );
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

        if (Platform.OS === 'android') {
            Beacons.detectIBeacons();
        }
        Beacons.startMonitoringForRegion(beaconRegion);
        Beacons.startMonitoringForRegion(vehicleBeaconRegion);
        Beacons.startMonitoringForRegion(liviBeaconRegion);
        if (Platform.OS === 'ios') {
            Beacons.startUpdatingLocation();
        }
        store.dispatch(getBeaconData());
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                regionDidEnterHandler(data);
            }
        );
        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                regionDidExitHandler(data);
            }
        );
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
        const scenes = Platform.OS === 'android_THIS_IS_DISABLED_NOW' ?
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
                        <Scene key="beacons" title="Beacon" />
                        <Scene key="login" title="Kirjaudu sisään" />
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
                        <Scene key="about" title="Tietoa sovelluksesta" />
                        <Scene key="beacons" title="Beacon" />
                        <Scene key="login" title="Kirjaudu sisään" />
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
