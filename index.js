/**
 * Sample HSL React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';
import {connect, Provider} from 'react-redux';
import {Router, Scene} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';
import store from './app/store';
import colors from './app/colors';
import Main from './app/components/Main';
import News from './app/components/NewsFeed';
import MobileTicket from './app/components/MobileTicket';
import Test from './app/components/InlineWebView';

console.log('Starting');
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__DEV__: ${__DEV__}`);

const path = Platform.OS === 'ios' ? `${RNFS.MainBundlePath}/web` : `${RNFS.DocumentDirectoryPath}`;
console.log('path: ', path);
console.log(RNFS);
const server = new StaticServer(8080, path, {localOnly: true});

if (Platform.OS === 'android') {
    // RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/web`)
    // .then(() => RNFS.copyFileAssets('web/', `${RNFS.DocumentDirectoryPath}/web`))
    // .then(() => RNFS.readDir(`${RNFS.DocumentDirectoryPath}/web`))
    // .then((item) => {
    //     console.log('item: ', item);
    // })
    // .catch(err => console.log(err));

    // RNFS.readDirAssets('web')
    // .then((items) => {
    //     items.forEach((item) => {
    //         console.log(item);
    //         if (item.isDirectory()) {
    //             RNFS.readDirAssets(item.path)
    //             .then((subitems) => {
    //                 subitems.forEach((subitem) => {
    //                     console.log(subitem);
    //                 });
    //             })
    //             .catch(err => console.log(err));
    //         }
    //     });
    // })
    // .catch(err => console.log(err));
}
// Start the server
server.start().then((url) => {
    console.log('Serving at URL', url);
});

const RouterWithRedux = connect()(Router);

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: colors.brandColor,
        opacity: 1,
    },
    iconText: {
        fontSize: 12,
    },
    tabView: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 60,
    },
});

const TabIcon = props =>
    <View style={styles.tabView}>
        <Icon name={props.iconName} size={15} color={props.selected ? 'white' : 'black'} />
        <Text style={[styles.iconText, {color: props.selected ? 'white' : 'black'}]}>
            {props.title}
        </Text>
    </View>;

TabIcon.propTypes = {
    iconName: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
};

TabIcon.defaultProps = {
    selected: false,
};

function HSLProto() {
    return (
        <Provider store={store}>
            <RouterWithRedux>
                <Scene key="root">
                    <Scene
                        key="tabbar"
                        tabs
                        tabBarStyle={styles.tabBarStyle}
                        hideNavBar
                    >
                        <Scene iconName="address" key="homeTab" title="REITTIOPAS" icon={TabIcon}>
                            <Scene key="home" component={Main} title="Reittiopas" />
                        </Scene>
                        <Scene iconName="news" key="newsTab" title="UUTISET" icon={TabIcon}>
                            <Scene key="news" component={News} title="Uutiset" />
                        </Scene>
                        <Scene iconName="ticket" key="mobileTicketTab" title="OSTA LIPPUJA" icon={TabIcon}>
                            <Scene key="mobileTicket" component={MobileTicket} title="Osta lippuja" />
                        </Scene>
                        <Scene iconName="browser" key="testing" title="TEST" icon={TabIcon}>
                            <Scene key="test" component={Test} title="Test" />
                        </Scene>
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    );
}

AppRegistry.registerComponent('HSLProto', () => HSLProto);
