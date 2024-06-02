export const newUserRegister = {
    name: 'test',
    pwd: 'test123',
    postCode: '1900-094',
    email: 'test@gmail.com',
    type: 'user',
}
export const newShopkeeperRegister = {
    name: 'test2',
    pwd: 'test1234',
    postCode: '1900-099',
    email: 'test2@gmail.com',
    type: 'shopkeeper',
}

export const newUserLogin = {
    email: 'test@gmail.com',
    pwd: 'test123',
}

export const newUserTransfer = {
    receiver: 'test2@gmail.com',
    amount: 240,
}

export const externalFetchSuccess = {
    ok: true,
    json: async () => ({ data: { authorization: true } }),
}

export const externalFetchFail = {
    ok: true,
    json: async () => ({ data: { authorization: false } }),
}
