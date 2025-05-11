import useBaseUrl from '@docusaurus/core/lib/client/exports/useBaseUrl';
import Button from '@tdev-components/shared/Button';
import { mdiAirHorn, mdiAlarm, mdiBell, mdiPlay, mdiStop } from '@mdi/js';
import styles from './styles.module.scss';

interface SoundEffect {
    name: string;
    soundfile: string;
    icon?: string;
}

const Soundboard = () => {
    const baseUrl = useBaseUrl('/sounds/soundboard');
    let audio: HTMLAudioElement;

    const sounds: SoundEffect[] = [
        { name: 'Airhorn', icon: mdiAirHorn, soundfile: 'airhorn.mp3' },
        { name: 'The Good Bell', icon: mdiBell, soundfile: 'the_good_bell.mp3' },
        { name: 'Old Alarm Clock', icon: mdiAlarm, soundfile: 'old_alarm_clock.mp3' }
    ];

    const play = (sound: SoundEffect) => {
        const url = `${baseUrl}/${sound.soundfile}`;
        try {
            audio = new Audio(url);
            audio.play().then();
        } catch (ex) {
            console.log(`Could not play sound ${url}`, ex);
        }
    };

    const stopPlayback = () => {
        audio && audio.pause();
    };

    return (
        <div>
            <div className={styles.buttons}>
                {sounds.map((sound) => (
                    <Button
                        onClick={() => play(sound)}
                        icon={sound.icon ?? mdiPlay}
                        text={sound.name}
                        iconSide="left"
                    />
                ))}
            </div>
            <Button icon={mdiStop} text="Stop" iconSide="left" color="red" onClick={stopPlayback} />
        </div>
    );
};

export default Soundboard;
