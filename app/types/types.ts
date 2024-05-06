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
  sender: string;
  receiver: string;
  amount: number;
  date: string;
}

export enum UserType {
  USER = "user",
  SHOPKEEPER = "shopkeeper"
}
