import React, { Component } from 'react'
import Momo from '../images/momo.jpg'
import Romance from '../images/romance.jpeg'

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Button
  
} from 'react-native';


class Perfil extends Component {
    state={
        idade:null,
        imagem:null,
        senha:null,
        nome:null,
        email:null,
        gosto:null,
        saldo:null,
        data:null
      }
componentDidMount(){
    

}
Next=()=>{
  
  this.props.navigation.replace('Mapa')
}

    render(){
      const {navigation} = this.props
        const objeto = navigation.getParam('objeto') 
        var pref=''
        switch(objeto.gosto){
          case 'terror':
            pref=Momo
            break
          case 'romance':
            pref=Romance
            break
          case 'acao':
             pref=Acao
             break
          case 'comedia':
             pref=Comedia
             break

        }
        
        
      return (
          <View style={styles.container}>
            <ImageBackground source={pref} style={{flex:1, height:'100%', width:'100%', backgroundColor:'black'}}>
              <Text>Olá {objeto.nome}</Text>
              <Text>Olá {objeto.gosto}</Text>
              <Button title={'Mapa'} onPress={()=>this.Next()}><Text>Mapa</Text></Button>
            </ImageBackground>
          </View>


        )
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }
  })
  export default Perfil