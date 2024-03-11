import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/AntDesign';
import Home from '../screens/Home';
import Customers from '../screens/Customers';
import Product from '../screens/Products';
import ProductCategoryScreen from '../screens/ProductManagers';
import { createStackNavigator } from "@react-navigation/stack";
import Invoice from '../screens/Invoices';
import ProductDetail from '../screens/ProductDetail';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }} // Hide the header for the "Tabs" screen
        />
        <Stack.Screen name="AddProduct" component={Product} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        {/* <Stack.Screen name="AddInvoice" component={AddInvoice} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#e91e63"
      
      inactiveColor='#F8F8FF'
      barStyle={{ 
        backgroundColor: '#0099FF',
        borderRadius:30,
     }} 
     
    >
      <Tab.Screen
        name='Home'
        component={Home}
        
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),

        }}
      />
      <Tab.Screen
        name='InvoiceManager'
        component={Invoice}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book" color={color} size={26}  />
          )
        }}
      />
      <Tab.Screen
        name='Customers'
        component={Customers}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="contacts" color={color} size={26}  />
          )
        }}
      />
      <Tab.Screen
        name='ProductManager'
        component={ProductCategoryScreen}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="CodeSandbox" color={color} size={26}  />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
 
});

export default MainNavigation;
