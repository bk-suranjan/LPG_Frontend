import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const GasDetails = () => {
  const {GasDetails:id} = useLocalSearchParams();

 
  return (
    <View>
      <Text>GasDetails</Text>
    </View>
  )
}

export default GasDetails

const styles = StyleSheet.create({})