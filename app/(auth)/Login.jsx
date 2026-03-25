import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
    import { router } from 'expo-router';


export default function Login( ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {

      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      // Store token + user globally (Zustand or Context)
      // Redirect based on role
      await AsyncStorage.setItem('token',token)
      await AsyncStorage.setItem('user',JSON.stringify(user))
      console.log('user',user)


if (user.role === 'user') router.replace('/user/screen');
if (user.role === 'admin') router.replace('/admin/screens');
if (user.role === 'superadmin') router.replace('/superadmin/');
    } catch (e) {
        console.log(e)
      alert('Login failed');
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{borderWidth:1,marginBottom:10}} />
      <Text>Password</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} style={{borderWidth:1,marginBottom:20}} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}