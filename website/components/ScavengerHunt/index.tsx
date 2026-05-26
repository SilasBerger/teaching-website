import Admonition from '@theme/Admonition';
import styles from './style.module.scss';
import { useLocation } from '@docusaurus/router';
import Button from '@tdev-components/shared/Button';
import { mdiCheck, mdiCheckCircleOutline, mdiProgressQuestion } from '@mdi/js';
import TextInput from '@tdev-components/shared/TextInput';
import { useMemo, useState } from 'react';
import DefinitionList from '@tdev-components/DefinitionList';

interface Station {
    id: string;
    achievementCode: string;
    solution: string;
    locationDescription: string;
}

interface Props {
    stations: Station[];
}

enum AnswerState {
    OPEN = 'open',
    CORRECT = 'correct',
    INCORRECT = 'incorrect'
}

const ScavengerHunt = ({ stations }: Props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [answerState, setAnswerState] = useState(AnswerState.OPEN);
    const [answerInput, setAnswerInput] = useState('');

    const sanitizedInput = useMemo(() => {
        return answerInput.trim().toLowerCase();
    }, [answerInput]);

    const stationId = searchParams.get('id');
    const stationIndex = stations.findIndex((station) => station.id === stationId);
    const station = stationIndex >= 0 ? stations[stationIndex] : undefined;

    if (!stationId || !station) {
        return (
            <div>
                <Admonition title="Unbekannter Posten" type="danger">
                    Öffnen Sie diese Seite, indem Sie den QR-Code bei einem Posten scannen.
                </Admonition>
            </div>
        );
    }

    const nextStation = stations[(stationIndex + 1) % stations.length];

    return (
        <div>
            Geben Sie hier das Lösungswort für Ihren aktuellen Posten ein und überprüfen Sie Ihre Antwort.
            <div className={styles.checkControls}>
                <TextInput
                    placeholder="Lösungswort eingeben"
                    readOnly={answerState === AnswerState.CORRECT}
                    onChange={(e) => setAnswerInput(e)}
                    value={answerInput}
                />
                <Button
                    icon={answerState === AnswerState.CORRECT ? mdiCheckCircleOutline : mdiProgressQuestion}
                    color={answerState === AnswerState.CORRECT ? 'success' : 'primary'}
                    iconSide="left"
                    text="Antwort prüfen"
                    disabled={answerState === AnswerState.CORRECT}
                    onClick={(e) => {
                        if (sanitizedInput === station.solution) {
                            setAnswerState(AnswerState.CORRECT);
                        } else {
                            setAnswerInput('');
                            setAnswerState(AnswerState.INCORRECT);
                        }
                    }}
                />
            </div>
            {answerState === AnswerState.CORRECT && (
                <Admonition type="success" title="Richtig!">
                    <div>
                        Das war die richtige Antwort. Notieren Sie sich nun den unten angezeigten
                        Achievement-Code auf Ihrem <b>Achievement-Blatt</b> und begeben Sie sich zum nächsten
                        Posten (oder zurück ins Klassenzimmer, falls Sie bereits alle Achievement-Codes
                        gesammelt haben).
                    </div>
                    <DefinitionList>
                        <dt>Achievement-Code</dt>
                        <dd>{station.achievementCode}</dd>
                        <dt>Nächster Posten</dt>
                        <dd>{nextStation.locationDescription}</dd>
                    </DefinitionList>
                </Admonition>
            )}
            {answerState === AnswerState.INCORRECT && answerInput === '' && (
                <Admonition type="danger" title="Leider falsch">
                    <div>Das war noch nicht die richtige Antwort. Versuchen Sie es nochmal!</div>
                </Admonition>
            )}
        </div>
    );
};

export default ScavengerHunt;
