/**
 * SingleNews component
 * @flow
 */

import React from 'react';
import {Modal, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import Immutable from 'immutable';
import colors from '../colors';

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.brandColor,
        borderColor: colors.lightGrayBg,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        width: '50%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: (Platform.OS === 'ios') ? 63 : 53,
    },
    title: {
        color: colors.brandColor,
        fontSize: 24,
    },
    text: {
        color: 'black',
    },
    webView: {
        marginTop: 10,
        width: '100%',
    },
});

const closeModal = () => console.log('closed');

function SingleNews({hide, singleNews}) {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible
            onRequestClose={closeModal}
        >
            <View style={[styles.container]}>
                <TouchableOpacity style={styles.button} onPress={hide}>
                    <Text style={styles.buttonText}>Sulje</Text>
                </TouchableOpacity>
                <Text style={[styles.text, styles.title]}>{singleNews.get('title')}</Text>
                <WebView style={styles.webView} source={{html: singleNews.get('body').get('value')}} />
            </View>
        </Modal>
    );
}

SingleNews.propTypes = {
    hide: React.PropTypes.func.isRequired,
    singleNews: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default SingleNews;
