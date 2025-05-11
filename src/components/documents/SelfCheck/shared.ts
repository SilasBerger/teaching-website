import React from 'react';
import iSideEffect from '@tdev-models/SideEffects/iSideEffect';
import { DocumentType, TypeDataMapping } from '@tdev-api/document';
import DocumentRoot from '@tdev-models/DocumentRoot';
import { computed } from 'mobx';
import { SelfCheckStateType } from '@tdev-components/documents/SelfCheck/models';
import { NoneAccess } from '@tdev-models/helpers/accessPolicy';

interface SelfCheckContextType {
    solutionId: string;
    taskStateId: string;
}

export const SelfCheckContext = React.createContext<SelfCheckContextType | undefined>(undefined);

export class SelfCheckStateSideEffect extends iSideEffect<DocumentType.TaskState> {
    constructor(
        private readonly authorId: string,
        private readonly solutionDocRoot: DocumentRoot<DocumentType.Solution>
    ) {
        super('SelfCheckStateSideEffect');
    }

    @computed
    get transformer() {
        return (docData: TypeDataMapping[DocumentType.TaskState]) => {
            const authorsPermissionOnSolution = this.solutionDocRoot.permissionForUser(this.authorId);

            if (docData.state !== SelfCheckStateType.Reviewing) {
                return docData;
            }

            const solutionAvailable = !NoneAccess.has(authorsPermissionOnSolution);
            return {
                ...docData,
                state: solutionAvailable
                    ? SelfCheckStateType.Reviewing
                    : SelfCheckStateType.WaitingForSolution
            };
        };
    }
}
