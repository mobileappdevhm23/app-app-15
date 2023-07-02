import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import sights from './components/Sights';
import food from './components/Food';
import history from './components/History';
import monsterStory from './components/stories/monsterStory';
import HomeScreen from './components/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Sights" component={sights} />
        <Stack.Screen name="Food" component={food} />
        <Stack.Screen name="History" component={history} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}