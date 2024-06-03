import {observer} from "mobx-react";
import * as React from "react";
import {useEffect, useState} from "react";
import cipherlockPlayerStore from "@site/src/app/stores/CipherlockPlayerStore";
import Admonition from "@site/src/theme/Admonition";
import {sendCheckInRequest, sendOnboardingRequest} from "@site/src/app/components/cipherlock/shared/api";
import sharedStyles from "../shared/shared.module.scss";
import clsx from "clsx";
import {ErrorMessage} from "@site/src/app/components/cipherlock/shared/errors";

interface Props {
  serverUrl: string;
  gameId: string;
}

const CipherlockOnboarding = observer((props: Props) => {

  const [serverUrl, setServerUrl] = useState<string>();
  const [gameId, setGameId] = useState<string>();
  const [playerId, setPlayerId] = useState<string>();
  const [playerIdValid, setPlayerIdValid] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [checkInRequestPending, setCheckInRequestPending] = useState<boolean>(true);
  const [onboardingRequestPending, setOnboardingRequestPending] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerNameInputValid, setPlayerNameInputValid] = useState<boolean>(true);

  useEffect(() => {
    setServerUrl(props.serverUrl);
    setGameId(props.gameId);
    setPlayerId(cipherlockPlayerStore.playerId);
  }, []);

  useEffect(() => {
    cipherlockPlayerStore.updateGameValues(serverUrl, gameId);
  }, [serverUrl, gameId]);

  useEffect(() => {
    console.log({tag: 'update player id in hook', playerId});
    cipherlockPlayerStore.updatePlayerId(playerId);
  }, [playerId]);

  useEffect(() => {
    if (!!serverUrl && !!gameId) {
      checkIn().then(r => {
      });
    }
  }, [serverUrl, gameId, playerId]);

  function updatePlayerNameInput(newPlayerName: string) {
    setPlayerName(newPlayerName);
    if (newPlayerName.length >= 3 && newPlayerName.length < 15) {
      setPlayerNameInputValid(true);
    } else {
      setPlayerNameInputValid(false);
    }
  }

  async function checkIn() {
    setError('');

    let response: Response;
    try {
      response = await sendCheckInRequest(serverUrl, gameId, playerId);
    } catch (e) {
      setError(ErrorMessage.UNREACHABLE);
      console.log(e);
      return;
    } finally {
      setCheckInRequestPending(false);
    }

    if (response.status === 409) {
      setError(ErrorMessage.NO_GAME_ACTIVE);
      return;
    }

    if (response.status !== 200) {
      setError(ErrorMessage.UNKNOWN)
      console.log(response.status, await response.text());
      return;
    }

    const checkInResponse = await response.json();

    if (!checkInResponse.gameIdValid) {
      setError(ErrorMessage.WRONG_GAME)
      return;
    }

    setPlayerIdValid(checkInResponse.playerIdValid);
  }

  async function onboard() {
    setOnboardingRequestPending(true);

    let response: Response;
    try {
      response = await sendOnboardingRequest(serverUrl, gameId, playerName);
    } catch (e) {
      setError(ErrorMessage.UNREACHABLE);
      console.log(e);
      return;
    } finally {
      setOnboardingRequestPending(false);
    }

    const onboardingResponse = await response.json();
    if (response.status === 409) {
      if (!onboardingResponse.gameActive) {
        setError(ErrorMessage.NO_GAME_ACTIVE)
      }
      if (!onboardingResponse.gameIdValid) {
        setError(ErrorMessage.WRONG_GAME);
      }
      if (!onboardingResponse.playerNameAvailable) {
        setError('Dieser Name ist leider bereits vergeben.')
      }
      return;
    }

    if (response.status !== 200) {
      setError('Es ist ein unbekannter Fehler aufgetreten. Bitte kontaktiere den Spielleiter.')
      return;
    }

    setPlayerId(onboardingResponse.playerId);
  }

  return (
    <div>
      {!!error &&
        <Admonition type='danger' title='Fehler'>
          {error}
        </Admonition>
      }

      {playerIdValid && !error && !checkInRequestPending &&
        <Admonition type='key' title='Startklar!'>
          Alles bereit! Du bist startklar. 🚀
        </Admonition>
      }

      {!playerIdValid &&
        <div className={sharedStyles.inputForm}>
          <h3>Namen wählen</h3>
          <div>Wer bist du? Wer seid ihr? Gib dir oder eurem Team bitte einen Namen.</div>
          <input type='text'
                 className={clsx({[sharedStyles.invalid]: !playerNameInputValid})}
                 placeholder='Name...'
                 id='input-player-name'
                 value={playerName}
                 onChange={e => updatePlayerNameInput(e.target.value)}/>
          <button className='button button--primary'
                  onClick={onboard}
                  disabled={onboardingRequestPending || !playerNameInputValid}>Absenden
          </button>
        </div>
      }
    </div>
  );
});

export default CipherlockOnboarding;
