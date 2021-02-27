import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { getPhotosForUser } from '../API/Unsplash.js';
import { material } from 'react-native-typography';
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import Feed from '../Components/Feed'

export default function UserProfileScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if(!navigation) return;
    const params = route.params || {};
    const username = params.username;


    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const loadUserContent = async (username) => {
      setLoading(true);
      await sleep(500);
      getPhotosForUser(json => {
        console.log(json);
        setLoading(false);
        setContent(json);
  
        if (json[0]){
          setUser(json[0].user);
        }
      }, username);
    }

    loadUserContent(username);

  }, [navigation, route.params])

  let getUserContent = () => {
    // if (!user.id) return null;

    return (
      <View style={styles.userContainer}>
        <Text style={material.display1}>{user.name}</Text>
        <Text style={material.body1}>{user.bio || 'No Bio'}</Text>
        <Text style={material.caption}>{user.location || 'No Location'}</Text>
      </View>
    );
  }

  let getFeedContent = () => {

    if (!user) {
      return (
        <ActivityIndicator />
      );
    } else {
      return (
        <Feed content={content} listHeaderComponent={getUserContent()}/>
      );
    }
  }

  return (
    <View style={styles.container}>

      {getFeedContent()}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.snow,
  },
  userContainer: {
    flexDirection: 'column',
    padding: Metrics.doubleBaseMargin,
  }
});