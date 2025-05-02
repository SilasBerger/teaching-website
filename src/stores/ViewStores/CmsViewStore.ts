import { CmsStore } from '@tdev-stores/CmsStore';
import iViewStore from './iViewStore';
import { action, computed, observable } from 'mobx';
import Dir from '@tdev-models/cms/Dir';

export default class CmsViewStore extends iViewStore<CmsStore> {
    @observable accessor showFileTree = false;
    @observable accessor isNavOverviewExpanded = false;
    @observable accessor openInlineMathEditor: string | null = null;
    @observable accessor _assetEntrypoint: Dir | null = null;

    constructor(parent: CmsStore) {
        super(parent);
    }

    @computed
    get assetEntrypoint() {
        if (this._assetEntrypoint) {
            return this._assetEntrypoint;
        }
        const { activeEntry } = this.store;
        if (!activeEntry) {
            return undefined;
        }
        if (activeEntry.type === 'dir') {
            return activeEntry;
        }
        return activeEntry.parent;
    }

    @action
    setAssetEntrypoint(entry: Dir | null) {
        this._assetEntrypoint = entry;
    }

    @action
    setShowFileTree(show: boolean) {
        this.showFileTree = show;
    }

    @action
    setIsNavOverviewExpanded(isExpanded: boolean) {
        this.isNavOverviewExpanded = isExpanded;
    }
    @action
    setOpenInlineMathEditor(id: string | null) {
        this.openInlineMathEditor = id;
    }

    cleanup() {
        // noop
    }
}
