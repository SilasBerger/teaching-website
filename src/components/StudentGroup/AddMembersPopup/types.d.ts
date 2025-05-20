export interface AddMembersPopupProps {
    studentGroup: StudentGroupModel;
    onImported: (ids: string[], fromGroup?: StudentGroupModel) => void;
}

export type _AddMembersPopupPropsInternal = AddMembersPopupProps & {
    popupRef: React.RefObject<PopupActions | null>;
};
