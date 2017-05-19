/**
 * Main component
 * @flow
 */

import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
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

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    error: {
        fontSize: 40,
        color: 'red',
    },
    spinner: {
        height: 80,
        position: 'absolute',
        zIndex: 2,
    },
});

const pathToReittiopasBundleZip = `${RNFS.DocumentDirectoryPath}/reittiopas.zip`;

class Main extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        const {reittiopas} = this.props;
        // TODO: logic to check out if there's new version of reittiopas available
        if (!reittiopas.get('timestamp') && !reittiopas.get('fetching') && !reittiopas.get('error')) {
            this.download();
        }
    }

    handleUnZip = () => {
        RNFS.exists(pathToReittiopasBundleZip)
        .then((result) => {
            console.log('File copied? ', result);
            if (result) {
                return unzip(pathToReittiopasBundleZip, `${RNFS.DocumentDirectoryPath}/reittiopas`);
            }
            return false;
        })
        .then((result) => {
            if (result) {
                this.props.fetchReittiopasDone(new Date().getTime());
            } else {
                this.props.fetchReittiopasError(new Error('Reittiopas failed to load miserably...'));
            }
        })
        .catch(err => this.props.fetchReittiopasError(new Error(err)));
    };

    handleProgress = (progress) => {
        const {bytesWritten, contentLength} = progress;
        if (bytesWritten === contentLength) {
            // Unzip the file after it's downloaded
            this.handleUnZip();
        }
    };

    handleBeginDownload = (options) => {
        /* Add 15 sec timeout and just try to unzip if download isn't completed
        * There seems to be an issue with handleProgress (at least with Android),
        * last callback isn't firing every time so the file could be downloaded successfully
        * even if bytesWritten < contentLength
        */
        setTimeout(() => {
            if (this.props.reittiopas.get('fetching') && !this.props.reittiopas.get('error')) {
                RNFS.stopDownload(options.jobId);
                // No luck with download but let's just try out unzip
                this.handleUnZip();
            }
        }, 15000);
    };

    /* Handle reittiopas.zip download
    * Check if older zip or reittiopas-folder exists and delete those if needed
    * Start the file download process and handle unzip inside handleProgress()
    */
    download = () => {
        RNFS.exists(pathToReittiopasBundleZip)
        .then((result) => {
            if (result) {
                return RNFS.unlink(pathToReittiopasBundleZip);
            }
            return true;
        })
        .then(() => RNFS.exists(`${RNFS.DocumentDirectoryPath}/reittiopas/index.html`))
        .then((result) => {
            if (result) {
                return RNFS.unlink(`${RNFS.DocumentDirectoryPath}/reittiopas`);
            }
            return true;
        })
        .then(() => {
            console.log('download start!');
            this.props.fetchReittiopas();
            RNFS.downloadFile({
                fromUrl: 'http://192.168.1.118:12000/hsl/reittiopas.zip', // TODO: add "real" URL
                toFile: pathToReittiopasBundleZip,
                begin: this.handleBeginDownload,
                progress: this.handleProgress,
                progressDivider: 10,
            });
        })
        .catch(err => this.props.fetchReittiopasError(new Error(err)));
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
        if (reittiopas.get('timestamp') && !reittiopas.get('error')) {
            console.log('timestamp: ', reittiopas.get('timestamp'));
            return <InlineWebView />;
        } else if (reittiopas.get('fetching')) {
            return (
                <View style={[styles.container]}>
                    <ActivityIndicator
                        animating
                        size="large"
                        style={[styles.centering, styles.spinner]}
                    />
                </View>
            );
        } else if (reittiopas.get('error')) {
            return (
                <View style={[styles.container]}>
                    <Text style={styles.error}>{reittiopas.get('error').message}</Text>
                </View>
            );
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
        fetchReittiopasError: error => dispatch(fetchReittiopasError(error)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);

// export default Main;
