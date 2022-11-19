import axios from 'axios';

const USER_API_BASE_URL = "https://fmba-backend-gateway.herokuapp.com";

class ClienteService {

    async getClientes(){
        return await axios.get(USER_API_BASE_URL + "/cliente");
    }
}

export default new ClienteService();