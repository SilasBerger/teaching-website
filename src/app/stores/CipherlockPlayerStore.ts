import {action, computed, observable} from "mobx";

interface PlayerStorage {
  serverUrl?: string;
  gameId?: string;
  playerId: string;
}

export class CipherlockPlayerStore {

  private static readonly _PLAYER_STORAGE_KEY = 'cipherlockPlayer';

  constructor() {
    const storedValues = JSON.parse(localStorage.getItem(CipherlockPlayerStore._PLAYER_STORAGE_KEY)) as PlayerStorage;
    this._serverUrl = storedValues?.serverUrl || '';
    this._gameId = storedValues?.gameId || '';
    this._playerId = storedValues?.gameId || '';
  }

  @observable
  private _serverUrl: string = '';

  @computed
  get serverUrl(): string {
    return this._serverUrl;
  }

  @observable
  _gameId: string = '';

  @computed
  get gameId(): string {
    return this._gameId;
  }

  @observable
  _playerId: string = '';

  @computed
  get playerId(): string {
    return this._playerId;
  }

  @action
  updateGameValues(serverId: string, gameId: string) {
    this._serverUrl = serverId;
    this._gameId = gameId;
    this._playerId = undefined;
    this._writeToLocalStore();
  }

  @action
  updatePlayerId(playerId: string) {
    this._playerId = playerId;
    this._writeToLocalStore();
  }

  _writeToLocalStore() {
    const storage = {
      serverUrl: this._serverUrl,
      gameId: this._gameId,
      playerId: this._playerId,
    } as PlayerStorage;
    localStorage.setItem(CipherlockPlayerStore._PLAYER_STORAGE_KEY, JSON.stringify(storage));
  }
}

const cipherlockPlayerStore = new CipherlockPlayerStore();
export default cipherlockPlayerStore;
