import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(255, 255, 255)',
        width: '100%',
    },
    text: {
        color: 'rgb(17, 17, 17)',
        textAlign: 'center',
    },
});

function Navigation() {
    return (
        <View style={styles.container}>
            <Text style={styles.text} onPress={Actions.main}>Main</Text>
            <Text style={styles.text} onPress={Actions.test}>Test</Text>
        </View>
    );
}

export default Navigation;
