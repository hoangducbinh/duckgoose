import React, { useEffect } from 'react'
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import Tabs from './src/navigation/Tab'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { firebase } from '@react-native-firebase/app';
import LoginScreen from './src/screens/Login';
import { Provider } from 'react-native-paper';
import Stacks from './src/navigation/Stack';





const App = () => {

  return (
    
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Provider>
        <LoginScreen />
       
      </Provider>

      

    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App;
