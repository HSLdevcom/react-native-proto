
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

    export const beaconId = {
        ios: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66',
        android: '20cae8a0-a9cf-11e3-a5e2-0800200c9a66',
    };

    export const vehicleBeaconId = {
        ios: 'BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B',
        android: 'bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b',
    };

    export const liviBeaconId = {
        ios: '7D7AFDB9-14A3-EECC-A67D-DBD798A33C25',
        android: '7d7afdb9-14a3-eecc-a67d-dbd798a33c25',
    };

    export const beaconRegion = {
        ios: {
            identifier: 'RuuviTag',
            uuid: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66',
        },
        android: '20cae8a0-a9cf-11e3-a5e2-0800200c9a66',
    };

    export const vehicleBeaconRegion = {
        ios: {
            identifier: 'OnyxBeacon',
            uuid: 'BB198F26-4A2F-4B7F-BD7C-9FC09D6D5B2B',
        },
        android: 'bb198f26-4a2f-4b7f-bd7c-9fc09d6d5b2b',
    };

    export const liviBeaconRegion = {
        ios: {
            identifier: 'Livi',
            uuid: '7D7AFDB9-14A3-EECC-A67D-DBD798A33C25',
        },
        android: '7d7afdb9-14a3-eecc-a67d-dbd798a33c25',
    };
