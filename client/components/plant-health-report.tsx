import { View, Text, Button } from 'react-native';

interface PlantHealthResult {
  // Define the properties of the PlantHealthResult type
  health_assessment: {
    diseases: Array<{
      name: string;
      probability: number;
      disease_description: string;
    }>;
  };
}

interface PlantHealthReportProps {
    result: PlantHealthResult;
    onRetake: () => void; // Replace 'any' with the actual type of onRetake
  }
  
  export default function PlantHealthReport({ result, onRetake }: PlantHealthReportProps) {
  return (
    <View style={{ 
      position: 'absolute', 
      bottom: 0, 
      backgroundColor: 'white', 
      padding: 16,
      width: '100%'
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Health Report</Text>
      
      {result.health_assessment?.diseases.map((disease, index) => (
        <View key={index} style={{ marginTop: 8 }}>
          <Text>Disease: {disease.name}</Text>
          <Text>Probability: {(disease.probability * 100).toFixed(1)}%</Text>
          <Text>Description: {disease.disease_description}</Text>
        </View>
      ))}
      
      <Button title="Retake Photo" onPress={onRetake} />
    </View>
  );
}