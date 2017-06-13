/**
 * Main component
 * @flow
 */
import React, {Component} from 'react';
import {Platform} from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import CustomWebView from './CustomWebView';

export const REITTIOPAS_MOCK_URL = 'https://reittiopas.fi/?mock';
export const REITTIOPAS_URL = 'https://reittiopas.fi';


class Main extends Component {

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
        if (Platform.OS === 'ios') FCM.setBadgeNumber(0);
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    }

    render() {
        return (
            <CustomWebView uri={REITTIOPAS_MOCK_URL} />
        );
    }
}

// Main.propTypes = {
//     hideSingleNews: React.PropTypes.func.isRequired,
//     news: React.PropTypes.instanceOf(Immutable.Map).isRequired,
// };

// function mapStateToProps(state) {
//     return {
//         news: state.news,
//     };
// }
// function mapDispatchToProps(dispatch) {
//     return {
//         hideSingleNews: () => dispatch(hideSingleNews()),
//     };
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Main);

export default Main;
