/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from 'react-native';

import hooks from 'feathers-hooks';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication/client';
import localstorage from 'feathers-localstorage';

// A hack so that you can still debug. Required because react native debugger runs in a web worker, which doesn't have a window.navigator attribute.
if (window.navigator && Object.keys(window.navigator).length == 0) {
    window = Object.assign(window, {navigator: {userAgent: 'ReactNative'}});
}
var io = require('socket.io-client/socket.io');

class test_websocket extends Component {
      constructor(props) {
        super(props);
        const options = {transports: ['websocket'], forceNew: true};
        this.socket = io('http://localhost:3030', options);

        this.state = {connected: false, authenticated: false};
        this.app = feathers()
            .configure(socketio(this.socket))
            .configure(hooks())
            .use('storage', localstorage({storage: AsyncStorage}))
            .configure(authentication());

        console.log('constructor');

    }

    componentDidMount() {

      this.app.io.on('connect', () => {
          this.setState({ connected: true });
          Alert.alert('Log','connect');

          if(!this.state.authenticated)
          {
            this.app.authenticate({
                  type: 'local',
                  email: 'oyvindhabberstad@gmail.com',
                  password: '1234'
                }).then(response => {
                  this.setState({ authenticated: true });
                Alert.alert('Log','has logged in');
                }).catch(error => {
                  console.log('ERROR', error);
                  Alert.alert('Error', 'Please enter a valid email or password.');
                  this.setState({ loading: false });
                  return;
                });
          }      
        });

          this.app.io.on('disconnect', () => {
            this.setState({ connected: false });            
            console.log('disconnect');
          });
          */

        console.log('componentDidMount');

               // Get the message service that uses a websocket connection
        const messageService = this.app.service('messages');
        messageService.on('created', message => console.log('Someone created a message', message));

    }
    
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js, Jaggu
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('test_websocket', () => test_websocket);
