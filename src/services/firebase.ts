import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// 🔥 Create firestore reference
const firestore = admin.firestore();

// 🔥 Export both db and firestore (for compatibility)
export const db = firestore;
export { firestore };

// Optionally export admin if needed elsewhere
export default admin;
