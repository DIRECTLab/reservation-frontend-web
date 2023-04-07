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
  charger: (chargerId) => ({
    get: r('get', `charger/${chargerId}`)
    
  })
}