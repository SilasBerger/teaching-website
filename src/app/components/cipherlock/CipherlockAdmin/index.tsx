import styles from "./styles.module.scss";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Admonition from "@site/src/theme/Admonition";

const CipherlockAdmin = () => {
  return (
    <div>
      <div className={styles.connectionPanel}>

        <Admonition type='warning' title='Not connected'>
          Not connected to game server.
        </Admonition>

        <div className={styles.connectionInputs}>
          <div className={styles.connectionInputGroup}>
            <label htmlFor="input-server-url">Game Server URL</label>
            <input type="text" id="input-server-url" placeholder="https://..." />
          </div>
          <div className={styles.connectionInputGroup}>
            <label htmlFor="input-server-api-key">API Key</label>
            <input type="text" id="input-server-api-key" placeholder="API key" />
          </div>
          <div>
            <button className="button button--primary">Connect | Disconnect</button>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <h2>Control panel</h2>
        <Tabs groupId="panel">
          <TabItem value="game" label="Game">
            Upload game file, see currently active gameId / name / description
          </TabItem>

          <TabItem value="lora" label="LoRaWAN Dashboard">
            See lorawan gateway status, online status for expected boxes (derived from game file), etc.
          </TabItem>
        </Tabs>
      </div>
    </div>
  )
};

export default CipherlockAdmin;
