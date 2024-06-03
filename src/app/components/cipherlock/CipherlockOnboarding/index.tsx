import {observer} from "mobx-react";
import * as React from "react";
import {useEffect, useState} from "react";
import cipherlockPlayerStore from "@site/src/app/stores/CipherlockPlayerStore";
import Admonition from "@site/src/theme/Admonition";
import {sendCheckInRequest} from "@site/src/app/components/cipherlock/shared/api";

interface Props {
  serverUrl: string;
  gameId: string;
}

const CipherlockOnboarding = observer((props: Props) => {

  const [serverUrl, setServerUrl] = useState<string>();
  const [gameId, setGameId] = useState<string>();
  const [playerId, setPlayerId] = useState<string>();
  const [error, setError] = useState<string>();
  const [showChooseName, setShowChooseName] = useState<boolean>(false);
  const [checkInPending, setCheckInPending] = useState<boolean>(true);

  useEffect(() => {
    setServerUrl(cipherlockPlayerStore.serverUrl);
    setGameId(cipherlockPlayerStore.gameId);
    setPlayerId(cipherlockPlayerStore.playerId);
  }, []);

  useEffect(() => {
    cipherlockPlayerStore.updatePlayerId(playerId);
  }, [playerId]);

  async function checkIn() {
    setError('');

    let response: Response;
    try {
      response = await sendCheckInRequest(serverUrl, gameId);
    } catch (e) {
      setError(`Der Game Server nicht erreichbar.}`);
      console.log(e);
      return;
    }

    if (response.status === 409) {
      setError('Zurzeit ist kein Spiel aktiv.');
      return;
    }

    if (response.status !== 200) {
      setError('Es ist ein unbekannter Fehler aufgetreten. Bitte kontaktiere den Spielleiter.')
      console.log(response.status, await response.text());
      return;
    }

    const checkInResponse = await response.json();
    if (!checkInResponse.gameIdValid) {
      setError('Dieses Spiel ist momentan nicht aktiv.')
      return;
    }

    if (!checkInResponse.playerIdValid) {
      setShowChooseName(true);
      return;
    }

    setCheckInPending(false);
  }

  useEffect(() => {
    setServerUrl(props.serverUrl);
    setGameId(props.gameId);
    cipherlockPlayerStore.updateGameValues(serverUrl, gameId);
  }, []);

  useEffect(() => {
    if (!!serverUrl && !!gameId) {
      checkIn().then(r => {
      });
    }
  }, [serverUrl, gameId, playerId]);

  return (
    <div>

      {!!error &&
        <Admonition type='danger' title='Fehler'>
          {error}
        </Admonition>
      }

      {!showChooseName && !error && !checkInPending &&
        <Admonition type='key' title='Startklar!'>
          Alles bereit! Du bist startklar. 🚀
        </Admonition>
      }

      {showChooseName &&
        <div>Namen festlegen, onboarding call, check-in wiederholen</div>
      }
    </div>
  );
});

export default CipherlockOnboarding;
