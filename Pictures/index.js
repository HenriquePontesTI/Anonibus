import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import firebase from '../config/firebase';

export default function Pictures() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    takePicture = () => {
        if (camera) {
            camera.takePictureAsync({ onPictureSaved: onPictureSaved });
        }
    };

    onPictureSaved = async photo => {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const filename = new Date().getTime();

        var ref = firebase.storage().ref().child('pictures/' + filename);

        ref.put(blob).then(function (snapshot) {

            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                setImagem(downloadURL)
            })

        })
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    console.disableYellowBox = true;

    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={type} ref={(ref) => { camera = ref }} >

                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={{ fontSize: 18, marginBottom: 14, color: 'black', backgroundColor: 'white', borderRadius: 5 }}> Girar Camera </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }} onPress={takePicture}>
                        <Text style={{ fontSize: 18, marginBottom: 14, color: 'white', backgroundColor: 'gray', borderRadius: 5  }}> Tirar foto </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}