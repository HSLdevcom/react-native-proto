/**
 * MobileTicket component
 * @flow
 */

import React, {Component} from 'react';
import {Linking, Modal, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        padding: 15,
    },
    childContainer: {
        justifyContent: 'center',
    },
    header: {
        color: colors.brandColor,
        fontSize: 30,
        marginBottom: 15,
        marginTop: 30,
    },
    bigCenteredText: {
        fontSize: 22,
        textAlign: 'center',
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
    modalWrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    wrapper: {
        marginTop: 20,
    },
});


class MobileTicket extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        showModal: false,
    }

    closeModal = () => this.setState({showModal: false});
    openStore = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('https://itunes.apple.com/fi/app/hsl-mobiililippu/id1078566902').catch(e => console.log(e));
        } else {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.hsl.mobiililippu').catch(e => console.log(e));
        }
    }
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
        const installAppIcon = Platform.OS === 'ios' ? 'app-store' : 'google-play';
        const modal = this.state.showModal ?
        (
            <Modal
                animationType="slide"
                transparent={false}
                visible
                onRequestClose={this.closeModal}
            >
                <View style={styles.modalWrapper}>
                    <Text style={styles.bigCenteredText}>
                        HSL Mobiililippu ei ole asennettuna puhelimeesi.
                    </Text>
                    <View style={styles.wrapper}>
                        <Icon.Button
                            name={installAppIcon} style={styles.button}
                            backgroundColor={colors.brandColor}
                            borderRadius={10} onPress={this.openStore}
                        >
                            <Text style={styles.buttonText}>
                                Asenna sovellus
                            </Text>
                        </Icon.Button>
                    </View>
                    <View style={styles.wrapper}>
                        <Icon.Button name="cross" style={styles.button} backgroundColor={colors.brandColor} borderRadius={10} onPress={this.closeModal}>
                            <Text style={styles.buttonText}>Sulje</Text>
                        </Icon.Button>
                    </View>
                </View>
            </Modal>
        ) : null;
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.childContainer}>
                {modal}
                <Text style={[styles.text, styles.header, {marginTop: Platform.OS === 'ios' ? 60 : 40}]}>
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
            </ScrollView>
        );
    }
}

export default MobileTicket;
