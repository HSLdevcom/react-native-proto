/**
 * CameraComponent component
 * @flow
 */

import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Camera from 'react-native-camera';

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 30,
        margin: 40,
    },
});

class CameraComponent extends Component {
    takePicture = () => {
        console.log('KAMERA!');
        console.log(this.camera);
        const options = {};
        //options.location = ...
        this.camera.capture({metadata: options})
          .then(data => console.log(data))
          .catch(err => console.error(err));
    }
    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                >
                    <Text onPress={this.takePicture} style={styles.capture}>[CAPTURE]</Text>
                </Camera>
            </View>
        );
    }
}

export default CameraComponent;
