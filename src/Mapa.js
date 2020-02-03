import React, { Component } from 'react'
import Momo from '../images/momo.jpg'
import Romance from '../images/romance.jpeg'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Button
  
} from 'react-native';


class Mapa extends Component {
    render(){
        return(
        <View style={styles.container}>
            <MapView provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
                latitude:-22.233077,
                longitude:-49.965907,
                latitudeDelta: 0.015,
            longitudeDelta: 0.0121}}
                showsUserLocation
                loadingEnabled/>
        </View>
        )
    }
}
const styles = StyleSheet.create({
    container: { ... StyleSheet.absoluteFillObject },
    map: { ...StyleSheet.absoluteFillObject }
  })
export default Mapa