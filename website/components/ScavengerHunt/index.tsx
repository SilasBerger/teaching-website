import Admonition from '@theme/Admonition';
import styles from './style.module.scss';
import { useLocation } from '@docusaurus/router';
import Button from '@tdev-components/shared/Button';
import { mdiCheckCircleOutline, mdiProgressQuestion } from '@mdi/js';
import TextInput from '@tdev-components/shared/TextInput';
import { useEffect } from 'react';
import DefinitionList from '@tdev-components/DefinitionList';
import Badge from '@tdev-components/shared/Badge';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import { ApiState } from '@tdev-stores/iStore';
import { ScavengerHuntStore } from '../../stores/ScavengerHuntStore';
import { StationDescription, isScavengerApiAvailable } from '../../api/scavengerHunt';
import Loader from '@tdev-components/Loader';

interface Props {
    showLocationDescriptionTable: boolean;
}

const ScavengerHunt = observer(({ showLocationDescriptionTable }: Props) => {
    const location = useLocation();
    const scavengerHuntStore = (
        useStore('siteStore') as unknown as { scavengerHuntStore: ScavengerHuntStore }
    ).scavengerHuntStore;
    const searchParams = new URLSearchParams(location.search);

    const gameId = searchParams.get('game_id');
    const stationId = searchParams.get('station_id');

    useEffect(() => {
        if (!isScavengerApiAvailable || !gameId || !stationId) {
            return;
        }
        scavengerHuntStore.loadStations(gameId, stationId).catch(() => {
            // errors are exposed via the store
        });
    }, [gameId, stationId]);

    if (!isScavengerApiAvailable) {
        return (
            <div>
                <Admonition title="Fehler" type="danger">
                    Diese Funktion ist zurzeit nicht verfügbar.
                </Admonition>
            </div>
        );
    }

    if (!gameId || !stationId) {
        return (
            <div>
                <i>Öffnen Sie diese Seite, indem Sie den QR-Code bei einem Posten scannen.</i>
                <Loader />
            </div>
        );
    }

    const station = scavengerHuntStore.currentStation;
    const isLoading = scavengerHuntStore.apiStateFor('load-stations') === ApiState.SYNCING;
    const isChecking = scavengerHuntStore.apiStateFor('check-answer') === ApiState.SYNCING;
    const sortedStationDescriptions = [...scavengerHuntStore.stationDescriptions].sort(
        (a, b) => a.station_order - b.station_order
    );

    if (scavengerHuntStore.loadError) {
        return (
            <div>
                <Admonition title="Fehler" type="danger">
                    {scavengerHuntStore.loadError}
                </Admonition>
            </div>
        );
    }

    if (isLoading && !station) {
        return <Loader />;
    }

    if (!station) {
        return (
            <div>
                <Admonition title="Unbekannter Posten" type="danger">
                    Für den angegebenen Posten konnten keine Informationen geladen werden.
                </Admonition>
            </div>
        );
    }

    const checkAnswer = () => {
        scavengerHuntStore.checkAnswer().catch(() => {
            // errors are exposed via the store
        });
    };

    return (
        <div>
            <div className={styles.badges}>
                <Badge type="primary">Posten-Nr.: {station.station_order + 1}</Badge>
                {!!scavengerHuntStore.creatorsLabel(station) && (
                    <Badge type="primary">Erstellt von: {scavengerHuntStore.creatorsLabel(station)}</Badge>
                )}
            </div>
            Geben Sie hier das Lösungswort für Ihren aktuellen Posten ein und überprüfen Sie Ihre Antwort.
            <div className={styles.checkControls}>
                <TextInput
                    placeholder="Lösungswort eingeben"
                    readOnly={scavengerHuntStore.isAnswerCorrect || isLoading || isChecking}
                    onChange={(e) => scavengerHuntStore.setAnswerInput(e)}
                    onEnter={() => checkAnswer()}
                    value={scavengerHuntStore.answerInput}
                />
                <Button
                    icon={scavengerHuntStore.isAnswerCorrect ? mdiCheckCircleOutline : mdiProgressQuestion}
                    color={scavengerHuntStore.isAnswerCorrect ? 'success' : 'primary'}
                    iconSide="left"
                    text="Antwort prüfen"
                    disabled={!scavengerHuntStore.canCheckAnswer || isLoading || isChecking}
                    onClick={() => checkAnswer()}
                />
            </div>
            {!!scavengerHuntStore.checkError && (
                <Admonition type="danger" title="Fehler">
                    <div>{scavengerHuntStore.checkError}</div>
                </Admonition>
            )}
            {scavengerHuntStore.isAnswerCorrect && (
                <Admonition type="success" title="Richtig!">
                    <div>
                        Das war die richtige Antwort. Notieren Sie sich nun den unten angezeigten
                        Achievement-Code für den Posten Nr.{' '}
                        <strong className="boxed">{station.station_order + 1}</strong> und begeben Sie sich{' '}
                        {showLocationDescriptionTable ? 'zu einem' : 'zum'} nächsten Posten (oder zurück zum
                        Treffpunkt, falls Sie bereits alle Achievement-Codes gesammelt haben).
                    </div>
                    <DefinitionList>
                        <dt>Achievement-Code</dt>
                        <dd>
                            <strong className="boxed">
                                {scavengerHuntStore.lastCheckResult?.achievement_code}
                            </strong>
                        </dd>
                        {!showLocationDescriptionTable && !!scavengerHuntStore.nextStation && (
                            <>
                                <dt>Nächster Posten</dt>
                                <dd>{scavengerHuntStore.nextStation.location_description}</dd>
                            </>
                        )}
                    </DefinitionList>
                </Admonition>
            )}
            {scavengerHuntStore.hasIncorrectResult && (
                <Admonition type="danger" title="Leider falsch">
                    <div>Das war noch nicht die richtige Antwort. Versuchen Sie es nochmal!</div>
                </Admonition>
            )}
            {showLocationDescriptionTable && (
                <div className={styles.locationTableContainer}>
                    <p className={styles.title}>Hier finden Sie die weiteren Posten:</p>
                    <table className={styles.locationTable}>
                        <thead>
                            <tr>
                                <th>Posten-Nr.</th>
                                <th>Ortsbeschreibung</th>
                                {scavengerHuntStore.anyHaveCreators && <th>Erstellt von</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStationDescriptions.map((entry: StationDescription) => {
                                return (
                                    <tr
                                        key={entry.station_id}
                                        className={clsx({
                                            [styles.current]: entry.station_id === station.station_id
                                        })}
                                    >
                                        <td>{entry.station_order + 1}</td>
                                        <td>{entry.location_description}</td>
                                        {scavengerHuntStore.anyHaveCreators && (
                                            <td>{scavengerHuntStore.creatorsLabel(entry)}</td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

export default ScavengerHunt;
