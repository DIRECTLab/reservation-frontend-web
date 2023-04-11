import axios from 'axios'

const methods = {
  get: 'get',
  post: 'post', 
  patch: 'patch',
  delete: 'delete'
}

const requestGenerator = (getBase) => (method, uri) => (data = {}) => {
  let requestPromise;
  switch (method) {
    case methods.get:
    case methods.post:
      requestPromise = axios[method](`${getBase()}/${uri}`, {...data});
      break;
    case methods.delete:
      requestPromise = axios[method](`${getBase()}/${uri}`, {
        params: data,
      });
      break;
    default:
      requestPromise = axios[method](`${getBase()}/${uri}`)
      break;
  }
  return requestPromise
    .then(({data}) => data)
    .catch(e => e.response.data);
}

const getApiBase = () => 'http://localhost:11236'
const r = requestGenerator(getApiBase);

const api = {
  getChargers: r('get', 'charger'),
  charger: (chargerId) => ({
    get: r('get', `charger/${chargerId}`)
  }),
  reservation: (userId) => ({
    getAll: r('get', `reservation?UserId=${userId}&all=true`),
    getCurrent: r('get', `reservation/current?UserId=${userId}&startDate=${new Date().toDateString()}`),
    getUpcoming: r('get', `reservation?UserId=${userId}&upcoming=true`),
  }),
  createUser: r('post', `user`),
  login: r('post', `user/login`),
  user: (userId) => ({
    getUser: r('get', `user?id=${userId}`),
  })
}
export default api