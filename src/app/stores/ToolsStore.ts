import {RootStore} from "@site/src/app/stores/rootStore";
import {observable} from "mobx";

export class ToolsStore {

    @observable.ref
    caesar: { text: string, cipher: string, key: string, source: 'text' | 'cipher'; } = {
        text: '',
        cipher: '',
        key: 'D',
        source: 'text'
    };

    @observable.ref
    frequencyAnalysis: {text: string, sortAlphabetic: boolean, onlyLetters: boolean, indicateUnusedChars: boolean} = {
        text: 'Hallo',
        sortAlphabetic: true,
        onlyLetters: false,
        indicateUnusedChars: true,
    }

    @observable.ref
    hashSha256: {text: string} = {
        text: '',
    };

    constructor(private root: RootStore) {
    }
}
