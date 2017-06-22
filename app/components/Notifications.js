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
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 50,
        padding: 15,
    },
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class Notifications extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        FCM.presentLocalNotification({
            id: '345gfdgsrstrt534', // (optional for instant notification)
            title: 'Notification',  // as FCM payload
            body: 'Test componentDidMount', // as FCM payload (required)
            sound: 'default', // as FCM payload
            priority: 'high', // as FCM payload
            icon: 'ic_launcher', // as FCM payload, you can relace this with custom icon you put in mipmap
            show_in_foreground: true, // notification when app is in foreground (local & remote)
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Button
                        title="Testbutton"
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
