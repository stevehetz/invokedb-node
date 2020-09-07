import axios from 'axios';

const config = {
  BASE_URL: 'https://api.invokedb.com/v1',
  API_KEY: 'fmh99QgCYnufhYDuAYSgpPblGAYgEWi7'
};

const getPaging = async () => {
  const table = 'contacts';
  const limit = 10;
  const headers = { Authorization: `Bearer ${config.API_KEY}` };

  let url = `https://api.invokedb.com/v1/get?table=${table}`;

  let skip = 0;
  url += `&skip=${skip}&limit=${limit}`;
  let res = await axios.get(url, { headers });
  console.log(res);
  // { data: { count: 200, data: [...] } }

  skip = skip + limit;
  url += `&skip=${skip}&limit=${limit}`;
  res = await axios.get(url, { headers });
  console.log(res);
  // { data: { count: 200, data: [...] } }
};


export const invokedb = function () {
  getPaging();
}
