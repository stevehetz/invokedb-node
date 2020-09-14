import axios from 'axios';

export enum SORT_DIR {
  ASC = 'asc',
  DESC = 'desc'
}

export interface ISortParam {
  sortBy: string;
  sortDir: SORT_DIR;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_DIR = 'asc';

class InvokeDBFind {
  private _filter: any;
  private _skip: number;
  private _limit: number;
  private _sortBy: string;
  private _sortDir: string;
  private _findOne = false;

  constructor(private _baseUrl: string, private _apiKey: string, private _tableName: string) { }

  limit(value: number) {
    this._limit = value;
    return this;
  }

  skip(value: number) {
    this._skip = value;
    return this;
  }

  sortBy(value: string) {
    this._sortBy = value;
    return this;
  }

  sortDir(value: string) {
    this._sortDir = value;
    return this;
  }

  find(filter: any) {
    this._filter = filter;
    return this;
  }

  findOne(filter: any) {
    this._filter = filter;
    this._findOne = true;
    return this;
  }

  async exec() {
    const headers = { Authorization: `Bearer ${this._apiKey}` };

    let urlQuery = `table=${this._tableName}`;
    urlQuery += `&skip=${this._skip || 0}`;
    urlQuery += `&limit=${this._limit || DEFAULT_LIMIT}`;

    if (this._sortBy) {
      urlQuery += `&sort_by=${this._sortBy}`;
      urlQuery += `&sort_dir=${this._sortDir || DEFAULT_SORT_DIR}`;
    }

    const res = this._filter
      ? await axios.post(`${this._baseUrl}/search?${urlQuery}`, this._filter, { headers })
      : await axios.get(`${this._baseUrl}/get?${urlQuery}`, { headers });

    if (res && res.data) {
      if (this._findOne) {
        return Array.isArray(res.data.data) && res.data.data[0]
          ? res.data.data[0]
          : null;
      }
      return res.data;
    } else {
      return {
        count: 0,
        data: []
      }
    }
  }
}


class InvokeDBTableClient {
  constructor(private _baseUrl: string, private _apiKey: string, private _tableName: string) { }
  
  /*async findOne(params?: IGetParams) {
    const res = await this.find(params);
    if (res && res.data && res.data.data && res.data.data[0]) {
      return res.data.data[0];
    }

    return undefined;
  }*/

  private createFindClient() {
    return new InvokeDBFind(
      this._baseUrl,
      this._apiKey,
      this._tableName
    );
  }

  find(filter?: any) {
    return this.createFindClient().find(filter);
  }

  findOne(filter?: any) {
    return this.createFindClient().findOne(filter).exec();
  }

  limit(value: number) {
    return this.createFindClient().limit(value);
  }

  skip(value: number) {
    return this.createFindClient().skip(value);
  }

  sortBy(value: string) {
    return this.createFindClient().sortBy(value);
  }

  sortDir(value: string) {
    return this.createFindClient().sortDir(value);
  }

  count() {

  }

  insert() {

  }

   update() {

  }

  delete() {

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
