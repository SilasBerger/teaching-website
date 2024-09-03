import {action, computed, observable} from 'mobx';
import {currentUser, find as apiFind, User as UserProps} from '../api/user';
import {RootStore} from './rootStore';
import User from '../models/User';
import Storage, {PersistedData, StorageKey} from './utils/Storage';
import {computedFn} from 'mobx-utils';
import iStore from './iStore';

export class UserStore extends iStore {
  readonly root: RootStore;

  users = observable<User>([]);

  affectedEventIds = observable.set<string>([], { deep: false });

  constructor(root: RootStore) {
    super();
    this.root = root;

    setTimeout(() => {
      // attempt to load the previous state of this store from localstorage
      this.rehydrate();
    }, 1);
  }

  @action
  rehydrate(_data?: PersistedData) {
    if (this.users.length > 0) {
      return;
    }
    const data = _data || Storage.get(StorageKey.SessionStore) || {};
    if (data.user) {
      try {
        this.addToStore(data.user);
      } catch (e) {
        console.error(e);
        Storage.remove(StorageKey.SessionStore);
      }
    }
  }

  find = computedFn(
    function <T>(this: UserStore, id?: string): User {
      if (!id) {
        return;
      }
      return this.users.find((d) => d.id === id) as User;
    },
    { keepAlive: true }
  );

  createModel(data: UserProps): User {
    return new User(data, this);
  }

  @action
  addToStore(data: UserProps) {
    if (!data) {
      return;
    }
    const newUser = this.createModel(data);
    this.removeFromStore(newUser.id);
    this.users.push(newUser);
    return newUser;
  }

  @action
  removeFromStore(id: string): User | undefined {
    /**
     * Removes the model to the store
     */
    const old = this.find(id);
    if (old) {
      this.users.remove(old);
      /**
       * eventually cleanup the model
       */
    }
    return old;
  }

  @computed
  get current(): User | undefined {
    if (this.root.sessionStore?.authMethod === 'msal') {
      return this.users.find(
        (u) => u.email?.toLowerCase() === this.root?.sessionStore?.account?.username?.toLowerCase()
      );
    }
    return this.users.find((u) => u.id === this.root.sessionStore?.currentUserId);
  }

  @action
  loadUser(id: string) {
    return this.withAbortController(`load-${id}`, async (ct) => {
      return apiFind(id, ct.signal).then((res) => {
        return this.addToStore(res.data);
      });
    });
  }

  @action
  loadCurrent() {
    const res = this.withAbortController('load-user', async (signal) => {
      return currentUser(signal.signal).then((res) => {
        return this.addToStore(res.data);
      });
    });
    return res;
  }

  @action
  cleanup() {
    this.users.clear();
  }
}
