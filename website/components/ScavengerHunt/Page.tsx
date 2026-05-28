import { observer } from 'mobx-react-lite';
import { useStore } from '@tdev-hooks/useStore';
import ScavengerHunt from './index';
import ScavengerHuntAdmin from './Admin';

const ScavengerHuntPage = observer(() => {
    const userStore = useStore('userStore');
    const canSeeAdmin = !!userStore.current?.hasElevatedAccess;

    return (
        <>
            <ScavengerHunt showLocationDescriptionTable />
            {canSeeAdmin && <ScavengerHuntAdmin />}
        </>
    );
});

export default ScavengerHuntPage;
