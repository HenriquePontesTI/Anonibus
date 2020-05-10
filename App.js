import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet, Text, View, YellowBox, TouchableOpacity,
  TextInput, Image
} from 'react-native';
import firebase from './config/firebase';
import api from './services/axios';
import axios from 'axios';

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {

  const [caixaTexto, setCaixaTexto] = useState('');
  const [user, setUser] = useState(null);

  const salvar = () => {
    api.post('/enviarMensagem', {
      mensagem: caixaTexto,
      usuario: user.name,
      avatar: user.picture
    }).then(function () {
      console.log('salvo')
    }).catch(function (err) {
      console.log(err);

    })
  }

  useEffect(() => {
    carregaUsuarioAnonimo();
  }, [])

  const carregaUsuarioAnonimo = () => {
    axios.get('https://randomuser.me/api/')
      .then(function (response) {
        const user = response.data.results[0];
        // setDistance(response.data.distance)
        setUser({
          name: `${user.name.first} ${user.name.last}`,
          picture: user.picture.large
        })

      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      {user &&
        <>
          <Image style={{
            width: 100,
            height: 100,
            borderWidth: 3,
            borderColor: "#333",
            borderRadius: 50
          }}
            source={{ uri: user.picture }} />
          <Text>{user.name}</Text>
        </>
      }
      <TextInput
        style={{
          borderColor: '#e6e6e6',
          margin: 10,
          marginTop: 0,
          borderRadius: 4,
          padding: 4,
          backgroundColor: '#fff',
          flex: 1,
          borderWidth: 1
        }}
        onChangeText={text => setCaixaTexto(text)}
        value={caixaTexto}
      />
      <TouchableOpacity onPress={salvar}>
        <Ionicons style={{ margin: 3, color: '#f34f' }} name="md-send" size={32} color={'#999'} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});