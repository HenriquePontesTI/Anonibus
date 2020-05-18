import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet, View, Text, YellowBox, Image, ScrollView,
  TextInput, TouchableOpacity
} from 'react-native';
import firebase from '../config/firebase';
import api from '../services/axios';
import axios from 'axios';
import styles from './styles';

export default function Chat() {

  const [user, setUser] = useState(null)
  const [mensagens, setMensagens] = useState([])
  const [caixaTexto, setCaixaTexto] = useState('')
  const [scrollview, setScrollview] = useState('')
  const [teste, setTeste] = useState('')


  const db = firebase.firestore()
  let mensagens_enviadas = []
  const salvar = () => {
    api.post('/enviarMensagem', {
      mensagem: caixaTexto,
      usuario: user.name,
      avatar: user.picture,
    })
      .then(function (response) {
        // setMensagens([...mensagens, caixaTexto])
        setCaixaTexto('');
        console.log("salvo: ", response)
        scrollview.scrollToEnd({ animated: true })
      }).catch(function () {

      })
  }

  useEffect(() => {
    carregaUsuarioAnonimo()
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
        scrollview ? scrollview.scrollToEnd({ animated: true }) : null;
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
        console.log('user', user)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <View style={styles.view}>

      {user &&
        <>
          <TouchableOpacity onPress={carregaUsuarioAnonimo}>

            <Image
              style={styles.avatar}
              source={{ uri: user.picture }} />
          </TouchableOpacity>

          <Text style={styles.nome_usuario}>{user.name}</Text>
        </>

      }
      <ScrollView style={styles.scrollview} ref={(view) => { setScrollview(view) }}>
        {
          mensagens.length > 0 && mensagens.map(item => (
            <View key={item.id} style={styles.linha_conversa}>
              <Image style={styles.avatar_conversa} source={{ uri: item.avatar }} />
              <View style={{ flexDirection: 'column', marginTop: 5 }}>
                <Text style={{ fontSize: 12, color: '#999' }}>{item.usuario}</Text>
                <Text>{item.mensagem}</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>

      <View style={styles.footer}>
        <TextInput
          style={styles.input_mensagem}
          onChangeText={text => setCaixaTexto(text)}
          value={caixaTexto} />

        <TouchableOpacity onPress={salvar}>
          <Ionicons style={{ margin: 3 }} name="md-send" size={32} color={'#999'} />
        </TouchableOpacity>
      </View>

    </View>)
}
