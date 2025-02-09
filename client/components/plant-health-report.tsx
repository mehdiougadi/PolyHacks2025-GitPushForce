import { View, Text, Button } from 'react-native';
import { Colors } from "@client/constants/Colors";

export default function PlantHealthReport({ result, onRetake }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Health Report</Text>
            
            {result.health_assessment?.diseases.map((disease, index) => (
                <View key={index} style={styles.diseaseContainer}>
                    <Text style={styles.diseaseName}>{disease.name}</Text>
                    <Text style={styles.probability}>
                        Probability: {(disease.probability * 100).toFixed(1)}%
                    </Text>
                    <Text style={styles.description}>{disease.disease_description}</Text>
                </View>
            ))}
            
            <Button 
                title="Retake Photo" 
                onPress={onRetake}
                color={Colors.primary} // Use your theme color
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.background,
        padding: 16,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },
    diseaseContainer: {
        marginVertical: 8,
        padding: 12,
        backgroundColor: Colors.lightBackground,
        borderRadius: 8,
    },
    diseaseName: {
        fontWeight: '600',
        color: Colors.text,
    },
    probability: {
        color: Colors.accent,
    },
    description: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
});