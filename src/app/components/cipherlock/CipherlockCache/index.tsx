import * as React from "react";
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import Admonition from "@site/src/theme/Admonition";
import cipherlockPlayerStore from "@site/src/app/stores/CipherlockPlayerStore";
import {sendCheckInRequest} from "@site/src/app/components/cipherlock/shared/api";
import {ErrorMessage} from "@site/src/app/components/cipherlock/shared/errors";

interface Props {
  questionId: string;
  children?: any;
}

const CipherlockCache = observer(({questionId, children}: Props) => {

  const [serverUrl, setServerUrl] = useState<string>();
  const [gameId, setGameId] = useState<string>();
  const [playerId, setPlayerId] = useState<string>();
  const [checkInPending, setCheckInPending] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setServerUrl(cipherlockPlayerStore.serverUrl);
    setGameId(cipherlockPlayerStore.gameId);
    setPlayerId(cipherlockPlayerStore.playerId);
  }, []);

  useEffect(() => {
    checkIn().then();
  }, [serverUrl, gameId, playerId]);

  async function checkIn() {
    setError('');

    const errorMsg = 'Hoppla! Da ist etwas schiefgelaufen... Lies bitte nochmal alle Spielinformationen durch und kontaktiere bei Bedarf den Spielleiter.';
    if (!serverUrl) {
      setError(errorMsg);
      return;
    }

    let response: Response;
    try {
      response = await sendCheckInRequest(serverUrl, gameId, playerId);
    } catch (e) {
      setError(ErrorMessage.UNREACHABLE);
      console.log(e);
      return;
    } finally {
      setCheckInPending(false);
    }

    if (response.status !== 200) {
      setError(errorMsg)
      return;
    }

    const checkInResponse = await response.json();
    if (!checkInResponse.success) {
      setError(errorMsg)
      return;
    }
  }

  return (
    <div>
      {!!error &&
        <Admonition type='danger' title='Fehler'>
          {error}
        </Admonition>
      }

      {!error && !checkInPending && children}
    </div>
  );
});

export default CipherlockCache;
