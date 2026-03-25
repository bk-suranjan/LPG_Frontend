import { StyleSheet, Text, View, FlatList, ActivityIndicator,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import { useRouter } from 'expo-router';

const Request = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await api.get('/booking/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data.bookings);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    // admin/subscreens/[Details
    <TouchableOpacity onPress={()=>router.push(`admin/subscreens/${item._id}`)} style={styles.card}>
      <Text style={styles.label}>Cylinder Type:</Text>
      <Text>{item.cylinderType}</Text>

      <Text style={styles.label}>Quantity:</Text>
      <Text>{item.quantity}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text>{item.address}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text>{item.status}</Text>

      <Text style={styles.label}>Booking Date:</Text>
      <Text>{new Date(item.bookingDate).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!bookings.length)
    return (
      <View style={styles.container}>
        <Text>No bookings found 😔</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
  },
});