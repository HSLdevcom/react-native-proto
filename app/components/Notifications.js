import React, {Component} from 'react';
import {Platform, View, Button, StyleSheet} from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 55,
        marginTop: (Platform.OS === 'ios') ? 63 : 53,
    },
    childContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 50,
        padding: 20,
    },
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class Notifications extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {

    }

    showLocalNotification = () => {
        FCM.presentLocalNotification({
            id: '349753945345345968', // (optional for instant notification)
            title: 'Notification',  // as FCM payload
            body: 'Test Button', // as FCM payload (required)
            sound: 'default', // as FCM payload
            priority: 'high', // as FCM payload
            click_action: 'ACTION',
            icon: 'ic_launcher', // as FCM payload, you can relace this with custom icon you put in mipmap
            show_in_foreground: true, // notification when app is in foreground (local & remote)
        });
    }

    removeNotifications = () => {
        FCM.removeAllDeliveredNotifications();
        if (Platform.OS === 'ios') FCM.setBadgeNumber(0);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Button
                        title="Test Local"
                        onPress={() => this.showLocalNotification()}
                    />
                    <Button
                        title="Remove Badges (iOS)"
                        onPress={() => this.removeNotifications()}
                    />
                </View>
            </View>
        );
    }
}

Notifications.propTypes = {

};

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notifications);
