import { initializeApp } from "firebase/app";
import { getFirestore , collection} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAQk4EBsd8hKFcE00xQOr34HHVCX2YhI6I",
  authDomain: "notes-f64fa.firebaseapp.com",
  projectId: "notes-f64fa",
  storageBucket: "notes-f64fa.appspot.com",
  messagingSenderId: "791054582691",
  appId: "1:791054582691:web:6cf680fa6b45c747541016"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")