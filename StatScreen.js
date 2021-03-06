/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, SegmentedControlIOS, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Alert, SafeAreaView, TouchableHighlight, Image, Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import {VictoryPie} from 'victory-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



export default class StatScreen extends Component {

  constructor(props) {
    super(props)
    let x = '';

    this.state = { 
      log: []
    };

  }


  _retrieveData = async (k) => {
    try {
      const value = await AsyncStorage.getItem(k);
      if (value !== null) {
        // We have data!!
        console.log("logscreen retrieved data: " + value);
      }
      return value;
    } catch (error) {
        console.log('did not get value');
      // Error retrieving data
    }
  }

  _getLog = async () => {
    let log = await (this._retrieveData('log')) || '[]';
    log = JSON.parse(log);
    console.log(log);
    return log;
  }


  componentDidMount() {
    this._getLog('tagData').then( (data) => { this.setState( {log: data} ) } );
  }

  render() {


    //let myData = this._getData()[0];
    let data = [
      {x: "working", y: 153},
      {x: "browsing", y: 535},
      {x: "playing", y:44}
    ];
    
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={{zIndex:2, flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent:'center'}}>
          <Text>Stats</Text>
        </View>

      
      <VictoryPie
        data = {data}
        
      >
  
      </VictoryPie>

      </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    alignSelf: 'stretch'
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
  submitButton: {
      borderWidth: 1,
      padding: 25,
      borderColor: 'black',
      backgroundColor: 'green',
      width: '40%'
  },
});
