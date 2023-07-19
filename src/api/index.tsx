import axios from 'axios';
const prodURL: string = "https://tictactoe-api-dfux.onrender.com/api/v1";

//const baseURL: string = "http://localhost:8080/api/v1";
const JWT = localStorage.getItem("JWT");

const api_url = axios.create({
    baseURL: prodURL,
    headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + JWT
    }
})

export const getResults = async (setlist : any) => {
    try {
        const results = await api_url.get('/results');
        if(results.status!==200){
            setlist(null);
        }
        setlist(results.data);
    } catch (err: any) {
        console.log(err.message);
        setlist(null);
    }
}

export const createAuth = async (players: Object) =>{
    try {
        const res = await api_url.post('/auth-create', players)
        if(res.status===200){
            const authToken = res.data.playerAuthToken;
            localStorage.setItem("JWT", authToken);
        }
    } catch (err: any) {
        console.log(err.message);
    }
}

export const addResult = async (values: Object) =>{
    try {
        const added = await api_url.post('/create-result', values);
        return added.status === 200;
    } catch (err: any) {
        console.log(err.message);
        return false
    }
}