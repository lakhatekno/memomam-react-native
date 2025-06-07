import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import Api from '../api.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const BORDER_COLOR = '#E0E0E0';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const checkBiometricSupport = async () => {
            console.log("Checking for biometric support...");
            try {
                const credentials = await Keychain.getGenericPassword();
                console.log("Credentials exist in Keychain:", !!credentials);

                setBiometricEnabled(!!credentials);
            } catch (error) {
                console.log("Biometric check failed", error);
                setBiometricEnabled(false);
            }
        };
        checkBiometricSupport();
    }, []);

    const handleLogin = async (user: string, pass: string) => {
        if (!user || !pass) {
            Alert.alert("Error", "Username and password cannot be empty.");
            return;
        }
        setLoading(true);
        try {
            const response = await Api.post('/login', { username: user, password: pass });
            const token = response.data.data.token;
            await AsyncStorage.setItem('token', token);

            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                Alert.alert(
                    "Enable Fingerprint Login",
                    "Would you like to use your fingerprint to log in next time?",
                    [
                        { text: "No, Thanks", style: "cancel", onPress: () => navigateToMain() },
                        { text: "Yes", onPress: async () => {
                            await Keychain.setGenericPassword(user, pass);
                            navigateToMain();
                        }}
                    ]
                );
            } else {
                navigateToMain();
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Invalid username or password.';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        setLoading(true);
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                await handleLogin(credentials.username, credentials.password);
            } else {
                Alert.alert("Info", "No saved credentials found. Please log in normally first.");
            }
        } catch (error) {
            console.log("Biometric login failed:", error);
            Alert.alert("Error", "Biometric authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    const navigateToMain = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.headerTitle}>LOGIN</Text>

                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder='Username'
                        placeholderTextColor="#999"
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Password'
                        placeholderTextColor="#999"
                        secureTextEntry={true}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => handleLogin(username, password)}
                            disabled={loading}
                        >
                            {loading && !biometricEnabled ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>LOGIN</Text>
                            )}
                        </TouchableOpacity>

                        {biometricEnabled && (
                             <TouchableOpacity
                                style={styles.fingerprintButton}
                                onPress={handleBiometricLogin}
                                disabled={loading}
                             >
                                <Icon name="fingerprint" size={30} color={COLOR_DARK} />
                             </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Belum punya akun? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                          <Text style={styles.linkText}>Buat akun</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE_BACKGROUND,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 180,
        height: 180,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLOR_DARK,
        textAlign: 'center',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLOR_DARK,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
        fontSize: 16,
        color: COLOR_DARK,
        backgroundColor: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButton: {
        flex: 1,
        backgroundColor: COLOR_DARK,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 54,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fingerprintButton: {
        width: 54,
        height: 54,
        marginLeft: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    linkText: {
        fontSize: 14,
        color: COLOR_DARK,
        fontWeight: 'bold',
    }
});

export default LoginScreen;