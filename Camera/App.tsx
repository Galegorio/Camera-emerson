import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// importa componentes hook relacionados a camera Expo
import { useState, useRef } from 'react';
// importa hooks do react
import { Button, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
// importa componentes do React Native
import { Entypo } from '@expo/vector-icons';
// importa icons 
import * as Sharing from 'expo-sharing';
// importa o modulo de compartilhamento do expo

export default function App(){
  const [modo, setModo] = useState<CameraType>('back');
  // Define o estado inicial da camera como traseira
  const[permission, requestPermission] = useCameraPermissions();
  // Hook para gerenciar permissão da camera
  const cameraRef = useRef<CameraView>(null);
  // Referencia para Visualização da Camera
  const [foto, setFoto] = useState<string | null>(null);
  // Estado para armazenar a URI da foto tirada
  
  if(!permission) {
    // As permissões da cãmera ainda estão sendo carregadas.
    return <View />;
    // Retorna uma visualização vazia enquanto as permissões estão sendo carregadas
  }

  if (!permission.granted) {
    // As permissões da câmera ainda estão sendo carregadas.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para mostrar a câmera</Text>
        <Button onPress={requestPermission} title='Conceder permissão' />
      </View>
    );
  }


  function trocarCamera(){
    // Alterna entre a câmera traseira e a frontal
    setModo(current => (current === 'back' ? 'front' : 'back'));
    // Alterna o estado da câmera.
  }

  async function compartilharFoto() {
      if(!foto){
        alert('Tire uma foto antes de compartilhar');
        // Alertar caso não haja foto para compartilhar.
        return;
      }
      if(!(await Sharing.isAvailableAsync())) {
        alert('Ops, o compartilhamento não está disponível na sua plataforma!');
        // Alerta caso o compartilhamento não esteja disponível.
        return;
      }
      await Sharing.shareAsync(foto);
      // Compartilha a foto.
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={modo} ref={cameraRef}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={trocarCamera}>
            <Entypo name='cw' size={24} color={"White"} />
            <Text style={styles.text}>Alterar Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync();
              console.log('foto', photo);
              setFoto(photo.uri);
            }
          }}>
            <Entypo name='camera' size={24} color={"White"} />
            <Text style={styles.text}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {foto &&
        <View style={styles.previewContainer}>
          <Image source={{ uri: foto}} style={styles.fotoView} />
          <TouchableOpacity  style={styles.shareButton} onPress={compartilharFoto}>
            <Entypo name='share' size={24} color={"White"} />
            <Text style={styles.shareText}>Compartilhar Foto</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    marginTop: 5,
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  fotoView: {
    width: 200,
    height: 200,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ff6347',
    marginLeft: 10,
    borderRadius: 5,
  },
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  }
});