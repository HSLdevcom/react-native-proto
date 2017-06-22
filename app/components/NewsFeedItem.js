/**
 * NewsFeedItem component
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Immutable from 'immutable';
import moment from 'moment';
import colors from '../colors';

const styles = StyleSheet.create({
    text: {
        color: colors.brandColor,
        marginBottom: 15,
    },
});

class NewsFeedItem extends Component { // eslint-disable-line react/prefer-stateless-function
    handleShowSingle = () => {
        const {data, showSingle} = this.props;
        showSingle(data.get('nid'));
    }
    renderItem = ({item}) =>
        (<Text key={item.get('nid')} style={styles.text}>
            {`${moment.unix(item.get('created')).format('DD.MM.YYYY')}\n${item.get('title')}`}
        </Text>)

    render() {
        const {data} = this.props;
        return (
            <TouchableOpacity key={data.get('nid')} onPress={this.handleShowSingle}>
                <Text style={styles.text}>
                    {`${moment.unix(data.get('created')).format('DD.MM.YYYY')}\n${data.get('title')}`}
                </Text>
            </TouchableOpacity>
            // We can use FlatList with react-native 0.43
            // newsList = (
                // <FlatList
                //     data={data}
                //     renderItem={this.renderItem}
                // />
            // );
        );
    }
}

NewsFeedItem.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    showSingle: PropTypes.func.isRequired,
};

export default NewsFeedItem;
