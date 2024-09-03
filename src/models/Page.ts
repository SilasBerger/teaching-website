/**
 * A Markdown or MDX Page
 */

import { action, computed, observable } from 'mobx';
import { PageStore } from '../stores/PageStore';
import TaskState from './documents/TaskState';
import _ from 'lodash';
import iDocument from './iDocument';
import StudentGroup from './StudentGroup';

export default class Page {
    readonly store: PageStore;
    readonly id: string;

    @observable accessor primaryStudentGroupName: string | undefined = undefined;
    @observable accessor activeStudentGroupId: string | undefined = undefined;
    documentRootIds = observable.set<string>();

    constructor(id: string, store: PageStore) {
        this.id = id;
        this.store = store;
    }

    @action
    addDocumentRoot(doc: iDocument<any>) {
        this.documentRootIds.add(doc.documentRootId);
    }

    @computed
    get documentRoots() {
        return this.store.root.documentRootStore.documentRoots.filter(
            (doc) => this.documentRootIds.has(doc.id) && !doc.isDummy
        );
    }

    @computed
    get documents() {
        return this.documentRoots
            .flatMap((doc) => doc.firstMainDocument)
            .filter((d) => d?.root?.meta.pagePosition)
            .sort((a, b) => a!.root!.meta!.pagePosition - b!.root!.meta.pagePosition);
    }

    @computed
    get taskStates(): TaskState[] {
        return this.documentRoots
            .flatMap((doc) => doc.firstMainDocument)
            .filter((d): d is TaskState => d instanceof TaskState)
            .filter((d) => d?.root?.meta.pagePosition)
            .sort((a, b) => a!.root!.meta!.pagePosition - b!.root!.meta.pagePosition);
    }

    @action
    setPrimaryStudentGroupName(name?: string) {
        const group = this.store.root.studentGroupStore.findByName(name);
        if (group) {
            this.primaryStudentGroupName = group.name;
        } else {
            this.primaryStudentGroupName = undefined;
        }
    }

    @action
    loadOverview() {
        return this.store.loadAllDocuments(this);
    }

    @action
    toggleActiveStudentGroup(studentGroup: StudentGroup) {
        if (this.activeStudentGroupId === studentGroup.id) {
            this.activeStudentGroupId = undefined;
        } else {
            this.activeStudentGroupId = studentGroup.id;
        }
    }

    /**
     * the student group that is selected through the current page location
     */
    @computed
    get primaryStudentGroup() {
        return this.store.root.studentGroupStore.findByName(this.primaryStudentGroupName);
    }

    /**
     * the student group that is selected from the user as the "active" student group
     * --> task states will be filtered by this group
     */
    @computed
    get activeStudentGroup() {
        if (this.activeStudentGroupId) {
            return this.store.root.studentGroupStore.find(this.activeStudentGroupId);
        }
        if (this.primaryStudentGroup) {
            return this.primaryStudentGroup;
        }
        return undefined;
    }

    @computed
    get studentGroups() {
        if (this.primaryStudentGroup) {
            return [this.primaryStudentGroup, ...this.primaryStudentGroup.children];
        }
        return _.orderBy(this.store.root.studentGroupStore.studentGroups, ['name'], ['asc']);
    }

    @computed
    get taskStatesByUsers() {
        return _.groupBy(
            this.documentRoots
                .flatMap((dr) => dr.allDocuments)
                .filter((doc): doc is TaskState => doc instanceof TaskState)
                .filter((doc) => doc.isMain && doc.root?.meta.pagePosition)
                .filter((doc) =>
                    this.activeStudentGroup ? this.activeStudentGroup.userIds.has(doc.authorId) : true
                )
                .sort((a, b) => a.root!.meta.pagePosition - b.root!.meta.pagePosition),
            (doc) => doc.authorId
        );
    }
}
