export interface TrackedElementConfig {
    src: string;
    dst: string;
    ignore?: string[];
    protect?: string[];
}

export interface Config {
    tdevPath: string;
    expectedTdevBranch: string;
    trackedElements: TrackedElementConfig[];
    watchedElements: string[];
}
