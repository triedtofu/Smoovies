const baseUrl = '';
// const baseUrl = 'https://comp3900-lawnchair-back.herokuapp.com'

/**
 * @param {string} path Path of api
 * @param {object} init
 * @returns {Promise<object>}
 */
 const apiFetch = (path: string, init: object) => {
  return fetch(baseUrl + '/api' + path, init)
    .then(res => res.json())
    .then(data => {
      if (data && data.error) throw Error(data.error);
      return data;
    })
}

// Auth

export const apiAuthRegister = (name: string, email: string, password: string) => {
  return apiFetch('/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
}
