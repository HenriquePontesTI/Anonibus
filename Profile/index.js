import React, { useState, useEffect } from "react";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Button, PermissionsAndroid } from "react-native";
import { } from './styles';

import { AuthContext } from '../context';

import firebase from 'firebase';
import flagBlueImg from './assets/flag-blue.png';
import flagPinkImg from './assets/flag-pink.png';



export default Profile = () => {

  const [location, setlocation] = useState([]);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);

  const { signOut } = React.useContext(AuthContext);

  const handleSignOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      signOut();
    }).catch(function (error) {
      alert(error)
    });
  }

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    setlatitude(location.coords.latitude);
    setlongitude(location.coords.longitude);
    console.log(latitude, longitude)

  };

  console.disableYellowBox = true;


  return (
    
    <View style={styles.container}>
      <Text>VOCÊ ESTÁ AQUI: </Text>
      <Button title="Localização" onPress={() => getLocationAsync()} />
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
                latitude: latitude ,
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
      <Text>PROFILE</Text>
      <Button title="Sair" onPress={() => handleSignOut()} />
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

