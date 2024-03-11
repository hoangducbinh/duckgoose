import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Tabs from '../navigation/Tab';
import Stacks from '../navigation/Stack';
import MainNavigation from '../navigation/Tab';




const LoginScreen = () => {
    const [email, setEmail] = useState('binh@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loggedIn,setLoggedIn] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            setLoggedIn(true)
            console.log('Đăng nhập thành công:', user.uid);
        } catch (error) {
            console.error('Đăng nhập thất bại:', error.message);
        }
    };
 
    if (loggedIn)
    {
        return (
            <>
                <MainNavigation/>
                
            </>
        );
    }
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button
                title="Đăng nhập"
                onPress={handleLogin}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default LoginScreen;
