export interface Tasks {
  materialSync: MaterialSyncTask[];
  pathRename: PathRenameTask[];
  setLabel: SetLabelTask[];
}

export interface MaterialSyncTask {
  section: string;
  material: string;
  ignore: string[];
}

export interface PathRenameTask {
  section: string;
  newLastPathSegment: string;
}

export interface SetLabelTask {
  section: string;
  newLabel: string;
}
