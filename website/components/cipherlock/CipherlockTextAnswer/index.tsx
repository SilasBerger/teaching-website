import styles from './styles.module.scss';
import { useState } from 'react';
import Admonition from '@theme/Admonition';
import siteConfig from '@generated/docusaurus.config';
const { CIPHERLOCK_SERVER_URL } = siteConfig.customFields as { CIPHERLOCK_SERVER_URL?: string };

enum AnswerState {
    PENDING,
    CORRECT,
    INCORRECT,
    ERROR
}

interface Props {
    gameId: string;
    questionId: string;
    trim: boolean;
}

const SimpleTextAnswer = ({ gameId, questionId, trim }: Props) => {
    const [answer, setAnswer] = useState('');
    const [answerState, setAnswerState] = useState(AnswerState.PENDING);
    const [checkPending, setCheckPending] = useState(false);

    async function sendCheckRequest() {
        if (!answer) {
            return;
        }

        setCheckPending(true);
        setAnswerState(AnswerState.PENDING);

        const body = {
            gameId,
            questionId,
            answer: {
                text: trim ? answer.trim() : answer
            }
        };

        const response = await fetch(`${CIPHERLOCK_SERVER_URL}/caches/checkAnswer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.status !== 200) {
            setAnswerState(AnswerState.ERROR);
            console.log(response);
            console.log(await response.json());
            return;
        }

        const responseBody = await response.json();
        if (responseBody.correct) {
            setAnswerState(AnswerState.CORRECT);
        } else {
            setAnswerState(AnswerState.INCORRECT);
        }

        setAnswer('');
        setCheckPending(false);
    }

    return (
        <div>
            <div className={styles.answerContainer}>
                <input
                    type="text"
                    placeholder="Antwort eingeben..."
                    value={answer}
                    disabled={checkPending}
                    onChange={(event) => setAnswer(event.target.value)}
                />
                <button
                    className="button button--primary"
                    onClick={sendCheckRequest}
                    disabled={!answer || checkPending}
                >
                    Prüfen
                </button>
            </div>
            {answerState === AnswerState.ERROR && (
                <Admonition type="danger" title="Fehler">
                    Es ist ein unbekannter Fehler aufgetreten.
                </Admonition>
            )}
            {answerState === AnswerState.CORRECT && (
                <Admonition type="key" title="Richtig!">
                    Das war die korrekte Antwort. Die Box wird nun geöffnet.
                </Admonition>
            )}
            {answerState === AnswerState.INCORRECT && (
                <Admonition type="danger" title="Falsche Antwort">
                    Diese Antwort ist leider falsch. Bleib dran!
                </Admonition>
            )}
        </div>
    );
};

export default SimpleTextAnswer;
