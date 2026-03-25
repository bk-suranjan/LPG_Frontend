import { StyleSheet,} from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
   <Tabs screenOptions={{headerShown:false}}>
    <Tabs.Screen name='index'/>
    <Tabs.Screen name='Request'/>
   </Tabs>
  )
}

export default _layout
