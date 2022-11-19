import axios from 'axios';

const USER_API_BASE_URL = "https://fmba-backend-gateway.herokuapp.com";

class UserService {

    async getUser(user){
        return await axios.post(USER_API_BASE_URL + "/login", user);
    }
}

export default new UserService();