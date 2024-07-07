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

    @observable.ref
    imageEncryption: {imageDataUrl: string, srcImageLoaded: boolean, resultReady: boolean, mode: 'ECB' | 'CBC', key: string, iv: string} = {
        imageDataUrl: '',
        srcImageLoaded: false,
        resultReady: false,
        mode: 'ECB',
        key: '',
        iv: '',
    }

    @observable.ref
    polybios: {text: string, cipherText: string, source: 'text' | 'cipher'} = {
        text: '',
        cipherText: '',
        source: 'text',
    };

    @observable.ref
    primeFactorizationTiming: {
        digits: number,
        range: number[],
        stage: number,
        prime1: number,
        prime2: number,
        tPrime: number,
        measurements: { product: number; time: number }[],
        prod: number,
        tMult: number,
        tFact: number,
        factPrime1: number,
        factPrime2: number,
    } = {
        digits: 6,
        range: [0, 0],
        stage: 0,
        prime1: 0,
        prime2: 0,
        tPrime: -1,
        measurements: [],
        prod: 0,
        tMult: -1,
        tFact: -1,
        factPrime1: 0,
        factPrime2: 0,
    }

    @observable.ref
    skytale: {text: string, cipherText: string, key: number, source: 'text' | 'cipher'} = {
        text: '',
        cipherText: '',
        key: 2,
        source: 'text',
    };

    constructor(private root: RootStore) {
    }
}
