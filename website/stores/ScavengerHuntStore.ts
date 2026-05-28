import { action, computed, observable } from 'mobx';
import iStore from '@tdev-stores/iStore';
import { RootStore } from '@site/src/stores/rootStore';
import YAML from 'yaml';
import {
    checkAnswer,
    getStationDescriptions,
    CheckAnswerResponse,
    StationDescription
} from '../api/scavengerHunt';

interface ScavengerHuntImportColumns {
    game_id: string;
    station_id: string;
    submission_time: string;
    creators: string;
    solution: string;
    location_description: string;
}

interface ScavengerHuntImportStation {
    id: string;
    achievement_code: string;
}

interface ScavengerHuntImportGame {
    stations: ScavengerHuntImportStation[];
}

export interface ScavengerHuntQrCodeEntry extends ScavengerHuntImportStation {
    gameId: string;
}

export interface ScavengerHuntImportData {
    columns: ScavengerHuntImportColumns;
    games: Record<string, ScavengerHuntImportGame>;
}

export class ScavengerHuntStore extends iStore<'load-stations' | 'check-answer'> {
    readonly root: RootStore;

    @observable.ref accessor gameId: string | null = null;
    @observable.ref accessor stationId: string | null = null;
    stationDescriptions = observable.array<StationDescription>([]);
    @observable.ref accessor answerInput = '';
    @observable.ref accessor lastCheckResult: CheckAnswerResponse | null = null;
    @observable.ref accessor loadError: string | null = null;
    @observable.ref accessor checkError: string | null = null;
    @observable.ref accessor importedConfig: ScavengerHuntImportData | null = null;
    @observable.ref accessor importedConfigFileName: string | null = null;
    @observable.ref accessor importError: string | null = null;
    @observable.ref accessor selectedImportedGameId: string | null = null;

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

    @computed
    get importedGameCount() {
        return Object.keys(this.importedConfig?.games || {}).length;
    }

    @computed
    get importedStationCount() {
        return Object.values(this.importedConfig?.games || {}).reduce((count, game) => {
            return count + game.stations.length;
        }, 0);
    }

    @computed
    get importedGameIds() {
        return Object.keys(this.importedConfig?.games || {});
    }

    @computed
    get selectedImportedGame() {
        if (!this.selectedImportedGameId || !this.importedConfig) {
            return null;
        }
        return this.importedConfig.games[this.selectedImportedGameId] || null;
    }

    @computed
    get selectedImportedStations(): ScavengerHuntQrCodeEntry[] {
        if (!this.selectedImportedGameId || !this.selectedImportedGame) {
            return [];
        }

        return this.selectedImportedGame.stations.map((station) => ({
            ...station,
            gameId: this.selectedImportedGameId as string
        }));
    }

    @computed
    get canGenerateQrCodes() {
        return (
            !!this.importedConfig && !!this.selectedImportedGameId && this.selectedImportedStations.length > 0
        );
    }

    @action
    resetImport() {
        this.importedConfig = null;
        this.importedConfigFileName = null;
        this.importError = null;
        this.selectedImportedGameId = null;
    }

    @action
    setSelectedImportedGameId(gameId: string | null) {
        this.selectedImportedGameId = gameId;
    }

    @action
    importConfigFromYaml(yamlContent: string, fileName: string) {
        this.importError = null;

        try {
            const parsed = YAML.parse(yamlContent);
            const validated = this.validateImportData(parsed);
            this.importedConfig = validated;
            this.importedConfigFileName = fileName;
            this.selectedImportedGameId = Object.keys(validated.games)[0] || null;
        } catch (error) {
            this.importedConfig = null;
            this.importedConfigFileName = null;
            this.importError =
                error instanceof Error ? error.message : 'Die YAML-Datei konnte nicht verarbeitet werden.';
            this.selectedImportedGameId = null;
            throw error;
        }
    }

    validateImportData(input: unknown): ScavengerHuntImportData {
        if (!input || typeof input !== 'object') {
            throw new Error('Die YAML-Datei muss ein Objekt mit columns und games enthalten.');
        }

        const candidate = input as Record<string, unknown>;
        const columns = candidate.columns;
        const games = candidate.games;

        if (!columns || typeof columns !== 'object' || Array.isArray(columns)) {
            throw new Error('Der Bereich columns fehlt oder ist ungültig.');
        }
        if (!games || typeof games !== 'object' || Array.isArray(games)) {
            throw new Error('Der Bereich games fehlt oder ist ungültig.');
        }

        const validatedColumns = this.validateColumns(columns as Record<string, unknown>);
        const validatedGames = this.validateGames(games as Record<string, unknown>);

        return {
            columns: validatedColumns,
            games: validatedGames
        };
    }

    validateColumns(columns: Record<string, unknown>): ScavengerHuntImportColumns {
        return {
            game_id: this.requireString(columns.game_id, 'columns.game_id'),
            station_id: this.requireString(columns.station_id, 'columns.station_id'),
            submission_time: this.requireString(columns.submission_time, 'columns.submission_time'),
            creators: this.requireString(columns.creators, 'columns.creators'),
            solution: this.requireString(columns.solution, 'columns.solution'),
            location_description: this.requireString(
                columns.location_description,
                'columns.location_description'
            )
        };
    }

    validateGames(games: Record<string, unknown>): Record<string, ScavengerHuntImportGame> {
        const entries = Object.entries(games);

        if (entries.length === 0) {
            throw new Error('Es muss mindestens ein Spiel mit Posten definiert sein.');
        }

        return Object.fromEntries(
            entries.map(([gameId, game]) => {
                if (!game || typeof game !== 'object' || Array.isArray(game)) {
                    throw new Error(`games.${gameId} ist ungültig.`);
                }

                const stations = (game as Record<string, unknown>).stations;
                if (!Array.isArray(stations) || stations.length === 0) {
                    throw new Error(`games.${gameId}.stations muss mindestens einen Posten enthalten.`);
                }

                return [
                    gameId,
                    {
                        stations: stations.map((station, index) => {
                            if (!station || typeof station !== 'object' || Array.isArray(station)) {
                                throw new Error(`games.${gameId}.stations[${index}] ist ungültig.`);
                            }

                            const candidate = station as Record<string, unknown>;
                            return {
                                id: this.requireString(candidate.id, `games.${gameId}.stations[${index}].id`),
                                achievement_code: this.requireString(
                                    candidate.achievement_code,
                                    `games.${gameId}.stations[${index}].achievement_code`
                                )
                            };
                        })
                    }
                ];
            })
        );
    }

    requireString(value: unknown, path: string): string {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error(`${path} muss als nicht-leerer Text vorhanden sein.`);
        }
        return value;
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
