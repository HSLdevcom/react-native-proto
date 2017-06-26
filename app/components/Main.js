/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {
    AppState,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import {connect} from 'react-redux';
import CustomWebView from './CustomWebView';
import {getBeaconData} from '../actions/beacons';

const beaconConfig = require('../../beaconconfig');

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';

const beaconId = (Platform.OS === 'ios') ?
beaconConfig.beaconId.ios :
beaconConfig.beaconId.android;

const vehicleBeaconId = (Platform.OS === 'ios') ?
beaconConfig.vehicleBeaconId.ios :
beaconConfig.vehicleBeaconId.android;

const liviBeaconId = (Platform.OS === 'ios') ?
beaconConfig.liviBeaconId.ios :
beaconConfig.liviBeaconId.android;

const beaconRegion = beaconConfig.beaconRegion.ios;
const vehicleBeaconRegion = beaconConfig.vehicleBeaconRegion.ios;
const liviBeaconRegion = beaconConfig.liviBeaconRegion.ios;

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    state = {
        appState: AppState.currentState,
    }
    // TODO: check if app can use bluetooth: checkTransmissionSupported(): promise
    componentWillMount = () => {
        if (Platform.OS === 'android') {
            Beacons.detectIBeacons();
        }
        Beacons.startMonitoringForRegion(beaconRegion);
        Beacons.startMonitoringForRegion(vehicleBeaconRegion);
        Beacons.startMonitoringForRegion(liviBeaconRegion);
        if (Platform.OS === 'ios') {
            Beacons.startUpdatingLocation();
        }
        this.props.getBeaconData();
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('MONITORING - regionDidEnter data: ', data);
                this.props.getBeaconData();
            }
        );
        DeviceEventEmitter.addListener(
            'regionDidExit',
            (data) => {
                console.log('MONITORING - regionDidExit data: ', data);
            }
        );
    }

    componentDidMount() {
        if (Platform.OS === 'ios') FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then((token) => {
            console.log(token);
            // store fcm token in your server
        });
        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // there are two parts of notif.
            // notif.notification contains the notification payload
            // notif.data contains data payload
            if (notif.local_notification) {
                //this is a local notification
                console.log('====================================');
                console.log('Local Notification');
                console.log('====================================');
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
                console.log('====================================');
                console.log('App opened through notification');
                console.log('====================================');
            }
            // await someAsyncCall();

            if (Platform.OS === 'ios') {
                //optional
                //iOS requires developers to call completionHandler to end notification process.
                // If you do not call it your background remote notifications could be throttled,
                // to read more about it see the above documentation link.
                // This library handles it for you automatically with default behavior
                // (for remote notification, finish with NoData; for WillPresent,
                // finish depend on "show_in_foreground").
                // However if you want to return different result,
                // follow the following code to override
                // notif._notificationType is available for iOS platfrom
                switch (notif._notificationType) { //eslint-disable-line
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData);
                    //other types available:
                    // RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All);
                    //other types available: WillPresentNotificationResult.None
                    break;
                default:
                    console.log('Invalid notification type');
                    break;
                }
            }
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            console.log(token);
            // fcm token may not be available on first load, catch it here
        });
    }

    componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    }

    // TODO: add options view and define there if user wants to use this with "?mock"?
    render() {
        return (
            <CustomWebView uri={REITTIOPAS_MOCK_URL} />
        );
    }
}

Main.propTypes = {
    getBeaconData: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {

    };
}
function mapDispatchToProps(dispatch) {
    return {
        getBeaconData: () => dispatch(getBeaconData()),
    };
}

export default connect(
     mapStateToProps,
     mapDispatchToProps
 )(Main);
