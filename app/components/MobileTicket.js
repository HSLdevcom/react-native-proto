/**
 * MobileTicket component
 * @flow
 */

import React, {Component} from 'react';
import {Linking, Modal, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 15,
    },
    header: {
        color: colors.brandColor,
        fontSize: 30,
        marginBottom: 15,
    },
    text: {
        color: 'black',
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        width: '90%',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    wrapper: {
        marginTop: 10,
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
                    <View style={styles.wrapper}>
                        <Icon.Button name="cross" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={this.closeModal}>
                            <Text style={styles.buttonText}>Sulje</Text>
                        </Icon.Button>
                    </View>
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
                <View style={styles.wrapper}>
                    <Icon.Button size={15} name="ticket" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={this.maybeOpenMobileTicket}>
                        <Text style={styles.buttonText}>Kertalippu</Text>
                    </Icon.Button>
                </View>
                <View style={styles.wrapper}>
                    <Icon.Button size={15} name="calendar" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={this.maybeOpenMobileTicket}>
                        <Text style={styles.buttonText}>Vuorokausilippu</Text>
                    </Icon.Button>
                </View>
                <View style={styles.wrapper}>
                    <FoundationIcon.Button name="calendar" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={this.maybeOpenMobileTicket}>
                        <Text style={styles.buttonText}>Kausilippu</Text>
                    </FoundationIcon.Button>
                </View>
            </View>
        );
    }
}

export default MobileTicket;
