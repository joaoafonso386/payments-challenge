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

export enum UserType {
  USER = "user",
  SHOPKEEPER = "shopkeeper"
}