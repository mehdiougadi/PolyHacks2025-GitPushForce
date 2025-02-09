import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors } from "@client/constants/Colors";
import { useColorScheme } from 'react-native';

interface Disease {
  name: string;
  probability: number;
  disease_description: string;
}

interface HealthAssessment {
  diseases: Disease[];
}

interface PlantHealthReportProps {
  result: {
    health_assessment?: HealthAssessment;
  };
  onRetake: () => void;
}

export default function PlantHealthReport({ result, onRetake }: PlantHealthReportProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Extract the diseases array, defaulting to an empty array if not available
  const diseases = result?.health_assessment?.diseases || [];

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Health Report</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {diseases.length > 0 ? (
          diseases.map((disease, index) => (
            <View
              key={index}
              style={styles.diseaseContainer}
            >
              <Text style={styles.diseaseName}>
                {disease.name}
              </Text>
              <Text style={styles.probability}>
                Probability: {(disease.probability * 100).toFixed(1)}%
              </Text>
              <Text style={styles.description}>
                {disease.disease_description}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            No health records available.
          </Text>
        )}
      </ScrollView>

      <Pressable
        onPress={onRetake}
        style={({ pressed }) => [
          styles.retakeButton,
          pressed && styles.retakeButtonPressed
        ]}
      >
        <Text style={styles.retakeButtonText}>Retake Photo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    paddingHorizontal: 16,
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 80, // Space for the button
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  diseaseContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  probability: {
    marginTop: 4,
    fontSize: 14,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
    color: '#333333',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#000000',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  retakeButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  retakeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});