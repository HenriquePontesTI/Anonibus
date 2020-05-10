import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet, Text, View, YellowBox, TouchableOpacity,
  TextInput, Image, ScrollView
} from 'react-native';
import firebase from './config/firebase';
import api from './services/axios';
import axios from 'axios';

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {

  const db = firebase.firestore();
  const [caixaTexto, setCaixaTexto] = useState('');
  const [user, setUser] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [scrollView, setScrollView] = useState(null);

  const salvar = () => {
    api.post('/enviarMensagem', {
      mensagem: caixaTexto,
      usuario: user.name,
      avatar: user.picture
    }).then(function () {
      setMensagens([...mensagens, caixaTexto]);
      console.log('salvo')
    }).catch(function (err) {
      console.log(err);
    })
  }

  useEffect(() => {
    carregaUsuarioAnonimo();
    let mensagens_enviadas = []
    const unsubscribe = db.collection("chats")
      .doc("sala_01").collection('mensagens')
      .onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const { mensagem, usuario, avatar } = change.doc.data()
            const id = change.doc.id
            mensagens_enviadas.push({ mensagem, usuario, avatar, id })
          }
        })
        setMensagens([...mensagens_enviadas])
        scrollView ? scrollView.scrollToEnd({ animated: true }) : null;
      })
    return () => {
      unsubscribe()
    }
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
      <ScrollView
        ref={(view) => { setScrollView(view) }}
        style={styles.scrollView}>
        {
          mensagens.length > 0 && mensagens.map(item => (
            <View key={item.id} style={{
              flexDirection: 'row',
              paddingLeft: 10,
              paddingTop: 10,
              marginRight: 60
            }}>
              <Image style={{
                margin: 5,
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: "#333",
                borderRadius: 50
              }}
                source={{ uri: item.avatar }} />
              <View style={{ marginTop: 5, flexDirection: 'column' }}>
                <Text style={{ fontSize: 12, color: '#999' }} >{item.usuario}</Text>
                <Text>{item.mensagem}</Text>
              </View>

            </View>
          ))
        }
      </ScrollView >
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