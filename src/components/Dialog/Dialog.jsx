import React from 'react';
import { Dialog, ScrollView, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';

const DialogComponent = ({ visible, onDismiss, onSelect, options }) => {
    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Select an Option</Dialog.Title>
            <Dialog.Content>
                <ScrollView>
                    {/* Danh sách các mục */}
                    {options.map((option, index) => (
                        <TouchableOpacity key={index} onPress={() => onSelect(option)}>
                            <Text style={styles.dialogItem}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    dialogItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 16,
        color: '#333',
    },
});

export default DialogComponent;
