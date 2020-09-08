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
  filter?: any;
}


class InvokeDBTableClient {
  constructor(private _baseUrl: string, private _apiKey: string, private _tableName: string) {}

  async get(params: IGetParams) {
    const { skip, limit, sort, filter } = params;
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
  constructor(private _config: any) {
    const { baseUrl, apiKey } = this._config;
    if (!apiKey && typeof apiKey !== 'string') {
      throw 'Must provide a valid api key';
    }
    this._baseUrl = baseUrl || 'https://api.invokedb.com/v1';
    this._apiKey = apiKey;
  }

  table(tableName: string) {
    return new InvokeDBTableClient(this._baseUrl, this._apiKey, tableName);
  }
}
