# react-native-proto

## Dev
* See React Native [getting started#installing-dependencies](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) for prerequisites
* Clone this repo and install deps `yarn`
* To run iOS-version `react-native run-ios` or open XCode-project from ios-folder and run build
* To run Android-version see [Android-tab in getting-started-page](http://facebook.github.io/react-native/docs/getting-started.html)
    * It's probably easier (and smoother) to run the app on real device than on virtual device
    * During development you will need do a port forwarding: `adb reverse tcp:8081 tcp:8081`
        * This will allow the app to access the React Packager server which server the JS. The port `8081` is the default React Packager port.
    * You can list the existing forwards using `adb reverse --list`

## Tests
* See for example: https://facebook.github.io/jest/docs/tutorial-react-native.html
* `npm run test`
