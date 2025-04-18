// src/firebase.ts

import { initializeApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyC26ImSIxkKh4GBYzbg0giwmdxWb-CtRmg",
    authDomain: "neotrition-cca14.firebaseapp.com",
    databaseURL: "https://neotrition-cca14-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "neotrition-cca14",
    storageBucket: "neotrition-cca14.firebasestorage.app",
    messagingSenderId: "1057237524855",
    appId: "1:1057237524855:web:33f231f52bc6834a324172",
    measurementId: "G-5PKCCXFTGK"
};



const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { app, db }
