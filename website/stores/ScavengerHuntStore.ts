import { action, computed, observable } from 'mobx';
import iStore from '@tdev-stores/iStore';
import { RootStore } from '@site/src/stores/rootStore';
import {
    checkAnswer,
    getStationDescriptions,
    CheckAnswerResponse,
    StationDescription
} from '../api/scavengerHunt';

export class ScavengerHuntStore extends iStore<'load-stations' | 'check-answer'> {
    readonly root: RootStore;

    @observable.ref accessor gameId: string | null = null;
    @observable.ref accessor stationId: string | null = null;
    stationDescriptions = observable.array<StationDescription>([]);
    @observable.ref accessor answerInput = '';
    @observable.ref accessor lastCheckResult: CheckAnswerResponse | null = null;
    @observable.ref accessor loadError: string | null = null;
    @observable.ref accessor checkError: string | null = null;

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    @computed
    get currentStationIndex() {
        if (!this.stationId) {
            return -1;
        }
        return this.stationDescriptions.findIndex((station) => station.station_id === this.stationId);
    }

    @computed
    get currentStation() {
        if (this.currentStationIndex < 0) {
            return undefined;
        }
        return this.stationDescriptions[this.currentStationIndex];
    }

    @computed
    get nextStation() {
        if (this.stationDescriptions.length === 0 || this.currentStationIndex < 0) {
            return undefined;
        }
        return this.stationDescriptions[(this.currentStationIndex + 1) % this.stationDescriptions.length];
    }

    @computed
    get anyHaveCreators() {
        return this.stationDescriptions.some((station) => this.creatorsLabel(station).length > 0);
    }

    @computed
    get isAnswerCorrect() {
        return this.lastCheckResult?.correct === true;
    }

    @computed
    get hasIncorrectResult() {
        return !!this.lastCheckResult && !this.lastCheckResult.correct;
    }

    @computed
    get canCheckAnswer() {
        return !!this.answerInput.trim() && !!this.gameId && !!this.stationId && !this.isAnswerCorrect;
    }

    @action
    creatorsLabel(station: StationDescription) {
        const creators = station.creators;
        if (!creators) {
            return '';
        }
        if (Array.isArray(creators)) {
            return creators.join(', ');
        }
        return creators;
    }

    @action
    setAnswerInput(value: string) {
        this.answerInput = value;
        this.checkError = null;
        if (this.hasIncorrectResult) {
            this.lastCheckResult = null;
        }
    }

    @action
    resetRound() {
        this.answerInput = '';
        this.lastCheckResult = null;
        this.checkError = null;
    }

    @action
    loadStations(gameId: string, stationId: string) {
        const changedGame = this.gameId !== gameId;
        const changedStation = this.stationId !== stationId;
        this.gameId = gameId;
        this.stationId = stationId;
        this.loadError = null;
        if (changedGame || changedStation) {
            this.resetRound();
        }

        return this.withAbortController('load-stations', async (ct) => {
            return getStationDescriptions(gameId, ct.signal)
                .then(
                    action((descriptions) => {
                        this.stationDescriptions.replace(descriptions);
                        if (!this.currentStation) {
                            this.loadError = 'Unbekannter Posten für dieses Spiel.';
                        }
                    })
                )
                .catch(
                    action((error: unknown) => {
                        this.loadError =
                            error instanceof Error
                                ? error.message
                                : 'Die Posten konnten nicht geladen werden.';
                        throw error;
                    })
                );
        });
    }

    @action
    checkAnswer() {
        if (!this.gameId || !this.stationId || !this.answerInput.trim()) {
            return Promise.resolve();
        }

        this.checkError = null;

        return this.withAbortController('check-answer', async (ct) => {
            return checkAnswer(
                {
                    game_id: this.gameId as string,
                    station_id: this.stationId as string,
                    answer: this.answerInput.trim()
                },
                ct.signal
            )
                .then(
                    action((result) => {
                        this.lastCheckResult = result;
                        if (!result.correct) {
                            this.answerInput = '';
                        }
                    })
                )
                .catch(
                    action((error: unknown) => {
                        this.checkError =
                            error instanceof Error
                                ? error.message
                                : 'Die Antwort konnte nicht geprüft werden.';
                        throw error;
                    })
                );
        });
    }
}
