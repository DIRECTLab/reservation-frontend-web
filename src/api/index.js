import axios from 'axios'

const methods = {
  get: 'get',
  post: 'post', 
  patch: 'patch',
  delete: 'delete'
}

const requestGenerator = (getBase) => (method, uri) => (data = {}, authorization = null) => {
  let requestPromise;
  switch (method) {
    case methods.get:
    case methods.post:
      requestPromise = axios[method](`${getBase()}/${uri}`, {...data}, {headers: {authorization}});
      break;
    case methods.delete:
      requestPromise = axios[method](`${getBase()}/${uri}`, {headers: {authorization}});
      break;
    default:
      requestPromise = axios[method](`${getBase()}/${uri}`)
      break;
  }
  return requestPromise
    .then(({data}) => data)
    .catch(e => e.response.data);
}

const getApiBase = () => 'http://localhost:11236' // Development
//const getApiBase = () => '' // Production
const r = requestGenerator(getApiBase);

const api = {
  getChargers: r('get', 'charger'),
  charger: (chargerId) => ({
    get: r('get', `charger/${chargerId}`)
  }),
  reservation: (userId) => ({
    getAll: r('get', `reservation?UserId=${userId}&all=true`),
    getCurrent: r('get', `reservation/current?UserId=${userId}&startDate=${new Date()}`),
    getUpcoming: r('get', `reservation?UserId=${userId}&upcoming=true`),
    reserve: r('post', `reservation`),
    delete: r('delete', `reservation?id=${userId}`),
  }),
  getChargerReservations: (chargerId, date) => ({ 
    getAll: r('get', `reservation/reserved_times?chargerId=${chargerId}&date=${date}`) 
  }),
  createUser: r('post', `user`),
  login: r('post', `user/login`),
  user: (userId) => ({
    getUser: r('get', `user?id=${userId}`),
  })
}
export default api