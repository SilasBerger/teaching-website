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
import clsx from "clsx";
import yaml from 'js-yaml';
import DefinitionList from "@site/src/app/components/DefinitionList";

const CipherlockAdmin = observer(() => {

  const [serverConnected, setServerConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [gameFileName, setGameFileName] = useState<string>('');
  const [gameFileContent, setGameFileContent] = useState<string>('');

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

  function selectGameFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setGameFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const resultObj = yaml.load(result);
        setGameFileContent(JSON.stringify(resultObj));
      };
      reader.readAsText(file);
    }
  }

  async function uploadGameFile() {
    clearError();
    if (!gameFileContent) {
      return;
    }

    const response = await fetch(`${serverUrl}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: gameFileContent,
    });

    if (response.ok) {
      setGameFileName('');
      setGameFileContent('');
    } else {
      setError(`${response.status}: ${response.statusText}`);
    }
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
            {!!gameSpec &&
              <div>
                <hr />
                <h4>✅ Game active</h4>
                <DefinitionList>
                  <dt>Game ID</dt>
                  <dd>{gameSpec.gameId}</dd>
                  <dt>Description</dt>
                  <dd>{gameSpec.gameDescription}</dd>
                </DefinitionList>
              </div>
            }

            <div className={styles.gameFileUploadContainer}>
              <hr/>
              <span className={styles.selectedFile}><b>File:</b> {gameFileName || 'No file selected'}</span>
              <input
                type="file"
                id='input-select-game-file'
                accept=".yaml"
                onChange={selectGameFile}
              />

              <div>
                <button className={clsx(
                  'button',
                  'button--secondary',
                  styles.btnSelectGameFile
                )} onClick={() => document.getElementById('input-select-game-file').click()}>Select game file
                </button>

                <button className={clsx('button', 'button--primary', styles.btnUploadImage)}
                        disabled={!gameFileContent || !serverConnected}
                        onClick={uploadGameFile}>Upload
                </button>
              </div>

              <hr/>
            </div>
          </TabItem>

          <TabItem value="lora" label="LoRaWAN Dashboard">
            See lorawan gateway status, online status for expected boxes (derived from game file), etc.
          </TabItem>
        </Tabs>
      </div>
    </div>
  )
});

export default CipherlockAdmin;
