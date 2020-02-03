import React, { Component } from 'react'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Login from '../Login'
import Cadastro from './Cadastro'
import Kanban from './Kanban'
import Kanball from './Kanbolas/Kanball'
import Perfil from './Perfil'
import Mapa from './Mapa'

const MainNav = createStackNavigator(
  {
    Login:{
        screen: Login,
        navigationOptions:{
            headerShow:false
        }
    },
    Cadastro:{
        screen:Cadastro,
        navigationOptions:{
            headerTitle:'Cadastro'
        }
    },
      Kanban:{
        screen:Kanban,
        navigationOptions:{
            headerTitle:'Kanban'
        }
     
    },
       Kanball:{
        screen:Kanball,
        navigationOptions:{
            headerTitle:'Kanball'
        }
    },
        Perfil:{
        screen:Perfil,
        navigationOptions:{
            headerTitle:'Perfil'
        }
    },
        Mapa:{
        screen:Mapa,
        navigationOptions:{
            headerTitle:'Mapa'
        }
    },
       
  }
)   

export default createAppContainer(MainNav)