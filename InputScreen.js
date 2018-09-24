/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, SegmentedControlIOS, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Alert, SafeAreaView, TouchableHighlight, Image, Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Swiper from 'react-native-swiper'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



export default class InputScreen extends Component {

  constructor(props) {
    super(props)
    let x = '';

    this.state = { 
      query: '',
      editing: true,
      tags: [],
      selectedIndex: 0,
      data: []
/*
      data: [
        {tag:'abc', count:'1', ago:'3h'}, 
        {tag:'abcdef', count:'2', ago:'3d'}, 
        {tag:'abcdfe', count:'3', ago:'8h'}, 
        {tag:'ab', count:'55', ago:'2h'}, 
        {tag:'bc', count:'1111', ago:'8d'}, 
        {tag:'bcd', count:'11', ago:'11d'}, 
        {tag:'defa', count:'41', ago:'5h'},
      ]
*/
    };

  }

  _getData = () => {
      if (!this.state.editing) return [];

      const regex = new RegExp(`^${this.state.query.trim()}`, 'i');
      var list = this.state.data.filter( x=> x.tag.search(regex) >=0);
      list.sort( (a, b) => {return b['count'] - a['count']});
      return list;
  }

  _selectTag = (text) => {
      this.refs.textInput.textInput.clear();

      // take the text out, and add token
      this.setState({
        tags: [...this.state.tags, text]
      })
  }

  _textChange = (text) => {
    const lastTyped = text.charAt(text.length-1);
    const parseWhen = [',', ' ', ';', '\n'];

    this.setState( {query: text} );

    if (parseWhen.indexOf(lastTyped) > -1) {

      this._selectTag(text.slice(0,-1));

    }
  }

  _deleteTag = (tagIndex) => {
    newArray = [...this.state.tags];
    newArray.splice(tagIndex, 1);
    this.setState({
      tags: newArray
    })
  }

  _storeData = async (k, v) => {
    try {
      await AsyncStorage.setItem(k, v);
    } catch (error) {
        console.log(error);
      // Error saving data
    }
  }

  _retrieveData = async (k) => {
    try {
      const value = await AsyncStorage.getItem(k);
      if (value !== null) {
        // We have data!!
        console.log("retrieved data: " + value);
      }
      return value;
    } catch (error) {
        console.log('did not get value');
      // Error retrieving data
    }
  }


  _submit = async () => {
    /*
      'tagData' = JSON.generate( {'tag1': {count: 1, time_last_used: 23242425}, 'tag2': {...}} )
      'log' = JSON.generate( [ts, [tags], q] )
    */

    let x = await (this._retrieveData('tagData')) || '{}';
    tagData = JSON.parse(x);
    data = [];

    for (tag of this.state.tags) {
      if (!(tag in tagData)) {
        tagData[tag] = {count: 0, time_last_used: 0};
      }
      tagData[tag]['count'] += 1;
      tagData[tag]['time_last_used'] = Date.now();
      
    }

    for (tagDataKey in tagData) {
      data.push({tag: tagDataKey, count: tagData[tagDataKey]['count'], ago: '3h'});
    }

    await this._storeData('tagData', JSON.stringify(tagData));
    this.setState( {data: data, query: ''} );

    this.refs.textInput.textInput.clear();

    this._recordLogRow( [Date.now(), this.state.tags, 'q'+(parseInt(this.state.selectedIndex)+1)] );
  }

  _recordLogRow = async (logRow) => {
    let log = await (this._retrieveData('log')) || '[]';
    log = JSON.parse(log)
    log.push(logRow);
    await this._storeData('log', JSON.stringify(log));
  }

  componentDidMount() {
    //this._retrieveData('tagData').then( (data) => {x = data|| '{}'} );
    this._retrieveData('tagData').then( (x) => {
      tagData = JSON.parse(x || '{}');
      data = [];
      for (tagDataKey in tagData) {
        data.push({tag: tagDataKey, count: tagData[tagDataKey]['count'], ago: '3h'});
      }
      this.setState( {data: data} );
    });
  }

  render() {

    let x = []
    let y = 0;
    for (tag of this.state.tags) {
      let hi = y; 
      x.push(
        <TouchableHighlight onPress={ () => { this._deleteTag(hi)}} key={"tag"+hi}>
          <Text >X {tag} </Text>
        </TouchableHighlight>
      );
      y = y+1;
    }
    if (x.length == 0)  {
      x= <Text>hi</Text>
    } 

    const {query} = this.state;
    //let myData = this._getData()[0];
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={{zIndex:2, flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent:'center'}}>
            <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "yellow", flexDirection: 'column', justifyContent:'center'}}>
              <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "yellow", flexDirection: 'row', justifyContent:'center'}}>
                { x }
              </View>

                <Autocomplete
                  ref="textInput"
                  data = {this._getData()}
                  autoCapitalize = 'none'
                  autoFocus = {true}
                  autoCorrect = {false}
                  onBlur = { () => { this.setState({editing: false}) } }
                  onFocus = { () => { this.setState({editing: true}) } }
                  onChangeText = {text => this._textChange(text)}
                  renderItem = { item=> (
                    <TouchableHighlight onPress={ ()=> this._selectTag( item.tag ) }>
                      <View style={{flex:1, alignSelf: 'stretch', flexDirection:'row'}}>
                        <Text style={{width:40}}> {item.tag} </Text>
                        <Text style={{width:40}}> {item.count} </Text>
                      </View>
                    </TouchableHighlight>
                  )}
                >
                </Autocomplete>
            </View>
        </View>

        <View style={{flex: 6, alignSelf: 'stretch', backgroundColor: "yellow", flexDirection: 'column', justifyContent:'center'}}>

          <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "yellow", flexDirection: 'column', justifyContent:'center'}}>
            <SegmentedControlIOS
              values = { ['Q1', 'Q2', 'Q3', 'Q4'] }
              selectedIndex = {this.state.selectedIndex}
              onChange = { (event) => {
                  this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
                }
              } 
            >
            </SegmentedControlIOS>
          </View>
          <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "yellow", flexDirection: 'column', justifyContent:'center'}}>
            <TouchableOpacity style={styles.submitButton}
                              onPress= {() => this._submit() }>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.welcome}>Welcome to React Native!</Text>
        </View>


        <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "gray", flexDirection: 'column', justifyContent:'center'}}>
          <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: "gray", flexDirection: 'row', justifyContent:'center'}}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'powderblue'}} >
              <Text style={{}}>Entry</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'skyblue'}} >
              <Text style={{}}>Stats</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: 'steelblue'}} >
              <Text style={{}}>Log</Text>
            </View>

          </View>
        </View>

      </SafeAreaView>
          </TouchableWithoutFeedback>
    )
  }
}

class BananaButton extends Component {
  _bigger() {
    console.log(this.state);
    this.setState( previousState => { return {height: previousState.height + 50}} );
  }

  _smaller() {
    console.log(this.state);
    this.setState( previousState => { return {height: previousState.height - 50}} );
  }

  constructor(props) {
    super(props)
    this.state = { height: 111 };
  }

  render() {
    return (
      <TouchableHighlight 
        title="whatwhat" 
        onLongPress={ this._bigger.bind(this) }
        onPress= { this._smaller.bind(this) }
      >
        
        <Bananas height={this.state.height}></Bananas>
      </TouchableHighlight>
    )
  }
}

class Bananas extends Component {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <Image source={pic} style={{width: 193, height: this.props.height}}/>
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
  submitButton: {
      borderWidth: 1,
      padding: 25,
      borderColor: 'black',
      backgroundColor: 'green',
      width: '40%'
  },
});
