import DefaultScreen from "@client/components/screens/default-screen";
import { View, Text, StyleSheet } from "react-native";


export default function EntryScreen(){
    return (
        <DefaultScreen>
            <View style={styles.container}>
                <Text>Entry Screen</Text>
            </View>
            
        </DefaultScreen>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});