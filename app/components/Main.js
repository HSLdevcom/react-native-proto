/**
 * Main component
 * @flow
 */

import React from 'react';
// import {ScrollView, StyleSheet} from 'react-native';
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
    return <CustomWebView uri="https://reittiopas.fi/" />;
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
