import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import sights from './Sights';
import food from './Food';
import history from './History';
import monsterStory from './stories/monsterStory';

type RootStackParamList = {
  Home: undefined;
  'Sights': undefined;
  'Food': undefined;
  'History': undefined;
  "monsterStory": undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const BUTTONS: { title: keyof RootStackParamList; slug: string; color: string}[] = [
  { title: 'Sights', slug: 'sights', color: '#B49292' },
  { title: 'Food', slug: 'food', color: '#B49292' },
  { title: 'History', slug: 'history', color: '#B49292' },
];


export default function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const handleNavigation = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../assets/munichskyline.jpg')}
          style={styles.banner}
          resizeMode="contain"
        />
        <Text style={styles.text}>MEMORY GAME</Text>
      </View>
      <View style={styles.buttonContainer}>
        {BUTTONS.map((button, index) => (
          <TouchableOpacity key={index} onPress={() => handleNavigation(button.title)}>
            <Text style={[styles.button, { backgroundColor: button.color }]}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
    marginTop: 20,
  },
  banner: {
    width: 300,
    height: 300,
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: -40,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    top: 50,
    alignItems: 'center',
  },
  button: {
    width: 300,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
    padding: 25,
    borderRadius: 18,
    overflow: 'hidden',
  },
});