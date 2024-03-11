import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        storeName: '',
        note: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCustomers(); // Initial fetch when component mounts
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

    const addCustomerToFirebase = async () => {
        try {
            if (!newCustomer.name.trim()) {
                alert('Please enter customer name.');
                return;
            }

            const customerId = database().ref().child('customers').push().key; // Tạo một khóa duy nhất
            const customerWithId = { id: customerId, ...newCustomer }; // Thêm khóa id vào dữ liệu khách hàng mới

            await database().ref(`/customers/${customerId}`).set(customerWithId); // Thêm khách hàng mới vào cơ sở dữ liệu
            console.log('New customer added successfully');
            setNewCustomer({
                name: '',
                address: '',
                phoneNumber: '',
                storeName: '',
                note: '',
            });

            setModalVisible(false); // Đóng modal sau khi thêm khách hàng
            fetchCustomers(); // Lấy danh sách khách hàng cập nhật sau khi thêm một khách hàng mới
        } catch (error) {
            console.error('Error adding new customer:', error);
        }
    };

    const filteredCustomers = customers.filter(
        customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCustomer = (customer) => {
        // Xử lý sự kiện sửa khách hàng ở đây
    };

    const handleDeleteCustomer = (customer) => {
        // Xử lý sự kiện xóa khách hàng ở đây
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Customers Manager</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search customer"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={styles.searchButton}>
                        <Icon name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Icon name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredCustomers}
                renderItem={({ item }) => (
                    <View style={styles.customerItem}>
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{item.name}</Text>
                            <Text style={styles.customerDetail}>Address: {item.address}</Text>
                            <Text style={styles.customerDetail}>Phone Number: {item.phoneNumber}</Text>
                            <Text style={styles.customerDetail}>Store Name: {item.storeName}</Text>
                            <Text style={styles.customerDetail}>Note: {item.note}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEditCustomer(item)}>
                                <Icon name="pencil" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCustomer(item)}>
                                <Icon name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Add Customer</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Customer Name"
                            value={newCustomer.name}
                            onChangeText={text => setNewCustomer({ ...newCustomer, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={newCustomer.address}
                            onChangeText={text => setNewCustomer({ ...newCustomer, address: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={newCustomer.phoneNumber}
                            onChangeText={text => setNewCustomer({ ...newCustomer, phoneNumber: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Store Name"
                            value={newCustomer.storeName}
                            onChangeText={text => setNewCustomer({ ...newCustomer, storeName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Note"
                            value={newCustomer.note}
                            onChangeText={text => setNewCustomer({ ...newCustomer, note: text })}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addCustomerToFirebase}>
                            <Text style={styles.buttonText}>Add Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    headerContainer: {
        paddingTop: 40,
        paddingBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        color: '#000',
    },
    searchButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007bff',
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    customerDetail: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
       
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#007bff',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        color: '#000',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        color: '#007bff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    closeButton: {
        marginTop: 16,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        borderRadius: 8,
        padding: 10,
    },
});

export default Customers;
