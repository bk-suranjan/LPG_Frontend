import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const Book = () => {
  const [cylinderType, setCylinderType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [address, setAddress] = useState('');

  const handleBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await api.post(
        '/booking/book', // 🔥 replace with your IP
        {
          cylinderType,
          quantity: Number(quantity),
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Booking successful ✅');
      console.log(res.data);

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert('Booking failed ❌');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Cylinder</Text>

      <Text>Type (5kg / 10kg / 15kg)</Text>
      <TextInput
        value={cylinderType}
        onChangeText={setCylinderType}
        placeholder="Enter type"
        style={styles.input}
      />

      <Text>Quantity</Text>
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        style={styles.input}
      />

      <Button title="Book Now" onPress={handleBooking} />
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
});