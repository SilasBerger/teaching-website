import { action, computed, observable } from 'mobx';
import iStore from '@tdev-stores/iStore';
import { RootStore } from '@site/src/stores/rootStore';
import * as ExcelJS from 'exceljs';
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

interface ScavengerHuntExcelRow {
    game_id: string;
    station_id: string;
    solution: string;
    creators: string;
    location_description: string;
    submissionTimeMs: number;
}

export interface ScavengerHuntQrCodeEntry extends ScavengerHuntImportStation {
    gameId: string;
}

export interface ScavengerHuntImportData {
    columns: ScavengerHuntImportColumns;
    games: Record<string, ScavengerHuntImportGame>;
}

function normalizeText(value: unknown) {
    return typeof value === 'string' ? value.trim() : String(value ?? '').trim();
}

function csvEscape(value: unknown) {
    const text = String(value ?? '');
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function getCellText(cell: ExcelJS.Cell) {
    const value = cell.value;
    if (value === null || value === undefined) {
        return '';
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object' && 'text' in value) {
        return String((value as { text?: unknown }).text ?? '');
    }
    return String(value);
}

function getCellSubmissionTimeMs(cell: ExcelJS.Cell) {
    const value = cell.value;
    if (value instanceof Date) {
        return value.getTime();
    }

    const parsed = Date.parse(cell.text || getCellText(cell));
    if (Number.isNaN(parsed)) {
        throw new Error(`Ungültige Fertigstellungszeit in Zeile ${cell.row}.`);
    }
    return parsed;
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
    @observable.ref accessor importedExcelFileName: string | null = null;
    @observable.ref accessor importedExcelError: string | null = null;
    @observable.ref accessor importedExcelRows: ScavengerHuntExcelRow[] = [];
    @observable.ref accessor exportedCsvFileName: string | null = null;
    @observable.ref accessor exportedCsvText: string | null = null;
    @observable.ref accessor exportedCsvError: string | null = null;

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

    @computed
    get importedExcelGameIds() {
        return [...new Set(this.importedExcelRows.map((row) => row.game_id))];
    }

    @computed
    get selectedImportedExcelRows() {
        if (!this.selectedImportedGameId) {
            return [];
        }
        return this.importedExcelRows.filter((row) => row.game_id === this.selectedImportedGameId);
    }

    @computed
    get canExportCsv() {
        return (
            !!this.importedConfig && !!this.importedExcelFileName && this.selectedImportedExcelRows.length > 0
        );
    }

    @computed
    get importedExcelRowCount() {
        return this.importedExcelRows.length;
    }

    @computed
    get selectedImportedExcelRowCount() {
        return this.selectedImportedExcelRows.length;
    }

    @action
    resetImport() {
        this.importedConfig = null;
        this.importedConfigFileName = null;
        this.importError = null;
        this.selectedImportedGameId = null;
        this.resetExcelImport();
    }

    @action
    resetExcelImport() {
        this.importedExcelFileName = null;
        this.importedExcelError = null;
        this.importedExcelRows = [];
        this.exportedCsvFileName = null;
        this.exportedCsvText = null;
        this.exportedCsvError = null;
    }

    @action
    setSelectedImportedGameId(gameId: string | null) {
        this.selectedImportedGameId = gameId;
    }

    @action
    async importExcelFromFile(file: File) {
        this.importedExcelError = null;
        this.exportedCsvError = null;
        this.exportedCsvFileName = null;
        this.exportedCsvText = null;

        if (!this.importedConfig) {
            this.importedExcelFileName = null;
            this.importedExcelRows = [];
            this.importedExcelError = 'Bitte laden Sie zuerst die YAML-Konfiguration hoch.';
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                throw new Error('Die Excel-Datei enthält kein Tabellenblatt.');
            }

            const headers: Record<string, number> = {};
            worksheet.getRow(1).eachCell((cell, columnNumber) => {
                const headerName = normalizeText(cell.text);
                if (headerName) {
                    headers[headerName] = columnNumber;
                }
            });

            const cols = this.importedConfig.columns;
            const requiredHeaders = [
                cols.game_id,
                cols.station_id,
                cols.submission_time,
                cols.creators,
                cols.solution,
                cols.location_description
            ];

            for (const requiredHeader of requiredHeaders) {
                if (!headers[requiredHeader]) {
                    throw new Error(`Die Excel-Datei enthält keine Spalte '${requiredHeader}'.`);
                }
            }

            const rowsByStation = new Map<string, ScavengerHuntExcelRow>();

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    return;
                }

                const gameId = normalizeText(row.getCell(headers[cols.game_id]).text);
                const stationId = normalizeText(row.getCell(headers[cols.station_id]).text).toLowerCase();
                if (!gameId || !stationId) {
                    return;
                }

                const rawRow: ScavengerHuntExcelRow = {
                    game_id: gameId,
                    station_id: stationId,
                    solution: normalizeText(row.getCell(headers[cols.solution]).text).toLowerCase(),
                    creators: normalizeText(row.getCell(headers[cols.creators]).text),
                    location_description: normalizeText(row.getCell(headers[cols.location_description]).text),
                    submissionTimeMs: getCellSubmissionTimeMs(row.getCell(headers[cols.submission_time]))
                };

                const rowKey = `${rawRow.game_id}::${rawRow.station_id}`;
                const existing = rowsByStation.get(rowKey);
                if (!existing || existing.submissionTimeMs <= rawRow.submissionTimeMs) {
                    rowsByStation.set(rowKey, rawRow);
                }
            });

            this.importedExcelRows = [...rowsByStation.values()].sort(
                (a, b) => a.submissionTimeMs - b.submissionTimeMs
            );
            this.importedExcelFileName = file.name;

            if (
                !this.selectedImportedGameId ||
                !this.importedExcelGameIds.includes(this.selectedImportedGameId)
            ) {
                this.selectedImportedGameId = this.importedExcelGameIds[0] || this.selectedImportedGameId;
            }
        } catch (error) {
            this.importedExcelFileName = null;
            this.importedExcelRows = [];
            this.importedExcelError =
                error instanceof Error ? error.message : 'Die Excel-Datei konnte nicht verarbeitet werden.';
            throw error;
        }
    }

    @action
    buildCsvExportForSelectedGame() {
        this.exportedCsvError = null;

        try {
            if (!this.importedConfig) {
                throw new Error('Bitte laden Sie zuerst die YAML-Konfiguration hoch.');
            }
            if (!this.importedExcelFileName) {
                throw new Error('Bitte laden Sie zuerst die Excel-Datei hoch.');
            }
            if (!this.selectedImportedGameId) {
                throw new Error('Bitte wählen Sie ein Spiel aus.');
            }

            const rows = this.selectedImportedExcelRows;
            if (rows.length === 0) {
                throw new Error('Für das ausgewählte Spiel wurden keine passenden Excel-Zeilen gefunden.');
            }

            const csvRows = rows.map((row) => {
                const achievementCode = this.lookupAchievementCode(
                    this.selectedImportedGameId as string,
                    row.station_id
                );
                const stationOrder = this.lookupStationOrder(
                    this.selectedImportedGameId as string,
                    row.station_id
                );

                return [
                    row.game_id,
                    row.station_id,
                    row.solution,
                    row.creators,
                    row.location_description,
                    achievementCode,
                    stationOrder
                ];
            });

            const csvText = [
                [
                    'game_id',
                    'station_id',
                    'solution',
                    'creators',
                    'location_description',
                    'achievement_code',
                    'station_order'
                ]
                    .map(csvEscape)
                    .join(','),
                ...csvRows.map((row) => row.map(csvEscape).join(','))
            ].join('\n');

            const csvFileName = this.importedExcelFileName.replace(/\.xlsx?$/i, '.csv');
            this.exportedCsvFileName = csvFileName;
            this.exportedCsvText = csvText;

            return {
                csvText,
                fileName: csvFileName,
                rowCount: rows.length
            };
        } catch (error) {
            this.exportedCsvFileName = null;
            this.exportedCsvText = null;
            this.exportedCsvError =
                error instanceof Error ? error.message : 'Der CSV-Export konnte nicht erstellt werden.';
            throw error;
        }
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

    findGameConfigOrFail(gameId: string) {
        if (!this.importedConfig) {
            throw new Error('Bitte laden Sie zuerst die YAML-Konfiguration hoch.');
        }

        const games = this.importedConfig.games;
        if (!(gameId in games)) {
            throw new Error(`Die Konfiguration enthält kein Spiel mit der ID '${gameId}'.`);
        }

        return games[gameId];
    }

    findStationAndIndex(gameConfig: ScavengerHuntImportGame, stationId: string) {
        return gameConfig.stations.findIndex((station) => station.id === stationId);
    }

    lookupAchievementCode(gameId: string, stationId: string) {
        const gameConfig = this.findGameConfigOrFail(gameId);
        const station = gameConfig.stations.find((entry) => entry.id === stationId);
        if (!station) {
            throw new Error(
                `Es konnte kein achievement_code für die Station '${stationId}' im Spiel '${gameId}' gefunden werden.`
            );
        }
        return station.achievement_code;
    }

    lookupStationOrder(gameId: string, stationId: string) {
        const gameConfig = this.findGameConfigOrFail(gameId);
        const index = this.findStationAndIndex(gameConfig, stationId);
        if (index < 0) {
            throw new Error(
                `Es konnte keine Reihenfolge für die Station '${stationId}' im Spiel '${gameId}' gefunden werden.`
            );
        }
        return index;
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
