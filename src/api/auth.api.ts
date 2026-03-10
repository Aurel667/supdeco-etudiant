import client from "../config/api-client.config";

export async function apiLogin(payload: object){
    const {data} = await client.post("/login", payload)
    return data
}

export async function apiLogout() {
    const {data} = await client.post('/logout')
    return data
}

export const apiMe = async () => {
  const { data } = await client.get('/user');
  return data;
};

