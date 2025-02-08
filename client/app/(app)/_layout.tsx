import { Tabs } from "expo-router";
import { View } from "react-native";


export default function AppLayout(){

    return (
        <View>
            <Tabs>
                <Tabs.Screen name="home" />
            </Tabs>
        </View>
    );
}