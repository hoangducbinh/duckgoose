import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import Home from '../screens/Home';
import Customers from '../screens/Customers';

import InvoiceManager from '../screens/Invoices';
import Product from '../screens/Products';

import ProductCategoryScreen from '../screens/ProductManagers';
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from './Tab';


const Tab = createMaterialBottomTabNavigator();



const Stack = createStackNavigator();



const MainNavigation =()=>
{
  return(
    <NavigationContainer>
            <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs}/>
        <Stack.Screen name="AddProduct" component={Product} />
    </Stack.Navigator>
    </NavigationContainer>
    
  )
}


