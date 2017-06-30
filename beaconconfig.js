import {
    Platform,
} from 'react-native';
/*
* OnyxBeacon default
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
* 20cae8a0-a9cf-11e3-a5e2-0800200c9a66
*
* Stops
* DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C
* 'dfff7ada-a48a-4f77-aa9a-3a7943641e6c'
*
* Livi
* 7D7AFDB9-14A3-EECC-A67D-DBD798A33C25
* 7d7afdb9-14a3-eecc-a67d-dbd798a33c25
*
* Incorrect stopId (same as Onyx)
* 20CAE8A0-A9CF-11E3-A5E2-0800200C9A66
* 20cae8a0-a9cf-11e3-a5e2-0800200c9a66
*
* New vehicle UUID
* BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B
* bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b
*/
export const beaconId = (Platform.OS === 'ios') ?
    'DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C' :
    'dfff7ada-a48a-4f77-aa9a-3a7943641e6c';

export const vehicleBeaconId = (Platform.OS === 'ios') ?
    'BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B' :
    'bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b';

export const liviBeaconId = (Platform.OS === 'ios') ?
    '7D7AFDB9-14A3-EECC-A67D-DBD798A33C25' :
    '7d7afdb9-14a3-eecc-a67d-dbd798a33c25';

export const beaconRegion = (Platform.OS === 'ios') ?
{identifier: 'RuuviTag', uuid: 'DFFF7ADA-A48A-4F77-AA9A-3A7943641E6C'} : {identifier: 'RuuviTag', uuid: 'dfff7ada-a48a-4f77-aa9a-3a7943641e6c'};

export const vehicleBeaconRegion = (Platform.OS === 'ios') ?
{identifier: 'OnyxBeacon', uuid: 'BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B'} : {identifier: 'OnyxBeacon', uuid: 'bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b'};

export const liviBeaconRegion = (Platform.OS === 'ios') ?
{identifier: 'Livi', uuid: '7D7AFDB9-14A3-EECC-A67D-DBD798A33C25'} : {identifier: 'Livi', uuid: '7d7afdb9-14a3-eecc-a67d-dbd798a33c25'};
