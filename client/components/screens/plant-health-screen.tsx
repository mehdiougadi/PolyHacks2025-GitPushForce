import { Camera } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, View, Image, ActivityIndicator } from 'react-native';

export default function PlantHealthScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraRef = useRef<Camera>(null);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
      analyzePhoto(photo.uri);
    }
  };

  const analyzePhoto = async (uri: string) => {
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('images', blob as any);
      formData.append('key', 'YOUR_PLANT.ID_API_KEY');

      const apiResponse = await fetch('https://api.plant.id/v2/health_assessment', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await apiResponse.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title="Request Camera Permission" onPress={requestPermissions} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ flex: 1 }} />
      ) : (
        <Camera style={{ flex: 1 }} ref={cameraRef} />
      )}
      
      {loading && <ActivityIndicator size="large" style={{ position: 'absolute' }} />}
      
      {!photo && (
        <Button
          title="Take Photo"
          onPress={takePhoto}
          disabled={loading}
          style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}
        />
      )}
      
      {result && (
        <PlantHealthReport result={result} 
          onRetake={() => {
            setPhoto(null);
            setResult(null);
          }}
        />
      )}
    </View>
  );
}