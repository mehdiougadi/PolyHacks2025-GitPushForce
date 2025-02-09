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
      // Create form data with proper file structure
      const formData = new FormData();
      formData.append('images', {
        uri,
        type: 'image/jpeg',
        name: 'plant_photo.jpg',
      } as any);
  
      const apiResponse = await fetch('https://plant.id/api/v3/health_assessment', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Api-Key': PLANT_ID_API_KEY,
        },
      });
  
      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
  
      const data = await apiResponse.json();
      console.log("Full API response:", JSON.stringify(data, null, 2));
  
      // Check for the expected structure in the API response.
      // The API returns disease suggestions under data.result.disease.suggestions
      if (
        data &&
        data.result &&
        data.result.disease &&
        Array.isArray(data.result.disease.suggestions)
      ) {
        // Transform the API response into the expected format.
        const transformedData = {
          health_assessment: {
            diseases: data.result.disease.suggestions.map((suggestion: any) => ({
              // Map API fields to your expected fields.
              // Adjust these keys if your API returns differently.
              name: suggestion.name || 'Unknown Disease',
              probability: suggestion.probability || 0,
              disease_description: suggestion.disease_description || 'No description provided.',
            })),
          },
        };
  
        setResult(transformedData);
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
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
