import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params :{
        api_key: "570c0c9de7b3deedd8bc3e6c3c8569d2",
        language:"pt-BR",
    }
});

export default api;