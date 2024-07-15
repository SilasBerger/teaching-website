// Source: https://github.com/GBSL-Informatik/teaching-dev/blob/main/src/stores/rootStore.ts, https://github.com/lebalz/ofi-blog/blob/main/src/stores/ViewStore.ts
import React from 'react';
import {ToolsStore} from "@site/src/app/stores/ToolsStore";
import {UserStore} from "@site/src/app/stores/UserStore";
import {SessionStore} from "@site/src/app/stores/SessionStore";
import {reaction} from "mobx";

export class RootStore {

  toolsStore: ToolsStore;
  userStore: UserStore;
  sessionStore: SessionStore;

  constructor() {
    this.toolsStore = new ToolsStore(this);
    this.userStore = new UserStore(this);
    this.sessionStore = new SessionStore(this);
    reaction(
      () => this.sessionStore.isLoggedIn,
      (isLoggedIn) => {
        console.log('Running the hook');
        if (isLoggedIn) {
          this.userStore.loadCurrent().then((user) => {
          });
        }
      }
    );
  }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext<RootStore>(rootStore);
export const StoresProvider = storesContext.Provider;
