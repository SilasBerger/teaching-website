import {action, computed, observable} from 'mobx';
import {Socket} from "socket.io-client";

export class CipherlockAdminStore {

  private static readonly _CREDENTIALS_STORAGE_KEY = 'cipherlockAdminCredentials';

  constructor() {
    const credentials = JSON.parse(localStorage.getItem(CipherlockAdminStore._CREDENTIALS_STORAGE_KEY));
    this._serverUrl = credentials?.serverUrl || '';
    this._apiKey = credentials?.apiKey || '';
  }

  @observable
  private _serverUrl: string = '';

  @observable
  private _apiKey: string = '';

  @computed
  get serverUrl() {
    return this._serverUrl;
  }

  @computed
  get apiKey() {
    return this._apiKey;
  }

  @observable
  socket: Socket = undefined;

  @action
  updateCredentials(serverUrl: string, apiKey: string) {
    this._serverUrl = serverUrl;
    this._apiKey = apiKey;
    this._storeCredentials();
  }

  _storeCredentials() {
    const obj = {
      serverUrl: this._serverUrl,
      apiKey: this._apiKey,
    };
    localStorage.setItem(CipherlockAdminStore._CREDENTIALS_STORAGE_KEY, JSON.stringify(obj));
  }
}

const cipherlockAdminStore = new CipherlockAdminStore();
export default cipherlockAdminStore;
