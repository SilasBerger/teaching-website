import { observable } from 'mobx';
import {Socket} from "socket.io-client";

export class CipherlockAdminStore {

  @observable
  serverUrl: string = '';

  @observable
  apiKey: string = '';

  @observable
  socket: Socket = undefined;

}

const cipherlockAdminStore = new CipherlockAdminStore();
export default cipherlockAdminStore;
