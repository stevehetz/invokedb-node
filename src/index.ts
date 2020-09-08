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
  sortBy?: string;
  sortDir?: SORT_DIR;
  filter?: any;
}

const DEFAULT_LIMIT = 10;


class InvokeDBTableClient {
  constructor(private _baseUrl: string, private _apiKey: string, private _tableName: string) { }
  
  async findOne(filter?: any) {
    const res = await this.find({ filter });
    if (res && res.data && res.data.data && res.data.data[0]) {
      return res.data.data[0];
    }

    return undefined;
  }

  async find(params?: IGetParams) {
    params = params || {};
    params.limit = typeof params.limit === 'number' ? params.limit : DEFAULT_LIMIT;
    params.skip = typeof params.skip === 'number' ? params.skip : 0;
    const { skip, limit, sortBy, sortDir, filter } = params;
    const headers = { Authorization: `Bearer ${this._apiKey}` };

    let urlQuery = `table=${this._tableName}`;
    urlQuery += `&skip=${skip}`;
    urlQuery += `&limit=${limit}`;

    if (sortBy) {
      urlQuery += `&sort_by=${sortBy}`;
      const sort_dir = sortDir || 'asc';
      urlQuery += `&sort_dir=${sort_dir}`;
    }

    return filter
      ? await axios.post(`${this._baseUrl}/search?${urlQuery}`, filter, { headers })
      : await axios.get(`${this._baseUrl}/get?${urlQuery}`, { headers });
  }

  async count() {

  }

  async insert() {

  }

  async update() {

  }

  async delete() {

  }
}

export class InvokeDBClient {
  private _baseUrl: string;
  private _apiKey: string;
  
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
