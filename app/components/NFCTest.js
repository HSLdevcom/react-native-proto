/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import NFC, {NfcDataType, NdefRecordType} from 'react-native-nfc';
import {View, StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});

class NFCTest extends Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        if (Platform.OS === 'android') {
            console.log('NFC');
            NFC.addListener((payload) => {
                console.log('payload.type: ', payload.type);
                switch (payload.type) {
                case NfcDataType.NDEF:
                    this.test(payload);
                    break;
                case NfcDataType.TAG:
                    console.log(`The TAG is non-NDEF:\n\n${payload.data.description}`);
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
        return <View style={styles.container} />;
    }
}

export default NFCTest;
