import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';

const DropdownWithSearch = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  const handleSearch = text => {
    setSearchTerm(text);
    const filtered = options.filter(option =>
      option.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = option => {
    onSelect(option);
    setSelectedOption(option);
    toggleDialog();
    setSearchTerm('');
    setFilteredOptions(options);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDialog} activeOpacity={0.7}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownHeaderText}>{selectedOption || 'Select an option'}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={dialogVisible}
        onRequestClose={() => {
          toggleDialog();
        }}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select an Option</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search..."
                value={searchTerm}
                onChangeText={handleSearch}
              />
              <IconButton
                icon="magnify"
                color="#007bff"
                size={24}
                onPress={() => console.log('Search pressed')}
              />
            </View>
            {filteredOptions.map((item, index) => {
              if (index <5) {
                return (
                  <TouchableOpacity key={index} onPress={() => handleSelect(item)} activeOpacity={0.7}>
                    <View style={styles.optionItem}>
                      <Text style={styles.optionText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
            <TouchableOpacity onPress={toggleDialog} style={styles.closeButton}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
   
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    color: '#007bff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center'
  }
});

export default DropdownWithSearch;
