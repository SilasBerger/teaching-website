import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import ScavengerHunt from './index';
import ScavengerHuntAdmin from './Admin';

interface Props {
    settingsId: string;
}

const ScavengerHuntPage = observer(({ settingsId }: Props) => {
    const userStore = useStore('userStore');
    const canSeeAdmin = !!userStore.current?.hasElevatedAccess;

    return (
        <>
            <ScavengerHunt settingsId={settingsId} />
            {canSeeAdmin && <ScavengerHuntAdmin />}
        </>
    );
});

export default ScavengerHuntPage;
