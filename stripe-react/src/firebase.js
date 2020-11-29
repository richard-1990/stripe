import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyBNz3Eca3su7PwL47r9B2pXY8-FcqQi7aY',
  authDomain: 'stripe-ba5bb.firebaseapp.com',
  databaseURL: 'https://stripe-ba5bb.firebaseio.com',
  projectId: 'stripe-ba5bb',
  storageBucket: 'stripe-ba5bb.appspot.com',
  messagingSenderId: '200964393970',
  appId: '1:200964393970:web:e168b051a86cfa0141396b',
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
