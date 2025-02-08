import { StyleSheet, View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import Feature from "@common/interfaces/feature";
import { useRouter } from "expo-router";

export default function FeatureItem({ feature }: { feature: Feature }) {
    const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={() => {router.navigate(feature.route as any)}}>
      <Image source={feature.icon} style={styles.icon} />
      <Text style={styles.name}>{feature.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    icon:{
        height: 125,
        width: 125,
        borderRadius: 12,
    },
    name:{
        fontSize: 16,
    }
});