import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;
    const [editedProduct, setEditedProduct] = useState(product);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigation = useNavigation();

    const handleSaveChanges = async () => {
        try {
            await database().ref(`products/${editedProduct.id}`).update(editedProduct);
            console.log('Product updated successfully!');
            Alert.alert('Success', 'Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product. Please try again later.');
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await database().ref(`products/${editedProduct.id}`).remove();
            console.log('Product deleted successfully!');
            Alert.alert('Success', 'Product deleted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product. Please try again later.');
        }
    };
    
    const handleDateChange = (event, selected) => {
        const currentDate = selected || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        setEditedProduct({ ...editedProduct, importDate: currentDate.toLocaleDateString() });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product Detail</Text>
            {renderInputField('Name', editedProduct.productName, (text) => setEditedProduct({ ...editedProduct, productName: text }))}
            {renderInputField('Price', editedProduct.price.toString(), (text) => setEditedProduct({ ...editedProduct, price: parseFloat(text) }), 'numeric')}
            {renderInputField('Quantity', editedProduct.quantity.toString(), (text) => setEditedProduct({ ...editedProduct, quantity: parseFloat(text) }), 'numeric')}
            {renderInputField('Import Price', editedProduct.importPrice.toString(), (text) => setEditedProduct({ ...editedProduct, importPrice: parseFloat(text) }), 'numeric')}
            {renderDatePicker('Import Date', editedProduct.importDate, showDatePicker, selectedDate, handleDateChange, setShowDatePicker)}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteProduct} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const renderInputField = (label, value, onChangeText, keyboardType = 'default') => (
    <View style={styles.inputField}>
        <Text>{label}:</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
        />
    </View>
);

const renderDatePicker = (label, value, showDatePicker, selectedDate, handleDateChange, setShowDatePicker) => (
    <View style={styles.inputField}>
        <Text>{label}:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>{value}</Text>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
            />
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputField: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333333',
    },
    datePickerButton: {
        height: 50,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    datePickerButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetail;
