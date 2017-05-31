/**
 * CameraComponent component
 * @flow
 */

import React, {Component} from 'react';
import {CameraRoll, Dimensions, Image, Linking, ScrollView, TouchableHighlight, StyleSheet, Text, View} from 'react-native';
import Camera from 'react-native-camera';

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
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
    cameraroll: {
        position: 'absolute',
        top: 0,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 30,
        margin: 40,
    },
    disabled: {
        backgroundColor: '#d2d2d2',
        color: '#989898',
    },
    image: {
        width: '100%',
    },
});

/*
* Just to test that camera works
*/
class CameraComponent extends Component {
    state = {
        data: {},
        disableCapture: false,
        showRoll: false,
        photos: false,
    };
    componentDidMount() {
        this.getImages();
    }
    getImages = () => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'All',
        })
        .then(r => this.setState({photos: r.edges}))
        .catch(err => console.log(err));
    }
    readBarCode = (data) => {
        console.log('data: ', data);
        if (
            (data.type === 'org.iso.QRCode' || data.type === 'QR_CODE') &&
            data.data.startsWith('http')
        ) {
            Linking.openURL(data.data).catch(err => console.log(err));
        }
    }
    takePicture = () => {
        this.setState({disableCapture: true});
        // options can include for example location data
        const options = {};
        this.camera.capture({metadata: options})
        .then((data) => {
            console.log(data);
            if (data.mediaUri) {
                this.getImages();
                this.setState({
                    data,
                    disableCapture: false,
                });
            }
        }).catch(err => console.error(err));
    }
    toggleCameraRoll = () => {
        this.setState({showRoll: !this.state.showRoll});
    }
    clearImage = () => {
        this.setState({data: false});
    }
    render() {
        const {data, disableCapture, photos, showRoll} = this.state;
        console.log(photos);
        if (data.mediaUri) {
            return (
                <View style={styles.container}>
                    <Image
                        style={{
                            width,
                            height,
                        }}
                        source={{uri: data.mediaUri}}
                    />
                    <Text
                        style={[styles.capture, styles.cameraroll]}
                        onPress={this.clearImage}
                    >
                        [GO BACK]
                    </Text>
                </View>
            );
        } else if (showRoll) {
            return (
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {
                    photos.map(p =>
                        <TouchableHighlight
                            key={p.node.image.uri}
                            underlayColor="transparent"
                        >
                            <Image
                                style={{
                                    width: (width / 3),
                                    height: (width / 3),
                                }}
                                source={{uri: p.node.image.uri}}
                            />
                        </TouchableHighlight>
                    )
                  }
                    <Text
                        style={[styles.capture]}
                        onPress={this.toggleCameraRoll}
                    >
                        [GO BACK]
                    </Text>
                </ScrollView>
            );
        }
        const captureButton = disableCapture ?
            <Text style={[styles.capture, styles.disabled]}>[CAPTURE]</Text> :
            <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>;
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview} aspect={Camera.constants.Aspect.fill}
                    onBarCodeRead={this.readBarCode}
                >
                    {captureButton}
                    <Text
                        style={[styles.cameraroll, styles.capture]}
                        onPress={this.toggleCameraRoll}
                    >
                        [SHOW CAMERA ROLL]
                    </Text>
                </Camera>
            </View>
        );
    }
}

export default CameraComponent;
