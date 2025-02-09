import DefaultScreen from '@client/components/screens/default-screen';
import ReturnHome from '@client/components/return-home';
import { Text } from 'react-native';
import React from 'react';
import ChatBot from '@client/components/chatbot/ChatBot';

export default function AdvisorScreen(){
    return (
        <DefaultScreen>
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}>Agricultural Advisor</Text>
            <ChatBot />
            <ReturnHome />
        </DefaultScreen>
    );
}
