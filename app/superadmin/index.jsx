import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = () => {
  const [bookings, setBookings] = useState([])

  const getBookings = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
      const res = await api.get('/booking/total', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.booking)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBookings()
  }, [])

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Cylinder: {item.cylinderType}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date: {new Date(item.bookingDate).toDateString()}</Text>
      <Text>Admin: {item.assignedAdmin?.fullName}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Super Admin Dashboard</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
  },
})