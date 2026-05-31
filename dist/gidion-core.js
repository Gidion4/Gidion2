import axios from 'axios';
export async function callGidionAPI(url, payload) {
    const res = await axios.post(url, payload);
    return res.data;
}
