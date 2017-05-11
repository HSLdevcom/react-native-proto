/**
 * Main component
 * @flow
 */

import React from 'react';
// import NFC, {NfcDataType, NdefRecordType} from 'react-native-nfc';
// import {View, StyleSheet, Platform, Text} from 'react-native';
// import {connect} from 'react-redux';
// import Immutable from 'immutable';
import CustomWebView from './CustomWebView';
// import NewsFeed from './NewsFeed';
// import SingleNews from './SingleNews';
// import {
//     hideSingleNews,
// } from '../actions/news';

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 50,
//     },
//     scrollView: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// function test(payload) {
//     const messages = payload.data;
//     messages.forEach((message) => {
//         message.forEach((records) => {
//             if (records.type === NdefRecordType.TEXT) {
//                 // do something with the text data
//                 console.log(`TEXT tag of type ${records.type} with data ${records.data}`);
//             } else {
//                 console.log(`Non-TEXT tag of type ${records.type} with data ${records.data}`);
//             }
//         });
//     });
// }
// if (Platform.OS === 'android') {
//     console.log('NFC');
//     NFC.addListener((payload) => {
//         console.log('payload.type: ', payload.type);
//         switch (payload.type) {
//         case NfcDataType.NDEF:
//             test(payload);
//             break;
//         case NfcDataType.TAG:
//             console.log(`The TAG is non-NDEF:\n\n${payload.data.description}`);
//             break;
//         default:
//             console.log('default');
//             break;
//         }
//     });
// }
function Main(/*props*/) {
    // if (props.news.get('activeSingleNews')) {
    //     const data = props.news.get('data');
    //     const singleNews = data.find(item =>
    // item.get('nid') === props.news.get('activeSingleNews'));
    //     return <SingleNews hide={props.hideSingleNews} singleNews={singleNews} />;
    // }
    // return (
    //     <ScrollView contentContainerStyle={styles.scrollView} style={styles.container}>
    //         <CustomWebView uri="https://reittiopas.fi/" />
    //         {/* <CustomWebView uri="http://192.168.1.124:8080/" /> */}
    //         <NewsFeed />
    //     </ScrollView>
    // );

    // TODO: add options view and define there if user wants to use this with "?mock"?
    return <CustomWebView uri="https://reittiopas.fi/?mock" />;
}
// Main.propTypes = {
//     hideSingleNews: React.PropTypes.func.isRequired,
//     news: React.PropTypes.instanceOf(Immutable.Map).isRequired,
// };

// function mapStateToProps(state) {
//     return {
//         news: state.news,
//     };
// }
// function mapDispatchToProps(dispatch) {
//     return {
//         hideSingleNews: () => dispatch(hideSingleNews()),
//     };
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Main);

export default Main;
