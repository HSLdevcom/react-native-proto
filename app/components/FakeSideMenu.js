/**
 * FakeSideMenu component
 * This component is used by react-native-router-flux Scene from index.js and
 * it wraps other views inside itself that are displayed based on active props.name
 * @flow
 */

import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CityBikes from './CityBikes';
import Camera from './Camera';
import Login from './Login';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.brandColor,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    icon: {
        color: 'white',
        marginRight: 20,
    },
    wrapper: {
        alignItems: 'center',
        borderBottomColor: colors.darkGray,
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        paddingBottom: 20,
        marginTop: 20,
        width: '90%',
    },
});

const showCityBikes = () => Actions.cityBike();
const showLogin = () => Actions.login();
const showCamera = () => Actions.camera();

const FakeSideMenu = (props) => {
    if (props.name === 'cityBike') {
        return (
            <CityBikes />
        );
    } else if (props.name === 'login') {
        // TODO: somehow check if there is active login session in WebView and save it to the state
        // then show "logout" or "login" based on that
        return (
            <Login />
        );
    } else if (props.name === 'camera') {
        return <Camera />;
    }
    // Add some "menu like animation" so this maybe feels more like real menu
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, {toValue: 1, duration: 500}).start();

    return (
        <Animated.View
            style={[styles.container, {
                marginLeft: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                }),
            }]}
        >
            <TouchableOpacity style={styles.wrapper} onPress={showCityBikes}>
                <MaterialIcon style={styles.icon} size={26} name="bike" />
                <Text style={styles.buttonText}>Kaupunkipyörät</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wrapper} onPress={showLogin}>
                <Icon style={styles.icon} size={26} name="login" />
                <Text style={styles.buttonText}>Kirjaudu sisään</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wrapper} onPress={showCamera}>
                <Icon style={styles.icon} size={26} name="camera" />
                <Text style={styles.buttonText}>Kamera</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

FakeSideMenu.propTypes = {
    name: React.PropTypes.string.isRequired,
};

export default FakeSideMenu;
