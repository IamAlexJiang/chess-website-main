import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIrsf0RYY-ikq5pBB716Tvhc_5SdgNsmk",
  authDomain: "openingmatrix.firebaseapp.com",
  projectId: "openingmatrix",
  storageBucket: "openingmatrix.appspot.com",
  messagingSenderId: "888896928324",
  appId: "1:888896928324:web:cb252514c2c107b3ff5a11",
  //measurementId: "G-JXR3WEDCSZ"
};

const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const storage = getStorage();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const getEndgamesAndDocuments = async () => {
  const collectionRef = collection(db, "endgames");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const endgamesMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return endgamesMap;
};

export const fetchOpenings = async (setData) => {
  await getDocs(collection(db, "openings")).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(newData);
  });
};

export const fetchEndgame = async (setData) => {
  await getDocs(collection(db, "endgames")).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(newData);
  });
};


//user
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUsersWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Favorites functionality
export const addToFavorites = async (userId, openingId) => {
  if (!userId) return;
  
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const favorites = userData.favorites || [];
    
    if (!favorites.includes(openingId)) {
      favorites.push(openingId);
      await setDoc(userDocRef, { ...userData, favorites }, { merge: true });
    }
  }
};

export const removeFromFavorites = async (userId, openingId) => {
  if (!userId) return;
  
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const favorites = userData.favorites || [];
    
    const updatedFavorites = favorites.filter(id => id !== openingId);
    await setDoc(userDocRef, { ...userData, favorites: updatedFavorites }, { merge: true });
  }
};

export const getUserFavorites = async (userId) => {
  if (!userId) return [];
  
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    return userData.favorites || [];
  }
  
  return [];
};
