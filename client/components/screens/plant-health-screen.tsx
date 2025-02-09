import { Camera } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { PLANT_ID_API_KEY } from "@client/constants/api-key";
import PlantHealthReport from "@client/components/plant-health-report";
import { Colors } from "@client/constants/Colors";
import { useColorScheme } from 'react-native';

export default function PlantHealthScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraRef = useRef<Camera>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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
      formData.append('key', PLANT_ID_API_KEY);

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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Button 
          title="Request Camera Permission" 
          onPress={() => Camera.requestCameraPermissionsAsync()} 
          color={colors.tint}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.camera} />
      ) : (
        <Camera 
          style={styles.camera} 
          ref={cameraRef}
          type={Camera.Constants.Type}
        />
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      )}
      
      {!photo && (
        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            disabled={loading}
            color={colors.tint}
          />
        </View>
      )}
      
      {result && (
        <PlantHealthReport 
          result={result} 
          onRetake={() => {
            setPhoto(null);
            setResult(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 20,
  },
});