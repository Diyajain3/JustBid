const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/tenders');
    console.log(JSON.stringify(res.data.tenders.slice(0, 2), null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

testApi();
