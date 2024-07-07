import {RootStore} from "@site/src/app/stores/rootStore";
import {makeObservable, observable} from "mobx";

export class ToolStore {

    @observable
    caesar: {text: string, cipher: string, key: string, source: 'text' | 'cipher' } = {
        text: '',
        cipher: '',
        key: 'D',
        source: 'text'
    }

    constructor(private root: RootStore) {
        makeObservable(this);
    }
}
