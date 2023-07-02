import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Score = ({ score }) => {
  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 70,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Score;
