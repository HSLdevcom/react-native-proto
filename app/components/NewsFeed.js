import React, {Component} from 'react';
import {ActivityIndicator, Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import {fetchNewsData} from '../actions/news';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 15,
    },
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class NewsFeed extends Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        this.props.fetchNewsData();
    }
    render() {
        const {news} = this.props;
        const data = news.get('data');
        if (news.get('fetching')) {
            return <ActivityIndicator size="large" />;
        }
        let newsItems = null;
        if (data) {
            newsItems = data.map(item =>
                <Text key={item.title} style={styles.text}>
                    {`${moment.unix(item.created).format('DD.MM.YYYY')}\n${item.title}`}
                </Text>);
        }
        return (
            <View style={styles.container}>
                {newsItems}
            </View>
        );
    }
}

NewsFeed.propTypes = {
    fetchNewsData: React.PropTypes.func.isRequired,
    news: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
    return {
        news: state.news,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNewsData: () => dispatch(fetchNewsData()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewsFeed);
