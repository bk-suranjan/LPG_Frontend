import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import { Picker } from '@react-native-picker/picker';




const AdminDetails = () => {
 const {Details:id}  = useLocalSearchParams(); // booking id from route
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const allowedStatus = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

  useEffect(() => {
    fetchBooking(id);
  }, []);

  const fetchBooking = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await api.get(`/booking/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooking(res.data.booking);
      setStatus(res.data.booking.status); // initialize dropdown
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await api.put(
        `/booking/${id}/confirm`, // your controller URL
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', `Booking status updated to ${newStatus}`);
      setBooking(res.data.booking);
      setStatus(newStatus);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (loading) return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
  if (!booking) return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>Booking not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Booking Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Cylinder Type:</Text>
        <Text>{booking.cylinderType}</Text>

        <Text style={styles.label}>Quantity:</Text>
        <Text>{booking.quantity}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text>{booking.address}</Text>

        <Text style={styles.label}>Booking Date:</Text>
        <Text>{new Date(booking.bookingDate).toLocaleDateString()}</Text>

        <Text style={styles.label}>Delivery Date:</Text>
        <Text>{booking.deliveryDate ? new Date(booking.deliveryDate).toLocaleDateString() : 'Not set'}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text>{booking.status}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Change Status:</Text>
        {Platform.OS === 'android' ? (
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => {
              setStatus(itemValue);
              updateStatus(itemValue);
            }}
            style={{ height: 50, width: '100%' }}
          >
            {allowedStatus.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        ) : (
          // iOS alternative: simple buttons for each status
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {allowedStatus.map((s) => (
              <Text
                key={s}
                onPress={() => updateStatus(s)}
                style={{
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: status === s ? '#4caf50' : '#fff',
                  color: status === s ? '#fff' : '#000',
                }}
              >
                {s}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default AdminDetails;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  label: { fontWeight: 'bold', marginTop: 10 },
});