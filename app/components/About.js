/**
 * About component
 * @flow
 */

import React, {Component} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from './Camera';
import Microphone from './Microphone';
import NFCTest from './NFCTest';
import WebSurvey from './WebSurvey';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.brandColor,
        marginBottom: 50,
        paddingTop: (Platform.OS === 'ios') ? 15 : 0,
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        padding: 5,
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
    text: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
    },
    textWrapper: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '90%',
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

class About extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        name: '',
    }
    showCamera = () => this.setState({name: 'camera'});
    showMicrophone = () => this.setState({name: 'microphone'});
    showNFC = () => this.setState({name: 'nfc'});
    showForm = () => this.setState({name: 'form'});
    render() {
        const {name} = this.state;
        if (name === 'camera') {
            return <Camera />;
        } else if (name === 'microphone') {
            return <Microphone />;
        } else if (name === 'nfc') {
            return <NFCTest />;
        } else if (name === 'form') {
            return <WebSurvey />;
        }
        const nfcElement = Platform.OS === 'android' ?
            (
                <TouchableOpacity style={styles.wrapper} onPress={this.showNFC}>
                    <MaterialIcon style={styles.icon} size={26} name="nfc" />
                    <Text style={styles.buttonText}>NFC</Text>
                </TouchableOpacity>
            ) : null;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.textWrapper}>
                    <Text style={[styles.text, {fontSize: 30, marginTop: 10}]}>
                        HSL-sovellusproto
                    </Text>
                    <Text style={styles.text}>
                        {'Tämä on varhaisessa kehitysvaiheessa oleva sovellus, joka saattaa olla joiltain osin epävakaa. \n\n Alla on joitain toiminnallisuuksia, jotka ovat mukana testimielessä, mutta eivät ole vielä osana mitään suurempaa toiminnallisuutta.'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.wrapper} onPress={this.showCamera}>
                    <MaterialIcon style={styles.icon} size={26} name="camera" />
                    <Text style={styles.buttonText}>Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrapper} onPress={this.showMicrophone}>
                    <MaterialIcon style={styles.icon} size={26} name="microphone" />
                    <Text style={styles.buttonText}>Äänitys</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wrapper} onPress={this.showForm}>
                    <MaterialIcon style={styles.icon} size={26} name="file-document" />
                    <Text style={styles.buttonText}>Pikapalaute</Text>
                </TouchableOpacity>
                {nfcElement}
            </ScrollView>
        );
    }
}

export default About;
