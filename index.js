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

const beaconRegion = beaconConfig.beaconRegion;
const vehicleBeaconRegion = beaconConfig.vehicleBeaconRegion;
const liviBeaconRegion = beaconConfig.liviBeaconRegion;
let rangingStopped = false;

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const regionDidExitHandler = (data) => {
    console.log('MONITORING ACTION - regionDidExit data: ', data);
    const stopBeacons = getWorkingBeacons();
    const vehicleBeacons = getWorkingVehicleBeacons();
    /*
    * If there isn't any beacons in store, stop all ranging
    * otherwise stop vehicle / stop beacons ranging
    * stopRanging = (onlyVehicleBeacons = false, onlyStopBeacons = false)
    */
    if ((!vehicleBeacons || !vehicleBeacons.length) && (!stopBeacons || !stopBeacons.length)) {
        rangingStopped = true;
        stopRanging();
    } else if (!vehicleBeacons || !vehicleBeacons.length) {
        stopRanging(true);
    } else if (!stopBeacons || !stopBeacons.length) {
        stopRanging(false, true);
    }
};

const regionDidEnterHandler = (data) => {
    console.log('MONITORING ACTION - regionDidEnter data: ', data);
    rangingStopped = false;
    /*
    * Start ranging in certain region or in all regions if any spesific uuid isn't present
    * getBeaconData = (
        onlyBeaconRegion = false,
        onlyLiviBeaconRegion = false,
        onlyVehicleBeaconRegion = false,
    )
    */
    if (data.uuid.toLowerCase() === beaconRegion.uuid.toLowerCase()) {
        store.dispatch(getBeaconData(true));
    } else if (data.uuid.toLowerCase() === liviBeaconRegion.uuid.toLowerCase()) {
        store.dispatch(getBeaconData(false, true));
    } else if (data.uuid.toLowerCase() === vehicleBeaconRegion.uuid.toLowerCase()) {
        store.dispatch(getBeaconData(false, false, true));
    } else {
        store.dispatch(getBeaconData());
    }
};

/*
* Android spesific beacons handling in background job
* There's differences between Android SDK versions...
*/
const detectAndStartMonitoring = () => {
    Beacons.detectIBeacons();
    Beacons.startMonitoringForRegion(beaconRegion);
    Beacons.startMonitoringForRegion(vehicleBeaconRegion);
    Beacons.startMonitoringForRegion(liviBeaconRegion);
};

const androidBackgroundJob = () => {
    /*
    * This tries to add region event listeners only when there isn't one already defined.
    * Otherwise just start to detectIBeacons and region monitoring (at least Android 5.x needs this)
    * It seems that Android 6 and 7 are not stopping ranging at all even if phone is sleeping
    * so we might want TODO something to that because phone battery is dry very quickly if
    * ranging is on long time.
    */
    if (
        DeviceEventEmitter._subscriber._subscriptionsForType.appStateDidChange[0] && // eslint-disable-line
        !DeviceEventEmitter._subscriber._subscriptionsForType.appStateDidChange[0].subscriber._subscriptionsForType.regionDidExit // eslint-disable-line
    ) {
        // We assume that regionDidEnter is also undefined if regionDidExit is
        // It seems that this situation comes only with Android 5.x
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
        detectAndStartMonitoring();
        // Just in case run getBeaconData
        store.dispatch(getBeaconData());
    } else if (rangingStopped) {
        rangingStopped = false;
        detectAndStartMonitoring();
    }
};

const handleAppStateChange = (nextAppState) => {
    console.log('nextAppState: ', nextAppState);
    if (nextAppState === 'background') {
        const backgroundSchedule = {
            jobKey: 'androidBackgroundJob',
            timeout: 60000,
            period: 10000, //android sdk version affects how this time is handled
        };
        console.log('schedule gogo!');
        BackgroundJob.schedule(backgroundSchedule);
    } else if (nextAppState === 'active') {
        BackgroundJob.cancelAll();
    }
};

/*
* Start background job in Android to handle beacons region scan etc.
*/
if (Platform.OS === 'android') {
    const backgroundJob = {
        jobKey: 'androidBackgroundJob',
        job: () => androidBackgroundJob(),
    };

    BackgroundJob.register(backgroundJob);
    AppState.addEventListener('change', handleAppStateChange);
}

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
        // https://github.com/rt2zz/redux-persist
        persistStore(store, {
            storage: AsyncStorage,
            transforms: [immutableTransform()],
        }, () => {
            this.setState({rehydrated: true});
        });

        // Start handling beacons
        if (Platform.OS === 'android') {
            Beacons.detectIBeacons();
        }
        Beacons.startMonitoringForRegion(vehicleBeaconRegion);
        Beacons.startMonitoringForRegion(beaconRegion);
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
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key="tabbar" tabs tabBarStyle={styles.tabBarStyle}>
                        <Scene HSLIcon iconName="reittiopas" key="homeTab" title="Reittiopas" icon={TabIcon}>
                            <Scene hideNavBar key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene HSLIcon iconName="news" key="newsTab" title="Ajankohtaista" icon={TabIcon}>
                            <Scene hideNavBar key="news" component={News} title="Ajankohtaista" />
                        </Scene>
                        <Scene HSLIcon iconName="ticket" key="mobileTicketTab" title="Osta lippuja" icon={TabIcon}>
                            <Scene hideNavBar key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                        </Scene>
                        <Scene hideNavBar HSLIcon iconName="more" key="menuTab" title="Lisää" icon={TabIcon} component={FakeSideMenu}>
                            <Scene hideNavBar key="camera" title="Kamera" />
                            <Scene hideNavBar key="microphone" title="Äänitys" />
                            <Scene hideNavBar key="form" title="Pikapalaute" />
                            <Scene hideNavBar key="cityBike" title="Kaupunkipyörät" />
                            <Scene hideNavBar key="about" title="Tietoa sovelluksesta" />
                            <Scene hideNavBar key="beacons" title="Beacon" />
                            <Scene hideNavBar key="login" title="Kirjaudu sisään" />
                        </Scene>
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('HSLProto', () => HSLProto);
