import React from 'react';
import {DocumentRootStore} from './DocumentRootStore';
import {UserStore} from './UserStore';
import {SessionStore} from './SessionStore';
import {SocketDataStore} from './SocketDataStore';
import {action, reaction} from 'mobx';
import {StudentGroupStore} from './StudentGroupStore';
import PermissionStore from './PermissionStore';
import DocumentStore from './DocumentStore';
import {ToolsStore} from "@site/src/app/stores/ToolsStore";

export class RootStore {
  documentRootStore: DocumentRootStore;
  userStore: UserStore;
  sessionStore: SessionStore;
  socketStore: SocketDataStore;
  studentGroupStore: StudentGroupStore;
  permissionStore: PermissionStore;
  documentStore: DocumentStore;
  toolsStore: ToolsStore;

  constructor() {
    this.documentRootStore = new DocumentRootStore(this);
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
    this.socketStore = new SocketDataStore(this);
    this.studentGroupStore = new StudentGroupStore(this);
    this.permissionStore = new PermissionStore(this);
    this.documentStore = new DocumentStore(this);
    this.toolsStore = new ToolsStore(this);

    reaction(
      () => this.sessionStore.isLoggedIn,
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.userStore.loadCurrent().then((user) => {
            if (user) {
              this.socketStore.reconnect();
            }
          });
        } else {
          this.cleanup();
        }
      }
    );
  }

  @action
  load() {
    this.userStore.loadCurrent().then((user) => {
      if (user) {
        this.socketStore.reconnect();
        /**
         * load stores
         */
        this.studentGroupStore.load();
      }
    });
  }

  @action
  cleanup() {
    /**
     * could be probably ignored since the page gets reloaded on logout?
     */
    this.userStore.cleanup();
    this.socketStore.cleanup();
    this.studentGroupStore.cleanup();
  }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
