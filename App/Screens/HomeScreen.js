import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { Metrics } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import Feed from '../Components/Feed'

export default function HomeScreen({ navigation }) {

  let onProfileRequested = (username) => {
    console.log("Requested: " + username);
    navigation.navigate('UserProfile', { username: username })
  }

  return (
    <View style={styles.container}>
      <Feed onProfileRequested={onProfileRequested} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});