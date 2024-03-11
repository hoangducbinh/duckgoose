/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


LogBox.ignoreLogs([
  '[Reanimated] Reduced motion setting is enabled on this device.',
]);



AppRegistry.registerComponent(appName, () => App);
