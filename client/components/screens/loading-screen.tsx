import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingScreenProps = {
    message?: string;
};

const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingBox: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});

export default LoadingScreen;