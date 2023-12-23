export interface SectionMapping {
  section: string;
  material?: string;
  ignore?: string[];
  rename?: string;
  setLabel?: string;
}

export type ScriptConfig = SectionMapping[];
