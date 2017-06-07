/**
 * Session component
 * @flow
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';

class Session extends Component {
    state = {
        session: false,
    }
    componentDidMount() {
        const options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        };
        // eslint-disable-next-line
        fetch('https://www.hsl.fi/api-account/session', options)
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }
            return response.json();
        })
        .then((session) => {
            console.log(session);
            this.setState({session});
        })
        .catch(err => console.log(err));
    }
    render() {
        const {session} = this.state;
        const text = session ?
            session.username || 'Not logged in!' :
            null;
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>{text}</Text>
            </View>
        );
    }
}

export default Session;
