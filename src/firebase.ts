import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// Simple connection test check
export async function testFirestoreConnection() {
  try {
    const { getDocFromServer, doc } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // We only log if it's genuinely an offline/config error, others (like Permission Denied) are expected without rules for 'test'
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore appears to be offline. Please verify your internet connection or Firebase settings.");
    }
  }
}
