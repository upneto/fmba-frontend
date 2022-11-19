import axios from 'axios';

const ORDER_API_BASE_URL = "https://fmba-backend-gateway.herokuapp.com";

class OrderService {

    async getOrders(token){
        return await axios.get(ORDER_API_BASE_URL + "/ordem_servico"/*, {
            headers: {
              'JWT_TOKEN': token
            }
          }*/);
    }
    
    async saveOrder(token, order){
        return await axios.post(ORDER_API_BASE_URL + "/ordem_servico"/*, {
            headers: {
              'JWT_TOKEN': token
            }
          }*/, order);
    }

    async getOrderById(token, orderId){
        return await axios.get(ORDER_API_BASE_URL + "/ordem_servico/" + orderId/*, {
            headers: {
              'JWT_TOKEN': token
            }
          }*/);
    }

    async updateOrder(token, orderId, order){
        return await axios.put(ORDER_API_BASE_URL + "/ordem_servico"/*, {
        headers: {
            'JWT_TOKEN': token
          }
        }*/, order);
    }

    async deleteOrder(token, orderId){
        return await axios.delete(ORDER_API_BASE_URL + "/ordem_servico/" + orderId/*, {
            headers: {
                'JWT_TOKEN': token
              }
            }*/);
    }
}

export default new OrderService();