import axios from 'axios';

const USER_API_BASE_URL = "https://fmba-backend-gateway.herokuapp.com";

class VeiculoService {

    async getVeiculos(){
        return await axios.get(USER_API_BASE_URL + "/veiculo");
    }
}

export default new VeiculoService();