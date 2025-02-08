import { Tabs } from "expo-router";
import { View } from "react-native";


export default function AppLayout(){

    return (
            <Tabs>
                <Tabs.Screen name="home/index" />
            </Tabs>
    );
}