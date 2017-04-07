import React, {Component} from 'react';
import {ActivityIndicator, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import {fetchNewsData} from '../actions/news';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    childContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class NewsFeed extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        const {news} = this.props;
        const data = news.get('data');
        if (!data) {
            this.props.fetchNewsData();
        }
    }

    renderItem = ({item}) =>
        <Text key={item.nid} style={styles.text}>{`${moment.unix(item.created).format('DD.MM.YYYY')}\n${item.title}`}</Text>

    render() {
        const {news} = this.props;
        const data = news.get('data');
        if (news.get('fetching')) {
            return <ActivityIndicator size="large" />;
        }
        let newsList = null;
        if (data) {
            newsList = data.map(item =>
                <TouchableOpacity key={item.nid}>
                    <Text style={styles.text}>
                        {`${moment.unix(item.created).format('DD.MM.YYYY')}\n${item.title}`}
                    </Text>
                </TouchableOpacity>
            );
            // We can use FlatList with react-native 0.43
            // newsList = (
            //     <FlatList
            //         data={data}
            //         renderItem={this.renderItem}
            //     />
            // );
        }
        return (
            <View style={styles.container} contentContainerStyle={styles.childContainer} >
                {newsList}
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
