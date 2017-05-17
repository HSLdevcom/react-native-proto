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

let path = '';

if (Platform.OS === 'android') {
    const androidPath = 'reittiopas';
    // TODO: This is really clumsy but maybe there isn't other option?
    /* TODO: .js/.css/.svg etc files aren't in the repo yet
    * (we have to figure out clever way to build them from digitransit-ui)
    */
    RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/${androidPath}`)
    .then(() => RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js`))
    .then(() => RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/${androidPath}/css`))
    .then(() => RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}/${androidPath}/icons-hsl-18da13427c6e362f148f4a5b783ee98c`))
    .then(() => RNFS.copyFileAssets('web/index.html', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/index.html`))
    .then(() => RNFS.copyFileAssets('web/icons-hsl-18da13427c6e362f148f4a5b783ee98c/favicon.ico', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/icons-hsl-18da13427c6e362f148f4a5b783ee98c/favicon.ico`))
    .then(() => RNFS.copyFileAssets('web/e08d9d29b0bb6fc425b5b718a04d1671.svg', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/e08d9d29b0bb6fc425b5b718a04d1671.svg`))
    .then(() => RNFS.copyFileAssets('web/js/manifest.d41d8cd98f00b204e980.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/manifest.d41d8cd98f00b204e980.js`))
    .then(() => RNFS.copyFileAssets('web/js/leaflet.4568104c2fb108f88c7a.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/leaflet.4568104c2fb108f88c7a.js`))
    .then(() => RNFS.copyFileAssets('web/js/common.8d3aaa04741c0d37ee4e.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/common.8d3aaa04741c0d37ee4e.js`))
    .then(() => RNFS.copyFileAssets('web/js/main.ff3121f8f274a7c531d3.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/main.ff3121f8f274a7c531d3.js`))
    .then(() => RNFS.copyFileAssets('web/js/0e65cb15286ac8777efb.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/0e65cb15286ac8777efb.js`))
    .then(() => RNFS.copyFileAssets('web/js/4a18c4344e7506f0da96.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/4a18c4344e7506f0da96.js`))
    .then(() => RNFS.copyFileAssets('web/js/7af3bcd6063eec0ad9cd.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/7af3bcd6063eec0ad9cd.js`))
    .then(() => RNFS.copyFileAssets('web/js/7e2468d10c63f17d2e0e.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/7e2468d10c63f17d2e0e.js`))
    .then(() => RNFS.copyFileAssets('web/js/8cf34c35a4d206d3a3f0.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/8cf34c35a4d206d3a3f0.js`))
    .then(() => RNFS.copyFileAssets('web/js/8f512816de00a2016888.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/8f512816de00a2016888.js`))
    .then(() => RNFS.copyFileAssets('web/js/8fdc5cf74633156fd5ee.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/8fdc5cf74633156fd5ee.js`))
    .then(() => RNFS.copyFileAssets('web/js/49b218d7a3ac987372f6.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/49b218d7a3ac987372f6.js`))
    .then(() => RNFS.copyFileAssets('web/js/60deb969493096642b08.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/60deb969493096642b08.js`))
    .then(() => RNFS.copyFileAssets('web/js/69bb4db80269c64456cd.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/69bb4db80269c64456cd.js`))
    .then(() => RNFS.copyFileAssets('web/js/90afe2875069cb66711b.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/90afe2875069cb66711b.js`))
    .then(() => RNFS.copyFileAssets('web/js/94b995b2d6ebcb5b5eaa.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/94b995b2d6ebcb5b5eaa.js`))
    .then(() => RNFS.copyFileAssets('web/js/139d7645b6f17b262cb2.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/139d7645b6f17b262cb2.js`))
    .then(() => RNFS.copyFileAssets('web/js/a894c802421549789e8d.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/a894c802421549789e8d.js`))
    .then(() => RNFS.copyFileAssets('web/js/c2dbc39fc352f4aaad51.js', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/js/c2dbc39fc352f4aaad51.js`))
    .then(() => RNFS.copyFileAssets('web/css/main.e1e15aad8f31250a8bc2d259e3b9e503.css', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/css/main.e1e15aad8f31250a8bc2d259e3b9e503.css`))
    .then(() => RNFS.copyFileAssets('web/css/hsl_theme.06d884a52678ec0df02de74924f1f91c.css', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/css/hsl_theme.06d884a52678ec0df02de74924f1f91c.css`))
    .then(() => RNFS.copyFileAssets('web/34a395025ee74f0e4948396eadbe6a28.png', `${RNFS.ExternalStorageDirectoryPath}/${androidPath}/34a395025ee74f0e4948396eadbe6a28.png`))
    .then(() => {
        path = `${RNFS.ExternalStorageDirectoryPath}/${androidPath}`;
        console.log('path: ', path);
        const server = new StaticServer(8080, path, {localOnly: true});
        // Start the server
        server.start().then((url) => {
            console.log('Serving at URL', url);
        });
    })
    .catch(err => console.log(err));
} else {
    path = `${RNFS.MainBundlePath}/web`;
    console.log('path: ', path);
    const server = new StaticServer(8080, path, {localOnly: true});
    // Start the server
    server.start().then((url) => {
        console.log('Serving at URL', url);
    });
}

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
