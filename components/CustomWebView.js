/**
 * CustomWebView
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View, WebView} from 'react-native';

const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'rgb(0, 122, 201)',
        flex: 1,
        justifyContent: 'center',
    },
    spinner: {
        marginTop: 100,
        height: 80,
        position: 'absolute',
        zIndex: 2,
    },
    text: {
        color: 'rgb(255, 255, 255)',
        height: 50,
    },
    webView: {
        marginBottom: 50,
        marginTop: (Platform.OS === 'ios') ? 65 : 55,
        width: '100%',
    },
});

class CustomWebView extends Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        // Inner state is bad but at this point it easier
        this.state = {
            loading: true,
        };
    }
    onLoadEnd() {
        this.setState({loading: false});
    }
    render() {
        const {uri} = this.props;
        const {loading} = this.state;
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    style={[styles.centering, styles.spinner]}
                />
                <WebView
                    style={styles.webView}
                    source={{uri}}
                    scalesPageToFit
                    onLoadEnd={this.onLoadEnd}
                />
            </View>
        );
    }
}

CustomWebView.propTypes = {
    uri: React.PropTypes.string.isRequired,
};

export default CustomWebView;
