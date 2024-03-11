import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';

const EditProductScreen = ({ route, navigation }) => {
    const { products } = route.params;
    const [productName, setProductName] = useState(products.productName);
    const [price, setPrice] = useState(products.price);

    const handleUpdateProduct = async () => {
        try {
            await database().ref(`products/${products.uid}`).update({
                productName,
                price
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await database().ref(`products/${products.uid}`).remove();
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
                style={styles.input}
                value={productName}
                onChangeText={setProductName}
            />
            <Text style={styles.label}>Price</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <Button title="Update Product" onPress={handleUpdateProduct} />
            <Button title="Delete Product" onPress={handleDeleteProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default EditProductScreen;
