export const SET_BEACON_LINE = 'HSLProto/app/SET_BEACON_LINE';
export const REMOVE_BEACON_LINE = 'HSLProto/app/REMOVE_BEACON_LINE';

/**
* Set beaconLine
* @param  {string} beaconLine
* @return {object} An action object with a type of SET_BEACON_LINE
*/
export function setBeaconLine(beaconLine) {
    return {type: SET_BEACON_LINE, beaconLine};
}

/**
* Remove beaconLine
* @return {object} An action object with a type REMOVE_BEACON_LINE SET_BEACON_LINE
*/
export function removeBeaconLine() {
    return {type: REMOVE_BEACON_LINE};
}
