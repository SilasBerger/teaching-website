import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
import { useStore } from '@site/src/hooks/useStore';
import { observer } from 'mobx-react-lite';
import DefinitionList from '../DefinitionList';
import { BACKEND_URL } from '@site/src/authConfig';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseCircle, mdiConnection } from '@mdi/js';
import Button from '../shared/Button';

const HomepageFeatures = observer(() => {
    const socketStore = useStore('socketStore');
    const userStore = useStore('userStore');
    return (
        <section className={styles.features}>
            <div className="container">
                <h2>Socket.IO</h2>
                <DefinitionList>
                    <dt>URL</dt>
                    <dd>{BACKEND_URL}</dd>
                    <dt>Connected?</dt>
                    <dd>
                        {socketStore.isLive ? (
                            <span>
                                <Icon path={mdiCheckCircle} size={0.8} color="var(--ifm-color-success)" />{' '}
                                Live
                            </span>
                        ) : (
                            <span>
                                <Icon path={mdiCloseCircle} size={0.8} color="var(--ifm-color-danger)" />{' '}
                                Offline
                            </span>
                        )}
                    </dd>
                    {socketStore.isLive && (
                        <>
                            <dt>Clients</dt>
                            <dd>{socketStore.connectedClients.get(userStore.viewedUser?.id ?? '') ?? 0}</dd>
                        </>
                    )}
                    <dt>Connection</dt>
                    <dd>
                        <Button
                            icon={mdiConnection}
                            text="Connect"
                            onClick={() => {
                                socketStore.resetUserData();
                                socketStore.connect();
                            }}
                            disabled={socketStore.isLive}
                            color="blue"
                        />
                    </dd>
                    <dd>
                        <Button
                            icon={mdiCloseCircle}
                            text="Disconnect"
                            onClick={() => socketStore.disconnect()}
                            disabled={!socketStore.isLive}
                            color="red"
                        />
                    </dd>
                </DefinitionList>
            </div>
        </section>
    );
});

export default HomepageFeatures;
