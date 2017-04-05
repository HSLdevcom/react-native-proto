import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
// import {connect} from 'react-redux';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        paddingTop: 10,
    },
    text: {
        color: colors.brandColor,
    },
});
class NewsFeed extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello from NewsFeed.js</Text>
                <Text style={styles.text}>Hello from NewsFeed.js</Text>
                <Text style={styles.text}>Hello from NewsFeed.js</Text>
                <Text style={styles.text}>Hello from NewsFeed.js</Text>
            </View>
        );
    }
}

export default NewsFeed;
