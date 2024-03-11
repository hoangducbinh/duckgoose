import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import DropdownWithSearch from '../components/dropdown/DropdownWithSearch';

const Invoice = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    quantity: '1',
  });
  const [total, setTotal] = useState(0);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [note, setNote] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const snapshot = await database().ref('customers').once('value');
      const data = snapshot.val();
      if (data) {
        setCustomers(Object.values(data));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const snapshot = await database().ref('products').once('value');
      const data = snapshot.val();
      if (data) {
        setAvailableProducts(Object.values(data));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerModalVisible(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedProductPrice(product.price.toString());
    setNewProduct({
      productId: product.id, // Assuming each product has a unique ID
      quantity: '1',
    });
    setProductModalVisible(false);
  };

  const addProduct = () => {
    if (!selectedProduct || !newProduct.productId.trim() || !selectedProductPrice.trim()) {
      Alert.alert('Error', 'Please select a product and enter its price.');
      return;
    }

    const existingProductIndex = products.findIndex(product => product.productId === newProduct.productId);
    if (existingProductIndex !== -1) {
      // Sản phẩm đã tồn tại, tăng số lượng
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += parseInt(newProduct.quantity);
      setProducts(updatedProducts);
      calculateTotal(updatedProducts); // Tính toán lại tổng cho danh sách sản phẩm đã cập nhật
    } else {
      // Sản phẩm chưa tồn tại, thêm mới vào danh sách
      const product = {
        productId: newProduct.productId,
        name: selectedProduct.productName, // Lưu tên sản phẩm
        quantity: parseInt(newProduct.quantity),
        price: parseFloat(selectedProductPrice),

      };

      setProducts([...products, product]);
      calculateTotal([...products, product]); // Tính toán lại tổng cho danh sách sản phẩm mới
    }

    setNewProduct({ productId: '', quantity: '1' });
    setSelectedProduct(null);
    setSelectedProductPrice('');
  };


  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.productId !== productId);
    setProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };

  const calculateTotal = (products) => {
    const totalAmount = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  const resetInvoice = () => {
    setProducts([]);
    setTotal(0);
    setNote('');
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setSelectedProductPrice('');
  };


  const saveInvoice = async () => {
    if (!selectedCustomer || products.length === 0) {
      Alert.alert('Error', 'Please select a customer and add products to the invoice.');
      return;
    }

    const invoiceData = {
      customerId: selectedCustomer.id, // Assuming each customer has a unique ID
      products: products,
      total: total,
      note: note,
    };

    try {
      await database().ref('invoices').push(invoiceData);
      Alert.alert('Invoice Saved', 'Invoice has been saved successfully.');
      resetInvoice(); // Làm mới thông tin sau khi lưu hóa đơn thành công
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert('Error', 'Failed to save the invoice. Please try again later.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetail}>Price: {item.price} VND</Text>
      <Text style={styles.productDetail}>Quantity: {item.quantity}</Text>
      <Text style={styles.productDetail}>Subtotal: {item.price * item.quantity} VND</Text>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item.productId)}>
          <Icon name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );



  const formatCurrency = (amount) => {
    const reversed = amount.toString().split('').reverse().join('');
    const formatted = reversed.replace(/(\d{3})(?=\d)/g, '$1,');
    return formatted.split('').reverse().join('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.customerInfoContainer}>
        <Text style={styles.header}>Customer Information</Text>
        <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setCustomerModalVisible(true)}>
          <Text>{selectedCustomer ? selectedCustomer.name : 'Select Customer'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={selectedCustomer ? selectedCustomer.address : ''}
          onChangeText={(text) => setNewProduct({ address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={selectedCustomer ? selectedCustomer.phoneNumber : ''}
          onChangeText={(text) => setNewProduct({ phoneNumber: text })}
          keyboardType="numeric"
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={customerModalVisible}
        onRequestClose={() => setCustomerModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Customer</Text>
            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              placeholder="Search"
              value={searchKeyword}
              onChangeText={(text) => setSearchKeyword(text)}
            />
            <FlatList
              data={customers.filter((customer) =>
                customer.name.toLowerCase().includes(searchKeyword.toLowerCase())
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => handleSelectCustomer(item)}
                >
                  <Text style={styles.customerName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setCustomerModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={productModalVisible}
        onRequestClose={() => setProductModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Product</Text>
            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              placeholder="Search"
              value={searchKeyword}
              onChangeText={(text) => setSearchKeyword(text)}
            />
            <FlatList
              data={availableProducts.filter((product) =>
                product.productName.toLowerCase().includes(searchKeyword.toLowerCase())
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productItem}
                  onPress={() => handleSelectProduct(item)}
                >
                  <Text style={styles.productName}>{item.productName}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setProductModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.invoiceContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Invoice Creator</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.input, { flex: 2, marginRight: 10, alignItems: 'center', justifyContent: 'center' }]}
            onPress={() => setProductModalVisible(true)}
          >
            <Text>
              {selectedProduct ? selectedProduct.productName : newProduct.name || 'Select Product'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            placeholder="Price"
            value={(selectedProductPrice !== null && selectedProductPrice !== undefined) ? selectedProductPrice : ''}
            onChangeText={(text) => setSelectedProductPrice(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10, }]}
            placeholder="Quantity"
            value={newProduct.quantity}
            onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.addButton} onPress={addProduct}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId.toString()}

        />
        <Text style={styles.total}>Total: {formatCurrency(total)} VND</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveInvoice}>
          <Text style={styles.saveButtonText}>Save Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#ffff'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  noteInput: {
    height: 70,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  customerInfoContainer: {
    marginBottom: 20,
  },
  invoiceContainer: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,

  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    height: 41
  },
  productItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,

  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 16,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 5,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop:30
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  customerItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerDetail: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  cancelButton: {
    color: '#007bff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Invoice;
