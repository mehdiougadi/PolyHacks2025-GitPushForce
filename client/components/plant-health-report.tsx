import { View, Text, Button, StyleSheet } from 'react-native';
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Health Report</Text>
      
      {result.health_assessment?.diseases.map((disease, index) => (
        <View 
          key={index} 
          style={[styles.diseaseContainer, { backgroundColor: colors.lightBackground }]}
        >
          <Text style={[styles.diseaseName, { color: colors.text }]}>
            {disease.name}
          </Text>
          <Text style={[styles.probability, { color: colors.tint }]}>
            Probability: {(disease.probability * 100).toFixed(1)}%
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {disease.disease_description}
          </Text>
        </View>
      ))}
      
      <Button 
        title="Retake Photo" 
        onPress={onRetake}
        color={colors.tint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    padding: 16,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  diseaseContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
  diseaseName: {
    fontWeight: '600',
  },
  probability: {
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});