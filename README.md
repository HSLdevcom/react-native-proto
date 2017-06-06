# react-native-proto

## Dev
* See React Native [getting started#installing-dependencies](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) for prerequisites
* Clone this repo and install deps `yarn`
* Copy `config-example.js` -> `config.js` and add configs
* To run iOS-version `react-native run-ios` or open XCode-project from ios-folder and run build
* To run Android-version see [Android-tab in getting-started-page](http://facebook.github.io/react-native/docs/getting-started.html)
    * It's probably easier (and smoother) to run the app on real device than on virtual device
    * During development you will need do a port forwarding: `adb reverse tcp:8081 tcp:8081`
        * This will allow the app to access the React Packager server which serve the JS. The port `8081` is the default React Packager port.
    * You can list the existing forwards using `adb reverse --list`
    * If you have an error like `Error:The SDK Build Tools revision (23.0.1) is too low for project ':react-native-xxx'. Minimum required is 25.0.0` you can
        * Replace those manually in `react-native-xxx`-package to `25.0.0` or
        * Open project for example in [Android Studio](https://developer.android.com/studio/index.html), run Gradle sync and after that click `Update Build Tools version and sync project`

## Tests
* See for example: https://facebook.github.io/jest/docs/tutorial-react-native.html
* `npm run test`
