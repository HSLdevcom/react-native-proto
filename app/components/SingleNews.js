/**
 * SingleNews component
 * @flow
 */

import React from 'react';
import {Image, Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import Immutable from 'immutable';
import colors from '../colors';
import {removeMetaFromNewsHtml} from '../utils/helpers';

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
        paddingTop: (Platform.OS === 'ios') ? 30 : 20,
    },
    image: {
        height: 125,
        marginTop: 5,
        width: '100%',
    },
    title: {
        color: colors.brandColor,
        fontSize: 24,
        paddingLeft: 5,
        paddingRight: 5,
        width: '95%',
    },
    text: {
        color: 'black',
        textAlign: 'center',
    },
    webView: {
        marginTop: 10,
        width: '100%',
    },
});

// Define ref to webview
let webview = false;

const closeModal = () => console.log('closed');

// Handle navigation change in webview and open all links in phone browser
const onNavigationStateChange = (navState) => {
    const {url} = navState;
    if (webview && url.startsWith('http')) {
        webview.stopLoading();
        webview.goBack();
        Linking.openURL(url);
    }
};

function SingleNews({hide, singleNews}) {
    let img = null;

    // Before we can use BackHandler, RN / React / RN-router needs an update
    // if (Platform.OS === 'android') {
    //     BackHandler.addEventListener('backPress', () => hide());
    // }

    if (singleNews.get('images') && singleNews.get('images').count() > 0) {
        // TODO: can there be more than one image that we want to show?
        // TODO: is this url valid every time?
        const uri = `https://www.hsl.fi/sites/default/files/uploads/${singleNews.getIn(['images', 0, 'entity', 'filename'])}`;
        img = (<Image
            style={styles.image}
            source={{uri}}
        />);
    }
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
                {img}
                <WebView
                    style={styles.webView}
                    source={{html: removeMetaFromNewsHtml(singleNews.get('body').get('value'))}}
                    ref={(c) => { webview = c; }}
                    onNavigationStateChange={onNavigationStateChange}
                />
            </View>
        </Modal>
    );
}

SingleNews.propTypes = {
    hide: React.PropTypes.func.isRequired,
    singleNews: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default SingleNews;
