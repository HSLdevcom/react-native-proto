import React, {Component} from 'react';
import {ActivityIndicator, Animated, Platform, RefreshControl, StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {
    fetchNewsData,
    hideSingleNews,
    showSingleNews,
} from '../actions/news';
import NewsFeedItem from './NewsFeedItem';
import SingleNews from './SingleNews';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50,
        marginTop: (Platform.OS === 'ios') ? 15 : 0,
    },
    childContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 40,
        padding: 15,
    },
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class NewsFeed extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        fadeAnim: new Animated.Value(0),
        refreshing: false,
    };
    componentDidMount() {
        const {news} = this.props;
        const data = news.get('data');
        if (!data) {
            this.props.fetchNewsData();
        } else {
            // Add some "dummy" animation for testing
            // Animated.timing(this.state.fadeAnim, {toValue: 1, duration: 500}).start();
        }
    }

    componentDidUpdate() {
        // Add some "dummy" animation for testing
        // Animated.timing(this.state.fadeAnim, {toValue: 1, duration: 500}).start();
    }

    onRefresh = () => {
        this.props.fetchNewsData();
    }

    showSingle = (id) => {
        this.props.showSingleNews(id);
    }

    render() {
        const {news} = this.props;
        let singleNewsComponent = null;
        const data = news.get('data');
        if (news.get('fetching') && !news.get('error')) {
            return <View style={styles.container}><ActivityIndicator style={{marginTop: 30}} size="large" /></View>;
        } else if (news.get('error')) {
            return (
                <View style={styles.container}>
                    <Text style={{color: 'red', fontSize: 40, marginTop: 30}} size="large">
                        {news.get('error')}
                    </Text>
                </View>
            );
        }
        if (news.get('activeSingleNews')) {
            const singleNews = data.find(item => item.get('nid') === news.get('activeSingleNews'));
            singleNewsComponent = (
                <SingleNews hide={this.props.hideSingleNews} singleNews={singleNews} />
            );
        }
        let newsList = null;
        if (data && data.count() > 0) {
            // TODO: don't use reverse, get the data in desc order (when it's possible)
            newsList = data.valueSeq().reverse().map(item =>
                <NewsFeedItem key={item.get('nid')} data={item} showSingle={this.showSingle} />
            );
        }
        const refreshControl = (
            <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
            />
        );
        return (
            <Animated.ScrollView
                style={[styles.container]}
                contentContainerStyle={styles.childContainer}
                refreshControl={refreshControl}
            >
                {singleNewsComponent}
                {newsList}
            </Animated.ScrollView>
        );
    }
}

NewsFeed.propTypes = {
    fetchNewsData: PropTypes.func.isRequired,
    hideSingleNews: PropTypes.func.isRequired,
    news: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    showSingleNews: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        news: state.news,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNewsData: () => dispatch(fetchNewsData()),
        hideSingleNews: () => dispatch(hideSingleNews()),
        showSingleNews: nid => dispatch(showSingleNews(nid)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewsFeed);
