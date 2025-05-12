export interface SectionMapping {
    section: string;
    material: string;
    ignore?: string[];
}

export interface MarkersDefinition {
    [key: string]: number;
}

export interface ScriptConfig {
    markers: MarkersDefinition;
    mappings: SectionMapping[];
}
