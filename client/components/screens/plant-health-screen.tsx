import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text, Pressable } from 'react-native';
import { PLANT_ID_API_KEY } from '@client/constants/api-key';
import PlantHealthReport from '@client/components/plant-health-report';
import { Colors } from '@client/constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantHealthScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const handleBack = () => {
    router.back();
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      analyzePhoto(photoData.uri);
    }
  };

  const analyzePhoto = async (uri: string) => {
    setLoading(true);
    try {
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
      
      if (
        data &&
        data.result &&
        data.result.disease &&
        Array.isArray(data.result.disease.suggestions)
      ) {
        const transformedData = {
          health_assessment: {
            diseases: data.result.disease.suggestions.map((suggestion: any) => ({
              name: suggestion.name || 'Unknown Disease',
              probability: suggestion.probability || 0,
              disease_description: suggestion.disease_description || '',
            })),
          },
        };
  
        setResult(transformedData);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Request Camera Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
        </Pressable>
        <Text style={styles.headerTitle}>Plant Health Check</Text>
      </View>

      <View style={styles.cameraContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.camera} />
        ) : (
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
        
        {!photo && (
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={takePhoto}
              disabled={loading}
              style={({ pressed }) => [
                styles.captureButton,
                pressed && styles.captureButtonPressed
              ]}
            >
              <Ionicons name="camera" size={32} color="white" />
            </Pressable>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
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
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  permissionButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});