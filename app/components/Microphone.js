/**
 * MicrophoneComponent component
 * based on https://github.com/jsierles/react-native-audio/blob/master/AudioExample/AudioExample.js
 * @flow
 */

import React, {Component} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 20,
        fontSize: 50,
        color: '#8e2020',
    },
    button: {
        padding: 20,
    },
    disabledButtonText: {
        color: '#eee',
    },
    buttonText: {
        fontSize: 20,
        color: '#202020',
    },
    activeButtonText: {
        fontSize: 20,
        color: '#B81F00',
    },
});

/*
* Just to test that this works
*/
class MicrophoneComponent extends Component {
    state = {
        currentTime: 0.0,
        recording: false,
        stoppedRecording: false,
        finished: false,
        audioPath: `${AudioUtils.DocumentDirectoryPath}/test.aac`,
        hasPermission: undefined,
    };

    componentDidMount() {
        this.checkPermission()
        .then((hasPermission) => {
            this.setState({hasPermission});
            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);
            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this.finishRecording(data.status === 'OK', data.audioFileURL);
                }
            };
        });
    }

    prepareRecordingPath = (audioPath) => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: 'Low',
            AudioEncoding: 'aac',
            AudioEncodingBitRate: 32000,
        });
    }

    finishRecording = (didSucceed, filePath) => {
        this.setState({finished: didSucceed});
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

    checkPermission = () => {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            title: 'Microphone Permission',
            message: 'AudioExample needs access to your microphone so you can record audio.',
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
        .then((result) => {
            console.log('Permission result:', result);
            return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
    }

    async record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true});

        try {
            await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }
    async stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
        } catch (error) {
            console.error(error);
        }
    }
    async play() {
        if (this.state.recording) {
            await this.stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            const sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
                console.log(sound);
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            });
        }, 100);
    }
    renderButton = (title, onPress, active) => {
        const style = (active) ? styles.activeButtonText : styles.buttonText;
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    {this.renderButton('PLAY', () => { this.play(); })}
                    {this.renderButton('RECORD', () => { this.record(); }, this.state.recording)}
                    {this.renderButton('STOP', () => { this.stop(); })}
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                </View>
            </View>
        );
    }
}

export default MicrophoneComponent;
