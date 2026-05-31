import axios from "axios";
export async function healthcheck() {
    try {
        await axios.get("http://localhost:11434");
        return true;
    }
    catch {
        return false;
    }
}
