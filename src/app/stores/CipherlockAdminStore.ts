import { observable } from 'mobx';

export class CipherlockAdminStore {

  @observable
  serverUrl: string = '';

  @observable
  apiKey: string = '';

}

const cipherlockAdminStore = new CipherlockAdminStore();
export default cipherlockAdminStore;
