import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Dialog, Button } from 'react-native-paper';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import DropdownWithSearch from '../components/dropdown/DropdownWithSearch';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';


const Product = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newProduct, setNewProduct] = useState({
        productName: '',
        category: '',
        quantity: '',
        importPrice: '',
        price: '',
        importDate: new Date().toLocaleDateString(),
    });
    

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const snapshot = await firebase.database().ref('categories').once('value');
                const data = snapshot.val();
                if (data) {
                    setCategories(Object.values(data));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const addCategoryToFirebase = async () => {
        try {
            if (!newCategory.trim()) {
                showAlertEmptyCategory();
                return;
            }
            // Kiểm tra xem loại sản phẩm đã tồn tại trong cơ sở dữ liệu Firebase hay không
            const categorySnapshot = await firebase.database().ref('categories').orderByChild('name').equalTo(newCategory).once('value');
            if (categorySnapshot.exists()) {
                showAlert('Duplicate Category', 'This category already exists. Please enter a different category name.');
                return;
            }
            const newCategoryRef = await database().ref('/categories').push(); // Generate a unique ID
            const categoryId = newCategoryRef.key; // Get the generated ID
            await newCategoryRef.set({ // Set category data along with ID
                id: categoryId,
                name: newCategory,
                products: [],
            });
            console.log('New category added successfully');
            showAlert('Success', 'New category added successfully');
            setNewCategory('');
    
            const updatedCategories = [...categories, { id: categoryId, name: newCategory, products: [] }]; // Include the ID in the updated categories array
            setCategories(updatedCategories);
            Keyboard.dismiss(); // Hide the keyboard after successful addition
        } catch (error) {
            console.error('Error adding new category:', error);
            showAlert('Error', 'Error adding new category');
        }
    };
    
    const showAlertEmptyCategory = () => {
        Alert.alert(
            'Empty Category',
            'Please enter a category name.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    };
    
    const showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: true } // Cho phép hộp thoại bị hủy khi nhấn ra bên ngoài
            
        );
    };

    const handleAddCategory = () => {
        addCategoryToFirebase();
    };


    const addProductToFirebase = () => {
        if (
            newProduct.productName.trim() === '' ||
            newProduct.category.trim() === '' ||
            newProduct.quantity.trim() === '' ||
            newProduct.importPrice.trim() === '' ||
            newProduct.price.trim() === '' ||
            newProduct.importDate.trim() === ''
        ) {
            setDialogVisible(true);
            return;
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong danh mục hay chưa
        const categoryIndex = categories.findIndex(category => category.name === newProduct.category);
        if (categoryIndex === -1) {
            showAlert('Category Not Found', 'Please select a valid category.');
            return;
        }

        const category = categories[categoryIndex];
        const isProductExist = category.products.some(product => product.productName === newProduct.productName);
        if (isProductExist) {
            showAlert('Duplicate Product', 'This product already exists in the selected category.');
            return;
        }

        // Thêm giá trị vào cơ sở dữ liệu
        const newProductRef = database().ref('/products').push(); // Tạo một tham chiếu mới cho sản phẩm
        const productId = newProductRef.key; // Lấy ID của sản phẩm tự sinh
        const formattedPrice = newProduct.price.replace(/[,.]/g, ''); // Xóa dấu phẩy và dấu chấm
        const formattedImportPrice = newProduct.importPrice.replace(/[,.]/g, ''); // Xóa dấu phẩy và dấu chấm
        const newProductData = {
            id: productId,
            ...newProduct,
            price: formattedPrice,
            importPrice: formattedImportPrice,
        };

        newProductRef.set(newProductData)
        .then(() => {
            console.log('New product added successfully');
            showAlert('Success', 'New product added successfully');
            setNewProduct({
                productName: '',
                category: '',
                quantity: '',
                importPrice: '',
                price: '',
                importDate: new Date().toLocaleDateString(),
            });

            // Update the corresponding category's products array in local state
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex] = {
                ...category,
                products: [...category.products, newProductData],
            };
            setCategories(updatedCategories);

            // Update the corresponding category's products array in Firebase Realtime Database
            // const categoryRef = database().ref(`/categories/${category.id}`);
            // categoryRef.update({
            //     products: [...category.products, newProductData],
            // });
        })
        .catch(error => {
            console.error('Error adding new product:', error);
            showAlert('Error', 'Error adding new product');
            Keyboard.dismiss(); // Ẩn bàn phím sau khi thêm thành công
        });
    };

    const handleAddProduct = () => {
        addProductToFirebase();
    };

    const handleDateChange = (event, selected) => {
        const currentDate = selected || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        setNewProduct({ ...newProduct, importDate: currentDate.toLocaleDateString() });
    };

    const handleDialogClose = () => {
        setDialogVisible(false);
    };

    const dialogContentMissing = (
        <Dialog visible={dialogVisible} onDismiss={handleDialogClose}>
            <Dialog.Title>Missing Information</Dialog.Title>
            <Dialog.Content>
                <Text>Please fill in all fields.</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleDialogClose}>OK</Button>
            </Dialog.Actions>
        </Dialog>
    );

    // Tạo một hàm để định dạng giá trị có dấu phẩy và dấu chấm phân cách
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.header}>Product Manager</Text>
                    
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Add Category</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Category Name"
                                onChangeText={setNewCategory}
                                value={newCategory}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                                <Icon name="add" size={24} color="#ffff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Add Product</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Product Name"
                                onChangeText={(text) => setNewProduct({ ...newProduct, productName: text })}
                                value={newProduct.productName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Quantity"
                                onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
                                value={newProduct.quantity}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Import Price"
                                onChangeText={(text) => {
                                    const formattedPrice = formatPrice(text.replace(/[,.]/g, ''));
                                    setNewProduct({ ...newProduct, importPrice: formattedPrice });
                                }}
                                value={newProduct.importPrice}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Price"
                                onChangeText={(text) => {
                                    const formattedPrice = formatPrice(text.replace(/[,.]/g, ''));
                                    setNewProduct({ ...newProduct, price: formattedPrice });
                                }}
                                value={newProduct.price}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                                <Text style={styles.datePickerButtonText}>{newProduct.importDate}</Text>
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
                        <View style={styles.inputContainer}>
                        <DropdownWithSearch 
                            options={categories.map(category => category.name)}
                            onSelect={(selectedType) => setNewProduct({ ...newProduct, category: selectedType })}
                        />
                        </View>
                        
                        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
                            <Text style={styles.buttonText}>Add Product</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {dialogContentMissing}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#007bff',
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333333',
    },
    addButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default Product;
