import useIsBrowser from '@docusaurus/useIsBrowser';
import { useStore } from '@tdev-hooks/useStore';

export const useIsLive = () => {
    const socketStore = useStore('socketStore');
    const isBrowser = useIsBrowser();
    return isBrowser && socketStore.isLive;
};
