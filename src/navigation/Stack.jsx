
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Product from '../screens/Products';

const Stack = createStackNavigator();



const Stacks = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AddProduct" component={Product} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}


export default Stacks;