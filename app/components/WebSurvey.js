/**
 * WebSurveys component
 * @flow
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {getBeaconData} from '../actions/beacons';
import CustomWebView from './CustomWebView';

/**
* A placeholder function for resolving line name based on beacon "major" identifier.
* Should be replaced with DB query in the future.
*/
const resolveLine = (major) => {
    switch (major) {
    case 234:
        return '102T';
    case 235:
        return '103';
    case 1:
        return '9';
    default:
        return '';
    }
};

// export const SURVEY_URL = 'https://jola.louhin.com/surveys/fill?id=404207&accessKey=3441f854-5502-456b-ade7-d457eba2c851&answers[%27linja%27]=8';

class WebSurvey extends Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        vehicleBeacon: false,
    }

    componentWillMount() {
        this.props.getBeaconData();
    }
    componentDidUpdate(prevProps) {
        const {beacons} = this.props;
        const vehicleBeacon = (this.props.beacons.get('vehicleBeaconData').vehicles.length > 0) ?
        beacons.get('vehicleBeaconData').vehicles[0] : null;
        const previousVehicleBeacon = (prevProps.beacons.get('vehicleBeaconData').vehicles.length > 0) ?
        prevProps.beacons.get('vehicleBeaconData').vehicles[0] : null;
        if (vehicleBeacon && vehicleBeacon !== previousVehicleBeacon) {
            this.setVehicleBeacon(vehicleBeacon);
        }
    }
    setVehicleBeacon = (vehicleBeacon) => {
        this.setState({vehicleBeacon});
    }

    render() {
        const {vehicleBeacon} = this.state;
        const SURVEY_URL = `https://jola.louhin.com/surveys/fill?id=404207&accessKey=3441f854-5502-456b-ade7-d457eba2c851&answers[%27linja%27]=${vehicleBeacon ? resolveLine(vehicleBeacon.major) : ''}`;
        return (
            <CustomWebView uri={SURVEY_URL} />
        );
    }

}


WebSurvey.propTypes = {
    getBeaconData: React.PropTypes.func.isRequired,
    beacons: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Object),
        React.PropTypes.instanceOf(Immutable.Map)],
    ).isRequired,
};

function mapStateToProps(state) {
    return {
        beacons: state.beacons,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getBeaconData: () => dispatch(getBeaconData()),
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WebSurvey);
