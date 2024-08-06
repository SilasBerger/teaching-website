import { action, observable } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import StudentGroup from '../models/StudentGroup';
import iStore from './iStore';
import { create as apiCreate, all as apiAll } from '../api/studentGroup';

export class StudentGroupStore extends iStore {
    readonly root: RootStore;
    studentGroups = observable.array<StudentGroup>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    find = computedFn(
        function (this: StudentGroupStore, id?: string): StudentGroup | undefined {
            if (!id) {
                return;
            }
            return this.studentGroups.find((d) => d.id === id);
        },
        { keepAlive: true }
    );

    @action
    create(name: string, description: string, parentId: string) {
        return this.withAbortController(`create-${name}`, async (signal) => {
            return apiCreate({ name, description, parentId }, signal.signal).then(({ data }) => {
                const group = new StudentGroup(data, this);
                this.studentGroups.push(group);
                return group;
            });
        });
    }

    @action
    load() {
        return this.withAbortController('load-all', async (signal) => {
            return apiAll(signal.signal).then(({ data }) => {
                const groups = data.map((group) => new StudentGroup(group, this));
                this.studentGroups.replace(groups);
                return groups;
            });
        });
    }

    @action
    cleanup() {
        this.studentGroups.clear();
        this.abortControllers.forEach((ctrl) => {
            ctrl.abort('cleanup store');
        });
    }

    get users() {
        return this.root.userStore.users;
    }
}
