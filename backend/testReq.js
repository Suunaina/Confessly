const axios = require('axios');

axios.post('http://localhost:5000/api/confessions', { text: 'hello test' })
  .then(res => console.log('success', res.status, res.data))
  .catch(err => {
    if (err.response) {
      console.log('resp', err.response.status, err.response.data);
    } else {
      console.log('error', err.message);
    }
  });
