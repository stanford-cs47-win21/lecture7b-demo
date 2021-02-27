import React, { useState, useEffect } from 'react';
import AppNavigation from './App/Navigation/AppNavigation';
import LoginScreen from './App/Screens/LoginScreen';
import firebase from 'firebase';
import "firebase/auth"

export default function App() {
  return <AppNavigation />;
}
