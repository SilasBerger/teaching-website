import styles from "./styles.module.scss";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Admonition from "@site/src/theme/Admonition";
import io, {Socket} from "socket.io-client";
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import cipherlockAdminStore from "@site/src/app/stores/CipherlockAdminStore";
import {action} from "mobx";
import {GameSpec} from "@site/src/app/components/cipherlock/CipherlockAdmin/model";
import * as React from "react";
import GamePanel from "@site/src/app/components/cipherlock/CipherlockAdmin/GamePanel";
import LoraPanel from "@site/src/app/components/cipherlock/CipherlockAdmin/LoraPanel";

const CipherlockAdmin = observer(() => {

  const [serverConnected, setServerConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [serverUrl, setServerUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [socket, setSocket] = useState<Socket>();
  const [gameSpec, setGameSpec] = useState<GameSpec>();

  useEffect(() => {
    setServerUrl(cipherlockAdminStore.serverUrl || '');
    setApiKey(cipherlockAdminStore.apiKey || '');
    setSocket(cipherlockAdminStore.socket);
    setGameSpec(cipherlockAdminStore.gameSpec);
  }, []);

  useEffect(() => {
    cipherlockAdminStore.updateCredentials(serverUrl, apiKey);

    return action(() => {
      cipherlockAdminStore.socket = socket;
      cipherlockAdminStore.gameSpec = gameSpec;
    });
  }, [serverUrl, apiKey, socket, gameSpec]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    setServerConnected(socket.connected || false);

    socket.on('connect', () => {
      setServerConnected(true);
      setConnecting(false);
      clearError(); // TODO: Should be better defined when to clear errors.
    })

    socket.on('disconnect', () => {
      setServerConnected(false);
      setGameSpec(undefined); // TODO: Should have a list of all properties that need to be invalidated when server connection is lost.
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error: any) => {
      setError(error.toString());
      setConnecting(false);
    });

    socket.on('gameSpecUpdated', (newSpec: GameSpec) => {
      setGameSpec(newSpec);
    });
  }, [socket]);

  function clearError() {
    setError('');
  }

  function connectToSocket() {
    setConnecting(true);
    clearError();
    if (!serverUrl) {
      setConnecting(false);
      return;
    }

    try {
      const url = new URL(serverUrl);
      const wsUrl = `ws://${url.host}`;
      setSocket(io(wsUrl, {
        extraHeaders: {
          apikey: apiKey,
        }
      }));
    } catch (e) {
      setError(e.toString());
      setConnecting(false);
      return;
    }
  }

  function disconnectFromServer() {
    socket.disconnect();
  }

  return (
    <div>
      <details className={styles.connectionPanel} open={!serverConnected || !!error}>
        <summary>Connection</summary>
        <div>

          {!serverConnected &&
            <Admonition type='warning' title='Not connected'>
              Not connected to game server.
            </Admonition>
          }

          {error &&
            <Admonition type='danger' title='Error'>
              {error}
            </Admonition>
          }

          <div className={styles.connectionInputs}>
            <div className={styles.connectionInputGroup}>
              <label htmlFor="input-server-url">Game Server URL</label>
              <input
                type="text"
                id="input-server-url"
                placeholder="https://..."
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                disabled={connecting || serverConnected}
              />
            </div>
            <div className={styles.connectionInputGroup}>
              <label htmlFor="input-server-api-key">API Key</label>
              <input
                type="password"
                id="input-server-api-key"
                placeholder="API key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={connecting || serverConnected}
              />
            </div>
            <div>
              {!serverConnected &&
                <button
                  className="button button--primary"
                  onClick={() => connectToSocket()}
                  disabled={!(serverUrl && apiKey) || connecting}>Connect</button>
              }
              {serverConnected &&
                <button
                  className="button button--secondary"
                  onClick={() => disconnectFromServer()}>Disconnect</button>
              }
            </div>
          </div>
        </div>
      </details>

      <div className={styles.tabs}>
        <Tabs groupId="panel">
          <TabItem value="game" label="Game">
            <GamePanel gameSpec={gameSpec}
                       setGameSpec={setGameSpec}
                       serverUrl={serverUrl}
                       serverConnected={serverConnected}
                       setError={setError}/>
          </TabItem>

          <TabItem value="lora" label="LoRaWAN Dashboard">
            <LoraPanel />
          </TabItem>
        </Tabs>
      </div>
    </div>
  )
});

export default CipherlockAdmin;
