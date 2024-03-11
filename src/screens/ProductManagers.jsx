import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProductDetail from './ProductDetail';


const Drawer = createDrawerNavigator();

const ProductCategoryScreen = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [drawerItemSelected, setDrawerItemSelected] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const snapshot = await database().ref('categories').once('value');
            const data = snapshot.val();
            if (data) setCategories(Object.values(data));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProductsByCategory = async (categoryName) => {
        try {
            const snapshot = await database().ref('products').orderByChild('category').equalTo(categoryName).once('value');
            const data = snapshot.val();
            if (data) setProducts(Object.values(data)); // Thêm setProducts vào đây
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCategoryPress = async (categoryName) => {
        setSelectedCategory(categoryName);
        await fetchProductsByCategory(categoryName);
        setDrawerItemSelected(true);
    };

    const navigation = useNavigation();

    return (
        <Drawer.Navigator
            drawerContent={() => (
                <View style={styles.drawerContainer}>
                    <Text style={styles.drawerHeader}>Categories</Text>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.categoryItem}
                                onPress={() => {
                                    handleCategoryPress(item.name);
                                    navigation.dispatch(DrawerActions.closeDrawer());
                                }}
                            >
                                <Text style={styles.categoryText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.categoryList}
                    />
                </View>
            )}
        >
            <Drawer.Screen name="Products">
                {(props) => <ProductsScreen {...props}
                    products={products}
                    drawerItemSelected={drawerItemSelected}
                    selectedCategory={selectedCategory}
                    setProducts={setProducts} />}
            </Drawer.Screen>

        </Drawer.Navigator>
    );
};


const ProductsScreen = ({ products, drawerItemSelected, selectedCategory, setProducts }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (!drawerItemSelected) {
            fetchAllProducts();
        } else {
            fetchProductsByCategory(selectedCategory);
        }
    }, [drawerItemSelected, selectedCategory]);

    const fetchAllProducts = async () => {
        try {
            const snapshot = await database().ref('products').once('value');
            const data = snapshot.val();
            if (data) setProducts(Object.values(data));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchProductsByCategory = async (categoryName) => {
        try {
            const snapshot = await database().ref('products').orderByChild('category').equalTo(categoryName).once('value');
            const data = snapshot.val();
            if (data) setProducts(Object.values(data));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const searchProducts = async (text) => {
        setSearchTerm(text);
        try {
            const snapshot = await database().ref('products').orderByChild('productName').startAt(text).endAt(text + '\uf8ff').once('value');
            const data = snapshot.val();
            if (data) setSearchResults(Object.values(data));
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Products Manager</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Products"
                        value={searchTerm}
                        onChangeText={searchProducts}
                    />
                    <TouchableOpacity style={styles.searchButton}>
                        <Icon name="search" size={24} color="#ffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct')}>
                        <Icon name="add" size={24} color="#ffff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.productContainer}>
                <Text style={styles.subHeader}>Products</Text>
                <FlatList
                    data={searchTerm ? searchResults : products}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.productPrice}>Price: {item.price} đồng</Text>
                                <Text style={styles.productPrice}>Quantity: {item.quantity}</Text>
                                <Text style={styles.productPrice}>Import Price: {item.importPrice} đồng</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={24} color="#666666" />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.productList}
                />
            </View>
            {showAlert && (
                <View style={styles.alert}>
                    <Text style={styles.alertText}>Product updated successfully!</Text>
                    <Button title="OK" onPress={() => setShowAlert(false)} />
                </View>
            )}
        </View>
    );
};




const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { paddingTop: 40, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#ffffff' },
    header: { fontSize: 24, fontWeight: 'bold', color: '#007bff', textAlign: 'center' },
    subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#007bff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#007bff', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff', color: '#000' },
    searchButton: { backgroundColor: '#007bff', borderRadius: 8, padding: 10 },
    addButton: { backgroundColor: '#007bff', borderRadius: 8, padding: 10, marginLeft: 10 },
    productContainer: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
    productItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productDetails: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    productPrice: { fontSize: 14, color: '#666666' },
    productList: { flexGrow: 1 },
    alert: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    alertText: { fontSize: 16, fontWeight: 'bold' },

    drawerContainer: { flex: 1, backgroundColor: '#ffffff', paddingTop: 40, paddingHorizontal: 20 },
    drawerHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#007bff' },
    categoryList: { flexGrow: 1 },
    categoryItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc' },
    categoryText: { fontSize: 16, color: '#007bff' },
});

export default ProductCategoryScreen;
