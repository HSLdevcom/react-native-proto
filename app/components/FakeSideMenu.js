/**
 * FakeSideMenu component
 * This component is used by react-native-router-flux Scene from index.js and
 * it wraps other views inside itself that are displayed based on active props.name
 * @flow
 */

import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CityBikes from './CityBikes';
import Login from './Login';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        width: '90%',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    wrapper: {
        marginTop: 10,
    },
});

const showCityBikes = () => Actions.cityBike();
const showLogin = () => Actions.login();

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
            <View style={styles.wrapper}>
                <MaterialIcon.Button size={15} name="bike" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={showCityBikes}>
                    <Text style={styles.buttonText}>Kaupunkipyörät</Text>
                </MaterialIcon.Button>
            </View>
            <View style={styles.wrapper}>
                <Icon.Button size={15} name="login" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={showLogin}>
                    <Text style={styles.buttonText}>Kirjaudu sisään</Text>
                </Icon.Button>
            </View>
        </Animated.View>
    );
};

FakeSideMenu.propTypes = {
    name: React.PropTypes.string.isRequired,
};

export default FakeSideMenu;
