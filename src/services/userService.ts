import { db } from "./firebase";
import { User } from "../types/user";
import { Timestamp } from "firebase-admin/firestore";

import { firestore } from "./firebase";

export async function saveOrUpdateUser(
  telegramId: string,
  username: string
): Promise<User> {
  const userRef = db.collection("users").doc(telegramId);
  const doc = await userRef.get();

  const now = Timestamp.now();

  if (!doc.exists) {
    const newUser: User = {
      telegramId,
      username,
      coins: 0,
      createdAt: now,
      lastUsed: now,
    };
    await userRef.set(newUser);
    return newUser;
  } else {
    const existingUser = doc.data() as User;
    await userRef.update({ lastUsed: now });
    return { ...existingUser, lastUsed: now };
  }
}

export async function getUser(telegramId: string): Promise<User | null> {
  const doc = await db.collection("users").doc(telegramId).get();
  return doc.exists ? (doc.data() as User) : null;
}

export async function getUserById(telegramId: string): Promise<User | null> {
  const userRef = firestore.collection("users").doc(telegramId);
  const userDoc = await userRef.get();
  return userDoc.exists ? (userDoc.data() as User) : null;
}

export async function updateUserCoins(telegramId: string, coinsToAdd: number) {
  const userRef = firestore.collection("users").doc(telegramId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const currentCoins = userDoc.data()?.coins || 0;
    await userRef.update({
      coins: currentCoins + coinsToAdd,
      lastUsed: new Date(),
    });
  }
}
