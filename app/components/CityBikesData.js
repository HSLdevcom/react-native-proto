/**
 * CityBikesData component
 * @flow
 */

import React, {Component} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import apiRequest from '../utils/api';
import {
    removeCityBikeData,
    setCityBikesRentalData,
    setCityBikesUserData,
} from '../actions/cityBike';

class CityBikesData extends Component {
    componentDidMount() {
        const {cityBike} = this.props;
        if (!cityBike.get('user') || !cityBike.get('user').connected) {
            this.getCityBikeData();
        }
    }
    onRefresh = () => {
        this.getCityBikeData();
    }
    getCityBikeData = () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        };
        apiRequest('https://www.hsl.fi/api-account/session', options)
        .then(userSession => this.props.setCityBikesUserData(userSession))
        .then((data) => {
            if (data.user.connected) {
                return apiRequest('https://www.hsl.fi/api-account/rentals', options);
            }
            return false;
        })
        .then((rentalsData) => {
            console.log(rentalsData);
            if (rentalsData.result) {
                this.props.setCityBikesRentalData(rentalsData.result);
            }
        })
        .catch(err => console.log(err));
    }
    render() {
        const {cityBike} = this.props;
        const text = cityBike.get('user') ?
            cityBike.get('user').username || 'Not logged in!' :
            null;
        let cityBikesData = null;
        if (cityBike.get('rentals') && cityBike.get('rentals').length) {
            cityBikesData = cityBike.get('rentals').map(data =>
                (<View key={data.bike}>
                    <Text>Pyörä: {data.bike}</Text>
                    <Text>Lähtöasema: {data.departure_station}</Text>
                    <Text>Palautusasema: {data.return_station}</Text>
                </View>)
            );
        }
        const refreshControl = (
            <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
            />
        );
        return (
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{alignItems: 'center', flex: 1, justifyContent: 'center'}}
                refreshControl={refreshControl}
            >
                <Text style={{fontSize: 20}}>Käyttäjätunnus: {text}</Text>
                <Text style={{fontSize: 16}}>Käytetyt pyörät:</Text>
                {cityBikesData}
            </ScrollView>
        );
    }
}
CityBikesData.propTypes = {
    cityBike: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
    removeCityBikeData: PropTypes.func.isRequired,
    setCityBikesRentalData: PropTypes.func.isRequired,
    setCityBikesUserData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        cityBike: state.cityBike,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCityBikeData: () => dispatch(removeCityBikeData()),
        setCityBikesRentalData: rentals => dispatch(setCityBikesRentalData(rentals)),
        setCityBikesUserData: user => dispatch(setCityBikesUserData(user)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CityBikesData);
