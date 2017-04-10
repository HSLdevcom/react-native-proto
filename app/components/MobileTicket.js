/**
 * MobileTicket component
 * @flow
 */

import React, {Component} from 'react';
import {Linking, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 15,
    },
    header: {
        fontSize: 30,
    },
    text: {
        color: 'black',
        textAlign: 'center',
    },
    button: {
        backgroundColor: colors.brandColor,
        borderColor: colors.lightGrayBg,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        width: '90%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});


class MobileTicket extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        showModal: false,
    }

    closeModal = () => this.setState({showModal: false});

    maybeOpenMobileTicket = () => {
        Linking.canOpenURL('com.hsl.mobiililippu:?tt=1111')
        .then((isInstalled) => {
            if (isInstalled) {
                Linking.openURL('com.hsl.mobiililippu:?tt=1111').catch(e => console.log(e));
            } else {
                this.setState({showModal: true});
            }
        });
    }
    render() {
        const modal = this.state.showModal ?
        (
            <Modal
                animationType="slide"
                transparent={false}
                visible
            >
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>HSL Mobiililippu ei ole asennettuna puhelimeesi.</Text>
                    <TouchableOpacity style={styles.button} onPress={this.closeModal}>
                        <Text style={styles.buttonText}>Sulje</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        ) : null;
        return (
            <View style={styles.container}>
                {modal}
                <Text style={[styles.text, styles.header]}>
                    Osta matkalippu suoraan puhelimeesi
                </Text>
                <Text style={styles.text}>Liput kelpaavat kaikkiin HSL:n kulkuvälineisiin</Text>
                <Text style={styles.text}>
                    Tunnistautumalla saat lippuja yhtä edulliseen
                    hintaan kuin matkakortilla ostettaessa
                </Text>
                <TouchableOpacity style={styles.button} onPress={this.maybeOpenMobileTicket}>
                    <Text style={styles.buttonText}>Kertalippu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.maybeOpenMobileTicket}>
                    <Text style={styles.buttonText}>Vuorokausilippu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.maybeOpenMobileTicket}>
                    <Text style={styles.buttonText}>Kausilippu</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default MobileTicket;
