import {AccountInfo, IPublicClientApplication} from '@azure/msal-browser';
import {action, computed, observable, reaction} from 'mobx';
import {RootStore} from './rootStore';
import {logout, Role} from '../api/user';
import Storage, {PersistedData, StorageKey} from './utils/Storage';
import siteConfig from '@generated/docusaurus.config';
import iStore from './iStore';

const { NO_AUTH, TEST_USERNAME } = siteConfig.customFields as { TEST_USERNAME?: string; NO_AUTH?: boolean };

class State {
  @observable.ref accessor account: AccountInfo | undefined | null = undefined;

  @observable.ref accessor _msalInstance: IPublicClientApplication | undefined = undefined;

  constructor() {}
}

export class SessionStore extends iStore {
  readonly root: RootStore;
  private static readonly NAME = 'SessionStore' as const;

  @observable.ref private accessor stateRef: State = new State();

  @observable accessor authMethod: 'apiKey' | 'msal' = 'msal';

  @observable accessor currentUserId: string | undefined;

  @observable accessor initialized = false;

  @observable accessor storageSyncInitialized = false;

  constructor(store: RootStore) {
    super();
    this.root = store;
    const data = Storage.get<PersistedData>(StorageKey.SessionStore) || {};
    this.rehydrate(data);

    reaction(
      () => this.root.userStore?.current?.id,
      (id) => {
        if (id) {
          const user = this.root.userStore.current!;
          Storage.set(StorageKey.SessionStore, {
            user: { ...user.props, role: Role.USER }
          });
        }
      }
    );
    this.initialized = true;
  }

  @action
  rehydrate(data: PersistedData) {
    this.authMethod = !!data?.user ? 'apiKey' : 'msal';
    if (!data.user || this.currentUserId) {
      return;
    }
    this.currentUserId = data.user?.id;
  }

  @action
  logout() {
    const sig = new AbortController();
    logout(sig.signal)
      .catch((err) => {
        console.error('Failed to logout', err);
      })
      .finally(() => {
        // this.root.cleanup();
        Storage.remove(SessionStore.NAME);
        localStorage.clear();
        window.location.reload();
      });
  }

  @action
  setMsalStrategy() {
    Storage.remove(SessionStore.NAME);
    this.authMethod = 'msal';
  }

  @computed
  get account(): AccountInfo | null | undefined {
    return this.stateRef.account;
  }

  @action
  setAccount(account?: AccountInfo | null) {
    this.stateRef.account = account;
  }

  @computed
  get isLoggedIn(): boolean {
    return this.authMethod === 'apiKey' ? !!this.currentUserId : !!this.stateRef.account;
  }

  @action
  setupStorageSync() {
    if (this.storageSyncInitialized) {
      return;
    }
    window.addEventListener('storage', (event) => {
      if (event.key === SessionStore.NAME && event.newValue) {
        const newData: PersistedData | null = JSON.parse(event.newValue);

        // data may be null if key is deleted in localStorage
        if (!newData) {
          return;
        }

        // If we're not signed in then hydrate from the received data, otherwise if
        // we are signed in and the received data contains no user then sign out
        if (this.isLoggedIn) {
          if (newData.user === null) {
            void this.logout();
          }
        } else {
          this.rehydrate(newData);
          this.root.userStore.rehydrate(newData);
        }
      }
    });
    this.storageSyncInitialized = true;
  }
}
