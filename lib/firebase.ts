import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA2o8XRt_K5QFSIU3hqcsraiBDBhIw2r6c",
  authDomain: "hethongrenluyenwomanacademy.firebaseapp.com",
  databaseURL: "https://hethongrenluyenwomanacademy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hethongrenluyenwomanacademy",
  storageBucket: "hethongrenluyenwomanacademy.appspot.com",
  messagingSenderId: "961977680525",
  appId: "1:961977680525:web:9a1ac982617bdc289918c4",
  measurementId: "G-SC30MV1DN8",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
