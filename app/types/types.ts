import { ObjectId } from "@fastify/mongodb";

export type User = {
  name: string;
  pwd: string;
  email?: string;
  postCode?: string;
  type?: string;
  balance?: number
};

export type TokenPayload = {
  email: string;
  type: string;
}

export type Transfer = {
  _id: ObjectId
  sender: string;
  receiver: string;
  amount: number;
  date: string;
}

export enum UserType {
  USER = "user",
  SHOPKEEPER = "shopkeeper"
}
