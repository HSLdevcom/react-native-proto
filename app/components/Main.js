/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
// import CustomWebView from './CustomWebView';
import InlineWebView from './InlineWebView';
import {
    fetchingReittiopas,
    fetchReittiopasDone,
    fetchReittiopasError,
} from '../actions/reittiopasDownload';
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

class Main extends Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const {reittiopas} = this.props;
        if (!reittiopas.get('timestamp') && !reittiopas.get('fetching') && !reittiopas.get('error')) {
            this.download();
        }
    }

    handleUnZip = () => {
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/reittiopas.zip`)
        .then((result) => {
            console.log('File copied? ', result);
            if (result) {
                return unzip(`${RNFS.DocumentDirectoryPath}/reittiopas.zip`, `${RNFS.DocumentDirectoryPath}/reittiopas`);
            }
            return false;
        })
        .then((result) => {
            console.log('unzip: ', result);
            this.props.fetchReittiopasDone(new Date().getTime());
        })
        .catch(err => console.log(err));
    };

    handleProgress = (progress) => {
        const {bytesWritten, contentLength} = progress;
        if (bytesWritten >= contentLength) {
            this.handleUnZip();
        }
    };

    download = () => {
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/reittiopas.zip`)
        .then((result) => {
            if (result) {
                return RNFS.unlink(`${RNFS.DocumentDirectoryPath}/reittiopas.zip`);
            }
            return true;
        })
        .then(() => {
            console.log('download start!');
            this.props.fetchReittiopas();
            RNFS.downloadFile({
                fromUrl: 'http://192.168.43.223:12000/hsl/reittiopas.zip',
                toFile: `${RNFS.DocumentDirectoryPath}/reittiopas.zip`,
                progress: this.handleProgress,
                progressDivider: 10,
            });
        })
        .catch(err => console.log(err));
    }

    render() {
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
        const {reittiopas} = this.props;
        if (reittiopas.get('timestamp')) {
            console.log('timestamp: ', reittiopas.get('timestamp'));
            return <InlineWebView />;
        } else if (reittiopas.get('fetching')) {
            return <Text style={{fontSize: 40, marginTop: 150}}>Loading...</Text>;
        }
        return <View />;
    }
}

Main.propTypes = {
    // hideSingleNews: React.PropTypes.func.isRequired,
    // news: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    fetchReittiopas: React.PropTypes.func.isRequired,
    fetchReittiopasDone: React.PropTypes.func.isRequired,
    fetchReittiopasError: React.PropTypes.func.isRequired,
    reittiopas: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
    return {
        // news: state.news,
        reittiopas: state.reittiopas,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        // hideSingleNews: () => dispatch(hideSingleNews()),
        fetchReittiopas: () => dispatch(fetchingReittiopas()),
        fetchReittiopasDone: (timestamp = new Date().getTime()) =>
            dispatch(fetchReittiopasDone(timestamp)),
        fetchReittiopasError: () => dispatch(fetchReittiopasError()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);

// export default Main;
