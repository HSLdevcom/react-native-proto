export const REMOVE_CITY_BIKE_DATA = 'HSLProto/app/REMOVE_CITY_BIKE_DATA';
export const SET_CITY_BIKE_USER_DATA = 'HSLProto/app/SET_CITY_BIKE_USER_DATA';
export const SET_CITY_BIKE_RENTALS_DATA = 'HSLProto/app/SET_CITY_BIKE_RENTALS_DATA';

/**
* Set city bikes rental data
* @param  {object} rentals
* @return {object} An action object with a type of SET_CITY_BIKE_RENTALS_DATA
*/
export function setCityBikesRentalData(rentals) {
    return {type: SET_CITY_BIKE_RENTALS_DATA, rentals};
}

/**
* Set user city bike data
* @param  {object} user
* @return {object} An action object with a type of SET_CITY_BIKE_RENTALS_DATA
*/
export function setCityBikesUserData(user) {
    return {type: SET_CITY_BIKE_USER_DATA, user};
}

/**
* Remove city bike data
* @return {object} An action object with a type REMOVE_CITY_BIKE_DATA
*/
export function removeCityBikeData() {
    return {type: REMOVE_CITY_BIKE_DATA};
}
