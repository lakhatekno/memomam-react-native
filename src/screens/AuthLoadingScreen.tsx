import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const WHITE_BACKGROUND = '#FDFFFC';
const COLOR_DARK = '#18024E';

const AuthLoadingScreen = () => {
    const navigation = useNavigation<any>();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                setTimeout(() => {
                    if (token) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        });
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }, 500);

            } catch (error) {
                console.error("Failed to fetch token", error);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        };

        checkToken();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLOR_DARK} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE_BACKGROUND,
    },
});

export default AuthLoadingScreen;