import { StyleSheet, Text, View, FlatList,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utils/api';
import { useRouter } from 'expo-router';

const Home = () => {
  const [cylinders, setCylinders] = useState([]);
  const router = useRouter()

  useEffect(() => {
    fetchCylinders();
  }, []);

  const fetchCylinders = async () => {
    try {
      const res = await api.get('/cylinder'); // change IP
      setCylinders(res.data.cylinders);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Cylinders</Text>

      <FlatList
        data={cylinders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>router.push(`user/subScreen/${item._id}`)} style={styles.card}>
            <Text>Type: {item.type}</Text>
            <Text>Price: Rs. {item.price}</Text>
            <Text>Stock: {item.stock}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
});