import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, KeyboardAvoidingView, Alert, StatusBar } from 'react-native';
import { material } from 'react-native-typography';
import { useHeaderHeight } from '@react-navigation/stack'
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
import firestore from '../../firebase';

export default function RoomMessages({navigation, route}) {
  const KEYBOARD_VERTICAL_OFFSET = useHeaderHeight() + StatusBar.currentHeight;
  const [text, setText] = useState('')
  const [messagesList, setMessagesList] = useState([])
  const [name, setName] = useState('')
  let unsubscribe = () => null

  const proceedWithName = async (name) => {
    setName(name)
    //When a user enters a name, we start listening to messages
    let messagesRef = firestore.collection(`rooms/${route.params.key}/messages`)
    unsubscribe = messagesRef.onSnapshot((docs) => {
      let new_messages = []
      docs.forEach((doc) => {
        let temp = doc.data()
        new_messages.push(temp)
      });
      setMessagesList(new_messages)
    });

  }

  const getUserName = () => {
    //This is iOS only! It prompts the user to enter a name once they open the room
    Alert.prompt(
      'Enter name',
      'Enter your name for this channel',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (name) => name.length === 0 ? getUserName() : proceedWithName(name),
        },
      ]
    );
  }

  useEffect(() => {
    //Prompts the user to enter their name
    getUserName()
    return () => {
      //On unmount, stop listening
      unsubscribe();
    }
  }, [])

  const send = async () => {
    //Send by updating the room's messages list
    let messagesCollection = firestore.collection(`rooms/${route.params.key}/messages`)
    messagesCollection.add({
      sender: name,
      message: text
    })
    setText('')
    
    //STEP 4 (Optional):
     /*
       We will go over this as a class in a bit, but if you can't wait, we are not going to hold
       you. We want to update the count of messages for this room. You might think, well, grab
       the count, add one, and send it back. Most likely in-class it'll work, but you are building
       an app to be usable by millions. What if 2 users grabbed the same number of counts, and they
       changed the count at very close times? Your count will be wrong :'(. Transactions is
       how Firebase deals with this issue (aka concurrency). Look into it, and see if you can
       figure it out. It's pretty straightforward
      */
    let roomDocRef = firestore.doc(`rooms/${route.params.key}`)
    try {
      await firestore.runTransaction(async (t) => {
        const doc = await t.get(roomDocRef);
        const newMessagesCount = doc.data().count + 1;
        t.update(roomDocRef, {count: newMessagesCount});
      });
    
      console.log('Transaction success!');
    } catch (e) {
      console.log('Transaction failure:', e);
    }
  }

  const _renderItem = ({item}) => {
    //Style to make the messages be on the left or right side based on the sender
    const additionalStyle = item.sender === name ? {justifyContent: 'flex-end', marginRight: Metrics.doubleBaseMargin, marginLeft: Metrics.doubleBaseMargin*2}
                                                            : {justifyContent: 'flex-start', marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin*2};

    return (
      <View style={[{flexDirection: 'row', marginTop: Metrics.marginVertical},additionalStyle]}>
        <View style={{flexDirection: 'column'}}>
          <Text> {item.sender} </Text>
          <View style={styles.chatBubble}>
            <Text style={[material.subheading,{color: Colors.silver}]}> {item.message} </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
         style={{ flex: 1 }}
         keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
         behavior="padding">
      <FlatList
        data={messagesList}
        renderItem={_renderItem}
        style={styles.container}
        keyExtractor={(item, index) => index.toString()}
        />
      <View style={styles.sendChatContainer}>
        <TextInput
          style={styles.newRoom}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="Be part of the conversation..."/>
        <Button
          title="Send"
          onPress={send}/>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sendChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderTopWidth: Metrics.horizontalLineHeight,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical
  },
  newRoom: {
    borderBottomWidth: Metrics.horizontalLineHeight,
    flex: 1,
    borderBottomColor: Colors.border,
    marginRight: Metrics.marginHorizontal
  },
  chatBubble: {
    paddingLeft: Metrics.marginVertical,
    paddingRight: Metrics.marginVertical,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    borderRadius: Metrics.marginVertical,
    backgroundColor: Colors.bloodOrange
  }
});
