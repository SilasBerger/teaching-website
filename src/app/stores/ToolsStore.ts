import {RootStore} from "@site/src/app/stores/rootStore";
import {observable} from "mobx";

type Source = 'text' | 'cipher';

export class ToolsStore {

    @observable.ref accessor caesar: { text: string, cipher: string, key: string, source: 'text' | 'cipher'; } = {
        text: '',
        cipher: '',
        key: 'D',
        source: 'text'
    };

    @observable.ref accessor frequencyAnalysis: {
        text: string,
        sortAlphabetic: boolean,
        onlyLetters: boolean,
        indicateUnusedChars: boolean;
    } = {
        text: 'Hallo',
        sortAlphabetic: true,
        onlyLetters: false,
        indicateUnusedChars: true,
    };

    @observable.ref accessor hashSha256: {text: string} = {
        text: '',
    };

    @observable.ref accessor imageEncryption: {
        imageDataUrl: string,
        srcImageLoaded: boolean,
        resultReady: boolean,
        mode: 'ECB' | 'CBC',
        key: string,
        iv: string;
    } = {
        imageDataUrl: '',
        srcImageLoaded: false,
        resultReady: false,
        mode: 'ECB',
        key: '',
        iv: '',
    };

    @observable.ref accessor polybios: {text: string, cipherText: string, source: 'text' | 'cipher'} = {
        text: '',
        cipherText: '',
        source: 'text',
    };

    @observable.ref accessor primeFactorizationTiming: {
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
    };

    @observable.ref accessor skytale: {text: string, cipherText: string, key: number, source: Source} = {
        text: '',
        cipherText: '',
        key: 2,
        source: 'text',
    };

    @observable.ref accessor substitution: {
        text: string,
        key: string,
        missingChars: string[],
        duplicatedChars: string[],
        cipherText: string,
        source: Source;
    } = {
        text: '',
        key: '',
        missingChars: [],
        duplicatedChars: [],
        cipherText: '',
        source: 'text',
    };

    @observable.ref accessor xorBlockCipher: {
        text: string,
        cipherText: string,
        key: string,
        mode: 'CBC' | 'ECB',
        iv: string,
        source: Source;
    } = {
        text: '',
        cipherText: '',
        key: '',
        mode: 'ECB',
        iv: '',
        source: 'text',
    };

    @observable.ref accessor pentacode: {text: string, penta: string, source: 'text' | 'penta'} = {
        text: '',
        penta: '',
        source: 'text',
    }

    @observable.ref
    pentacodePixelEditor: { penta: string, source: 'cell' | 'editor' | '' } = {
        penta: '00000 00000 00000 00000 00000',
        source: 'editor',
    };

    @observable.ref
    colorExchange: {
        colorA: number,
        colorB: number,
        colorS: number,
    } = {
        colorA: 60,
        colorB: 230,
        colorS: 100,
    }

    constructor(private root: RootStore) {
    }
}
