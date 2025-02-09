import DefaultScreen from '@client/components/screens/default-screen';
import ReturnHome from '@client/components/return-home';
import { Text } from 'react-native';

export default function AdvisorScreen(){
    return (
        <DefaultScreen>
            <Text>Advisor Screen</Text>
            <ReturnHome />
        </DefaultScreen>
    );
}