export interface ControlledElementConfig {
    src: string;
    dst: string;
    ignore?: string[];
    protect?: string[];
}

export interface Config {
    teachingDevPath: string;
    expectedBranch: string;
    controlledElements: ControlledElementConfig[];
    watch: string[];
}
