/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, AsyncStorage, SegmentedControlIOS, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Alert, SafeAreaView, TouchableHighlight, Image, Platform, StyleSheet, Text, View, ScrollView} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



export default class LogScreen extends Component {

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


    const {log} = this.state;
    //let myData = this._getData()[0];
    
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={{zIndex:2, flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent:'center'}}>
          <Text>Log</Text>
        </View>

        <FlatList
          style = {{alignSelf: "stretch"}}
          data = {log}
          renderItem = {  ({item}) => 
            <LogItem 
              ts={item[0]}
              tags={item[1]}
              q= {item[2]}
            >
            </LogItem>
          }
          keyExtractor = { (item, index) => `listItem-${index}`}
        >
          
        </FlatList>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }
}


class LogItem extends Component {
  render() {
    let {ts, tags, q} = this.props;
    let tagItems = [];
    for (let [idx, tg] of tags.entries()) {
      tagItems.push(<Text style={{flex:1}} key={ts+"_"+idx}> { tg } </Text>);
console.log(tg);
    }
    return (
      <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignSelf: 'stretch', alignItems: 'center'}} >
        <Text style ={{backgroundColor: 'lightgreen', flex:2}}> { ts } </Text>
        <View style ={{backgroundColor: 'lightblue', flex:3}}>
          <View style ={{flex:1, flexDirection:'row'}}>
            {tagItems}
          </View>
        </View>
        <Text style ={{backgroundColor: 'lightpink', flex:1}}> { q } </Text>
        
      </View>
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
