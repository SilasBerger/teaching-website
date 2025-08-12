import Output from '@tdev-components/Struktogramm/Output';

export interface InputBlock {
    type: 'input';
    code: HTMLElement;
}

export interface OutputBlock {
    type: 'output';
    code: HTMLElement;
}

export interface StepBlock {
    type: 'step';
    code: HTMLElement;
}

export interface SubprogramBlock {
    type: 'subprogram';
    code: HTMLElement;
}
export interface RepeatBlock {
    type: 'repeat';
    code: HTMLElement;
    block: Program;
}

export interface IfBlock {
    type: 'if' | 'elif' | 'else';
    code: HTMLElement;
    block: Program;
}

export interface ConditionalBlock {
    type: 'conditional';
    code: HTMLElement;
    trueBlock: Program;
    falseBlock: Program;
}

export type Program = (
    | InputBlock
    | OutputBlock
    | StepBlock
    | SubprogramBlock
    | RepeatBlock
    | IfBlock
    | ConditionalBlock
)[];
