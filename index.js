/** @format */

import {AppRegistry} from 'react-native';
//import App from './App';
import App from './views/initializer.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
