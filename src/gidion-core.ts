import axios from 'axios';

export async function callGidionAPI(url: string, payload: any) {
  const res = await axios.post(url, payload);
  return res.data;
}
