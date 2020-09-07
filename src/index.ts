import axios from 'axios';

class InvokeDBTableClient {
  constructor(private _apiKey, private _tableName) { }

  async getPaging() {
    const limit = 10;
    const headers = { Authorization: `Bearer ${this._apiKey}` };

    let url = `https://api.invokedb.com/v1/get?table=${this._tableName}`;

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
  }
}

export class InvokeDBClient {
    constructor(private _apiKey) {
    if (!_apiKey && typeof (_apiKey) !== 'string') {
      throw 'Must provide a valid api key';
    }
  }

  table(tableName) {
    return new InvokeDBTableClient(this._apiKey, tableName);
  }
}
