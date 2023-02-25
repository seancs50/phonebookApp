import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const _delete = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.status)
  }

const update = (idForUpdate, personObject)  => {
    const request = axios.put(`${baseUrl}/${idForUpdate}`, personObject)
    return request.then(response => response.data)    
}


 export default { getAll, create, _delete, update}