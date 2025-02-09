import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { PLANT_ID_API_KEY } from '@client/constants/api-key';
import PlantHealthReport from '@client/components/plant-health-report';
import { Colors } from '@client/constants/Colors';
import { useColorScheme } from 'react-native';

export default function PlantHealthScreen() {
  // State for photo URI, loading state, and analysis result
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Use the new permissions hook from expo-camera
  const [permission, requestPermission] = useCameraPermissions();

  // Function to take a photo
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      analyzePhoto(photoData.uri);
    }
  };

  // Function to send the photo to the plant health API for analysis
  const analyzePhoto = async (uri: string) => {
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('images', blob as any);
      formData.append('key', PLANT_ID_API_KEY);

      const apiResponse = await fetch('https://plant.id/api/v3/health_assessment', {
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

  // If permission information is still loading, show a loading indicator
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  // If permissions are not granted, show a button to request them
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Button 
          title="Request Camera Permission" 
          onPress={requestPermission} 
          color={colors.tint}
        />
      </View>
    );
  }

  // Main UI when permissions are granted
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.camera} />
      ) : (
        // Use the Camera component with the new CameraType for specifying the back camera
        <CameraView 
          style={styles.camera} 
          ref={cameraRef}
        />
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      )}
      
      {/* Only show the "Take Photo" button if a photo has not yet been taken */}
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
      
      {/* Display the plant health report if results are available */}
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
