import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { Input } from './components/Input';
import { Button } from './components/Button';

export default class App extends React.Component {
 state = {
  email: '',
  password: '',
  authenticating: false,
  error: '',
 }
  componentWillMount(){
    const firebaseConfig = {
      apiKey: '',
      authDomain: '',
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    }
    firebase.initializeApp(firebaseConfig);
  }

  onPressSignIn() {
    this.setState({
      authenticating: true,
    });
    //firebase logic
    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => this.setState({
        authenticating: false,
        user,
        error: '',
      }))
      .catch(() => {
        // Login was not successful
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => this.setState({
            authenticating: false,
            user,
            error: '',
          }))
          .catch(() => this.setState({
            authenticating: false,
            user: null,
            error: 'Authentication Failure',
          }))
      })
  }
  }

  renderCurrentState() {
    if (this.state.authenticating){
      return  (
          <View>
            <ActivityIndicator size='large' />
          </View>
        )
    }
    return (
     <View style={styles.form}>
        <Input
          placeholder='Email Address'
          label='Email'
          onChangeText={email => this.setState({ email })} 
          value={this.state.email} />
        <Input 
          placeholder='Password'
          label='Password'
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button onPress={() => this.onPressSignIn()}>Log In</Button>
        <Text>{this.state.error}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCurrentState()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  form: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30
  }
});
