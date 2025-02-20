import { Tabs } from "expo-router";
import { View } from "react-native";


export default function AuthLayout(){

    return (
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: { display: 'none' } 
            }}>
                <Tabs.Screen name="entry/index" />
                <Tabs.Screen name="signin/index" />
                <Tabs.Screen name="signup/index" />
            </Tabs>
    );
}