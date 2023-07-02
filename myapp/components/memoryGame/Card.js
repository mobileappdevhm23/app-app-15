import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

export default function Card({ src, name, color, is_open, clickCard }) {
  return (
    <TouchableOpacity onPress={clickCard}>
      <View style={[styles.card, { backgroundColor: color }]}>
        {is_open ? (
          <Image source={src} style={styles.image} />
        ) : (
          <Image source={require('myapp/assets/Closed.jpg')} style={styles.closedImage} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 95,
    height: 140,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedImage: {
    width: 85,
    height: 140,
    borderRadius: 18,
  },
  image: {
    width: 85,
    height: 140,
    borderRadius: 18,
  },
});
