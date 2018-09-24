import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Swiper from 'react-native-swiper'
import InputScreen from './InputScreen'
import LogScreen from './LogScreen'
//import randomcolor from 'randomcolor'


var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

class TitleText extends React.Component {
  render() {
    return (
      <Text style={{ fontSize: 48, color: 'white' }}>
        {this.props.label}
      </Text>
    )
  }
}

class Home extends React.Component {

  viewStyle() {
    return {
      flex: 1,
      backgroundColor: 'green',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      width:'100%'
    }
  }

  render() {
  console.log('xsefjaef');
    return (

      <Swiper
        loop={false}
        showsPagination={false}
        index={1}>
        <View style={this.viewStyle()}>
          <InputScreen>
          </InputScreen>
        </View>
        <Swiper
          horizontal={false}
          loop={false}
          showsPagination={false}
          index={1}>
          <View style={this.viewStyle()}>
            <TitleText label="Top" />
          </View>
          <View style={this.viewStyle()}>
            <TitleText label="Home" />
          </View>
          <View style={this.viewStyle()}>
            <TitleText label="Bottom" />
          </View>
        </Swiper>        
        <View style={this.viewStyle()}>
          <LogScreen>
          </LogScreen>
        </View>
      </Swiper>
      
    )
  }
}

export default Home
