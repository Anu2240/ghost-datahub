import { Timestamp } from "firebase-admin/firestore";

export interface User {
  telegramId: string;
  username: string;
  coins: number;
  createdAt: Timestamp;
  lastUsed: Timestamp;
}
