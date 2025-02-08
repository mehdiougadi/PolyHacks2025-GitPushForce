import { Tabs } from "expo-router";
import { View } from "react-native";


export default function AuthLayout(){

    return (
        <View>
            <Tabs>
                <Tabs.Screen name="(auth)/entry" />
                <Tabs.Screen name="(auth)/signin" />
                <Tabs.Screen name="(auth)/signup" />
            </Tabs>
        </View>
    );
}