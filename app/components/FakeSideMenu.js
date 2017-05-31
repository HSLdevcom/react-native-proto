/**
 * FakeSideMenu component
 * This component is used by react-native-router-flux Scene from index.js and
 * it wraps other views inside itself that are displayed based on active props.name
 * @flow
 */

import React, {Component} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CityBikes from './CityBikes';
import Camera from './Camera';
import Microphone from './Microphone';
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

class FakeSideMenu extends Component { // eslint-disable-line react/prefer-stateless-function
    componentDidUpdate(prevProps) {
        const {routes} = this.props;
        // If user press the more-button twice -> close fake menu and show home
        if (routes.get('scene').name === 'menuTab' && routes.get('scene').name === prevProps.routes.get('scene').name) {
            Actions.homeTab();
        }
    }
    getLoginTitle = () => {
        const {session} = this.props;
        return (session.get('data') && session.get('data').loggedIn)
            ? 'Kirjaudu ulos'
            : 'Kirjaudu sisään';
    }
    showCityBikes = () => Actions.cityBike();
    showLogin = () => Actions.login({title: this.getLoginTitle()});
    showCamera = () => Actions.camera();
    showMicrophone = () => Actions.microphone();
    render() {
        const {name, session} = this.props;
        const loginViewTitle = this.getLoginTitle();
        if (name === 'cityBike') {
            return (
                <CityBikes />
            );
        } else if (name === 'login') {
            // TODO: somehow check if there is active login session in WebView
            // and save it to the state
            // then show "logout" or "login" based on that
            return (
                <Login loggedIn={!!session.get('data')} />
            );
        } else if (name === 'camera') {
            return <Camera />;
        } else if (name === 'microphone') {
            return <Microphone />;
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
                <TouchableOpacity style={styles.wrapper} onPress={this.showCityBikes}>
                    <MaterialIcon style={styles.icon} size={26} name="bike" />
                    <Text style={styles.buttonText}>Kaupunkipyörät</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrapper} onPress={this.showCamera}>
                    <MaterialIcon style={styles.icon} size={26} name="camera" />
                    <Text style={styles.buttonText}>Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrapper} onPress={this.showMicrophone}>
                    <MaterialIcon style={styles.icon} size={26} name="microphone" />
                    <Text style={styles.buttonText}>Äänitys</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrapper} onPress={this.showLogin}>
                    <Icon style={styles.icon} size={26} name="login" />
                    <Text style={styles.buttonText}>{loginViewTitle}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

FakeSideMenu.propTypes = {
    name: React.PropTypes.string.isRequired,
    routes: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    session: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
    return {
        session: state.session,
        routes: state.routes,
    };
}

export default connect(
    mapStateToProps,
    null,
)(FakeSideMenu);
