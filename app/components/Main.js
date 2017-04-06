/**
 * Main component
 * @flow
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CustomWebView from './CustomWebView';
import NewsFeed from './NewsFeed';

const styles = StyleSheet.create({
    container: {
        marginBottom: 50,
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
function Main() {
    return (
        <ScrollView contentContainerStyle={styles.scrollView} style={styles.container}>
            <CustomWebView uri="https://reittiopas.fi/" />
            {/* <CustomWebView uri="http://192.168.1.124:8080/" /> */}
            <NewsFeed />
        </ScrollView>
    );
}

export default Main;
