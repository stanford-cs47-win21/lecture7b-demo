import React, { useState, useEffect } from 'react';
import { Text, View, Image, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { Metrics, Images, Colors } from '../Themes';
import { material } from 'react-native-typography';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import styles from './Styles/FeedItem.styles';
import AppConfig from '../Config/AppConfig';
import firestore from '../../firebase';
import firebase from 'firebase';

export default function FeedItem({ content, onProfilePressed }) {
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // STEP 3: Correctly mark post as bookmarked or not by reading from the database
  // ---------------------------------------------------------------------------------------
  // Make sure you understand what path you need to pass in to get the correct reference 
  // for your document.
  //
  // You should only be writing 3 lines for this step. To check if it's working, bookmark a 
  // post and reload your JS. If the post is still bookmarked, then you got it!
  useEffect(() => {
    try {
      const user = firebase.auth().currentUser;
      // Add your code here
    } catch (err) {
      console.log(err);
    }
  }, [content])

  const sharedPressed = () => {
    const { urls = {} } = content;

    Share.share({message: content.description, url: urls.full})
  }

  // STEP 1: Saving a bookmark to the database
  // ---------------------------------------------
  // Make sure you understand what path you need to pass in to get the correct reference 
  // for your document. Check out how we added a user to our "users" collection
  // in LoginScreen.js to help you figure out the path, and as a reference for how you might
  // add to a collection. When creating the document for your new bookmark, notice that you 
  // have access to something called "content.id" (content refers to the post object).
  //
  // You should only be writing 2 lines for this step. To check if it's working, take a look
  // at your database in your Firebase console!
  const saveBookmark = async () => {
    setSavingBookmark(true);
    const user = firebase.auth().currentUser;
      // Add your code here

    setSavingBookmark(false);
  }

  // STEP 2: Deleting a bookmark from the database
  // ---------------------------------------------
  // Make sure you understand what path you need to pass in to get the correct reference 
  // for your document.
  //
  // You should only be writing 2 lines for this step. To check if it's working, take a look
  // at your database in your Firebase console!
  const deleteBookmark = async () => {
    setSavingBookmark(true);

    const user = firebase.auth().currentUser;
    // Add you code here

    setSavingBookmark(false);
  }

  const bookmarkPressed = async () => {
    if (savingBookmark) return; //stop if already saving

    if (!bookmarked) {
      saveBookmark();
    } else {
      deleteBookmark();
    }

    setBookmarked(!bookmarked);
  }

  const profilePressed = () => {
    if (onProfilePressed) {
      const { user = {} } = content;

      onProfilePressed(user.username);
    }
  }

  const getPostedDate = () => {
    const postedDate = new Date(content.created_at);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return postedDate.toLocaleDateString('en', options);
  }

  const showImageLoader = (width, height) => {
    if (loading) {
      return (
        <View style={[styles.mainImageLoader, {width: width, height: height}]}>
          <ActivityIndicator />
        </View>
      );
    }
  }

  const calculateImageRect = (oldWidth, oldHeight) => {
    const newWidth = Metrics.screenWidth;

    const aspectRatio = oldWidth / oldHeight;
    const newHeight = newWidth / aspectRatio;   //div width by aspect ratio

    return {width: newWidth, height: newHeight};
  }

  const { urls = {} } = content;
  const { user = {} } = content;
  const { profile_image: profileImage = {} } = user;

  const imageDim = calculateImageRect(content.width, content.height);

  return (
    <View style={styles.container}>

      <View style={styles.userContainer}>

        <TouchableOpacity onPress={profilePressed}>
          <Image style={styles.profileImage}
            source={{uri: profileImage.medium}}
            defaultSource={Images.placeholder}/>
        </TouchableOpacity>

        <TouchableOpacity style={[{flex: 1}, styles.profileName]} onPress={profilePressed}>
          <Text style={material.body2}>{user.name}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{padding:5}} onPress={bookmarkPressed}>
          <FontAwesome
            name={bookmarked ? "bookmark" : "bookmark-o"}
            size={Metrics.icons.small}
            color={Colors.steel} />
        </TouchableOpacity>
      </View>

      <View style={[styles.mainImageContainer, {width: imageDim.width, height: imageDim.height}]}>
        <Image
          style={{width: imageDim.width, height: imageDim.height}}
          resizeMode='contain'
          onLoadStart={(e) => setLoading(true)}
          onLoad={(e) => setLoading(false)}
          source={{uri: urls.full}}
        />

        {showImageLoader(imageDim.width, imageDim.height)}
      </View>

      <View style={styles.likesContainer}>

        <Entypo
          name="heart"
          size={Metrics.icons.medium}
          color={Colors.ember} />

        <Text style={[material.body1, {flex: 1, marginLeft: 5}]}>{content.likes}</Text>

        <TouchableOpacity onPress={sharedPressed}>
          <Entypo
            name="share-alternative"
            size={Metrics.icons.small}
            color={Colors.steel} />
        </TouchableOpacity>

      </View>

      <View style={styles.descContainer}>
        <Text style={material.body1}>{content.description || 'No Description'}</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={material.caption}>{getPostedDate()}</Text>
      </View>

    </View>
  );
}
