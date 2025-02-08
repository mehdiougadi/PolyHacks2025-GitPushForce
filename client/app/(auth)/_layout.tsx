import { Tabs } from "expo-router";
import { View } from "react-native";


export default function AuthLayout(){

    return (
        <View>
            <Tabs>
                <Tabs.Screen name="entry" />
                <Tabs.Screen name="signin" />
                <Tabs.Screen name="signup" />
            </Tabs>
        </View>
    );
}