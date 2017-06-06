/**
 * SingleNews component
 * @flow
 */

import React, {Component} from 'react';
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
        fontSize: 22,
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

class SingleNews extends Component { // eslint-disable-line react/prefer-stateless-function

    // Handle navigation change in webview and open all links in phone browser
    onNavigationStateChange = (navState) => {
        const {url} = navState;
        if (url.startsWith('http')) {
            this.webview.stopLoading();
            Linking.openURL(url).catch(err => console.log(err));
        }
    }

    closeModal = () => {
        this.props.hide();
    }

    render() {
        const {hide, singleNews} = this.props;
        let img = null;
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
                onRequestClose={this.closeModal}
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
                        ref={(c) => { this.webview = c; }}
                        onNavigationStateChange={this.onNavigationStateChange}
                    />
                </View>
            </Modal>
        );
    }
}

SingleNews.propTypes = {
    hide: React.PropTypes.func.isRequired,
    singleNews: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default SingleNews;
