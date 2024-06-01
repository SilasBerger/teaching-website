import TabItem from "@theme/TabItem";
import DefinitionList from "@site/src/app/components/DefinitionList";
import styles from "@site/src/app/components/cipherlock/CipherlockAdmin/styles.module.scss";
import clsx from "clsx";
import * as React from "react";
import {useState} from "react";
import {GameSpec} from "@site/src/app/components/cipherlock/CipherlockAdmin/model";
import yaml from "js-yaml";

interface Props {
  gameSpec: GameSpec;
  setGameSpec: React.Dispatch<React.SetStateAction<GameSpec>>;
  serverUrl: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  serverConnected: boolean;
}

const GamePanel = ({gameSpec, setGameSpec, serverUrl, setError, serverConnected}: Props) => {

  const [gameFileName, setGameFileName] = useState<string>('');
  const [gameFileContent, setGameFileContent] = useState<string>('');

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
    <>
      {!!gameSpec &&
        <div>
          <hr/>
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
        <h3>Start game</h3>
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
                  onClick={uploadGameFile}>Upload and start
          </button>
        </div>

        <hr/>
      </div>
    </>
  );
}

export default GamePanel;
