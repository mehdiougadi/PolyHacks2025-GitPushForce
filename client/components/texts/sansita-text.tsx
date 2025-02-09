import React from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';

interface TextProps {
    text: string;
    fontSize: string;
    lineHeight: string;
}

export default function SansitaText({ text, fontSize, lineHeight }: TextProps) {
    const [fontsLoaded] = useFonts({
        'SansitaOne-Regular': require('@client/assets/fonts/sansitaOne-regular.ttf'),
    });

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    return (
        <Text
            style={{
                fontSize: parseInt(fontSize),
                fontFamily: 'SansitaOne-Regular',
                lineHeight: parseInt(lineHeight),
            }}
        >
            {text}
        </Text>
    );
}
