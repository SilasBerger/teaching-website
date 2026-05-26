import Admonition from '@theme/Admonition';
import styles from './style.module.scss';
import { useLocation } from '@docusaurus/router';

interface Station {
    id: string;
    solution: string;
    locationDescription: string;
}

interface Props {
    stations: Station[];
}

const ScavengerHunt = ({ stations }: Props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

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
            <div>Lösung: {station.solution}</div>
            <div>Hier finden Sie den nächsten Posten: {nextStation.locationDescription}</div>
        </div>
    );
};

export default ScavengerHunt;
