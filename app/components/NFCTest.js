/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NFC, {NfcDataType, NdefRecordType} from 'react-native-nfc';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginTop: 20,
    },
});

class NFCTest extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        payload: false,
    };
    componentDidMount() {
        if (Platform.OS === 'android') {
            NFC.addListener((payload) => {
                console.log('payload: ', payload);
                this.setState({payload});
                switch (payload.type) {
                case NfcDataType.NDEF:
                    this.test(payload);
                    break;
                case NfcDataType.TAG:
                    console.log(`The TAG is non-NDEF:\n${payload.data.description}`);
                    break;
                default:
                    console.log('default');
                    break;
                }
            });
        }
    }
    test = (payload) => {
        const messages = payload.data;
        messages.forEach((message) => {
            message.forEach((records) => {
                if (records.type === NdefRecordType.TEXT) {
                    // do something with the text data
                    console.log(`TEXT tag of type ${records.type} with data ${records.data}`);
                } else {
                    console.log(`Non-TEXT tag of type ${records.type} with data ${records.data}`);
                }
            });
        });
    }
    render() {
        const {payload} = this.state;
        if (payload) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>ID: {payload.data.id}</Text>
                    <Text style={styles.text}>Type: {payload.type}</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Read NFC</Text>
            </View>
        );
    }
}

export default NFCTest;
