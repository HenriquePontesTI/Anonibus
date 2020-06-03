import React, { useState, useEffect } from "react";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { } from './styles';
import api from '../services/axios';

import { AuthContext } from '../context';

import firebase from 'firebase';
import flagBlueImg from './assets/flag-blue.png';
import flagPinkImg from './assets/flag-pink.png';



export default Profile = () => {

  const [location, setlocation] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [scrollview, setScrollview] = useState('');
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [city, setcity] = useState("");
  const [country, setcountry] = useState("");
  const [region, setregion] = useState("");
  const [street, setstreet] = useState("");

  const db = firebase.firestore();

  const salvar = () => {
    api.post('/salvarLocalizacao', {
      city: city,
      street: street,
      region: region,
      country: country,
    })
      .then(function () {
        scrollview.scrollToEnd({ animated: true })
      }).catch(function () {

      })
  }

  const { signOut } = React.useContext(AuthContext);

  const handleSignOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      signOut();
    }).catch(function (error) {
      alert(error)
    });
  }

  getGeocodeAsync = async (location) => {
    let geocodes = await Location.reverseGeocodeAsync(location)
    setcity(geocodes[0].city);
    setcountry(geocodes[0].country);
    setregion(geocodes[0].region);
    setstreet(geocodes[0].street);
  }

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const { latitude, longitude } = location.coords
    getGeocodeAsync({ latitude, longitude })
    setlatitude(location.coords.latitude);
    setlongitude(location.coords.longitude);
    console.log(AuthContext);
  };

  useEffect(() => {
    let lugares_salvos = []
    const unsubscribe = db.collection('mapa').doc('localizacao_01')
      .collection('lugar')
      .onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const { street, city, region, country } = change.doc.data()
            const id = change.doc.id
            lugares_salvos.push({ street, city, region, country, id })
          }
        })
        setLugares([...lugares_salvos])
        scrollview ? scrollview.scrollToEnd({ animated: true }) : null;
      })
    return () => {
      unsubscribe()
    }
  }, [])

  console.disableYellowBox = true;


  return (

    <View style={styles.container}>
      <Text>PROFILE</Text>
      <Button title="Sair" onPress={() => handleSignOut()} />


      <Text>VOCÊ ESTÁ AQUI: </Text>
      <Button title="Mostrar Localização" onPress={() => getLocationAsync()} />
      <Button title="Salvar Localização nos Favoritos" onPress={salvar} />
      {latitude &&
        <>
          <MapView style={styles.mapStyle} initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 1,
            longitudeDelta: 1
          }}>
            <Marker onPress={() => getLocationAsync()}
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              centerOffset={{ x: -42, y: -60 }}
              anchor={{ x: 0.84, y: 1 }}
              opacity={0.6}
              image={location ? flagBlueImg : flagPinkImg}
            >
              <Text style={styles.marker}>X</Text>
            </Marker>
          </MapView>
        </>
      }
      <ScrollView style={styles.scrollview} ref={(view) => { setScrollview(view) }}>
        {lugares.length > 0 && lugares.map(item => (
          <View key={item.id}>
            <View style={{ flexDirection: 'column', marginTop: 5 }}>
              <Text style={{ fontSize: 12, color: '#999' }}>{item.street},
                {item.city}, {item.region}, {item.country}</Text>
            </View>
          </View>
        ))
        }
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  mapStyle: {
    width: 400,
    height: 400,
  },
  marker: {
    marginLeft: 46,
    marginTop: 33,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  }
});

