import axios from 'axios';

export enum SORT_DIR {
  ASC = 'asc',
  DESC = 'desc'
}

export interface ISortParam {
  sortBy: string;
  sortDir: SORT_DIR;
}

export interface IGetParams {
  skip?: number;
  limit?: number;
  sort?: ISortParam;
}


class InvokeDBTableClient {
  constructor(private _baseUrl, private _apiKey, private _tableName) {}

  /*async get(params: IGetParams, filter?: any) {
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
  }*/

  async get(params: IGetParams, filter?: any) {
    const { skip, limit, sort } = params;
    const headers = { Authorization: `Bearer ${this._apiKey}` };

    let urlQuery = `table=${this._tableName}`;
    urlQuery += `&skip=${skip}`;
    urlQuery += `&limit=${limit}`;

    if (sort) {
      urlQuery += `&sort_by=${sort.sortBy}`;
      urlQuery += `&sort_dir=${sort.sortDir}`;
    }

    return filter
      ? await axios.post(`${this._baseUrl}/search?${urlQuery}`, filter, { headers })
      : await axios.get(`${this._baseUrl}/get?${urlQuery}`, { headers });
  }
}

export class InvokeDBClient {
  private _baseUrl;
  private _apiKey;
  constructor(private _config) {
    const { BASE_URL, API_KEY } = this._config;
    if (!API_KEY && typeof API_KEY !== 'string') {
      throw 'Must provide a valid api key';
    }
    this._baseUrl = BASE_URL || 'https://api.invokedb.com/v1';
    this._apiKey = API_KEY;
  }

  table(tableName) {
    return new InvokeDBTableClient(this._baseUrl, this._apiKey, tableName);
  }
}
