import siteConfig from '@generated/docusaurus.config';

const { SCAVENGER_API_BASE_URL } = siteConfig.customFields as {
    SCAVENGER_API_BASE_URL?: string;
};

// TODO: Factor out into ENV.
const CHECK_ANSWER_FLOW_ID = '988f29b7-cb83-4efa-94c6-8c194f1c280f';
const STATION_DESCRIPTIONS_FLOW_ID = '946a0457-714c-4618-8ac7-95794df9638c';

export const isScavengerApiAvailable = !!SCAVENGER_API_BASE_URL;

export interface StationDescription {
    station_id: string;
    location_description: string;
    creators?: string | string[];
}

export interface CheckAnswerRequest {
    game_id: string;
    station_id: string;
    answer: string;
}

export interface CheckAnswerResponse {
    game_id: string;
    station_id: string;
    correct: boolean;
    achievement_code?: string;
}

interface DirectusFlowErrorBody {
    status?: string;
    error?: string;
}

function parseDirectusFlowResponse<T>(payload: unknown): T {
    if (payload && typeof payload === 'object') {
        const candidate = payload as Record<string, unknown>;

        if (candidate.status === 'error') {
            throw new Error(
                typeof candidate.error === 'string'
                    ? candidate.error
                    : 'Die Anfrage konnte nicht verarbeitet werden.'
            );
        }

        if ('data' in candidate) {
            return candidate.data as T;
        }

        return candidate as T;
    }

    throw new Error('Die API hat eine ungültige Antwort geliefert.');
}

async function readJsonBody(response: Response): Promise<unknown> {
    const responseText = await response.text();
    if (!responseText) {
        throw new Error('Die API hat keine Antwortdaten geliefert.');
    }

    try {
        return JSON.parse(responseText);
    } catch {
        throw new Error('Die API-Antwort konnte nicht gelesen werden.');
    }
}

function getScavengerApiBaseUrl() {
    if (!SCAVENGER_API_BASE_URL) {
        throw new Error('SCAVENGER_API_BASE_URL is not configured.');
    }
    return SCAVENGER_API_BASE_URL;
}

export async function checkAnswer(
    body: CheckAnswerRequest,
    signal?: AbortSignal
): Promise<CheckAnswerResponse> {
    const baseUrl = getScavengerApiBaseUrl();
    const response = await fetch(`${baseUrl}/${CHECK_ANSWER_FLOW_ID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal
    });

    const payload = await readJsonBody(response);
    return parseDirectusFlowResponse<CheckAnswerResponse>(payload);
}

export async function getStationDescriptions(
    gameId: string,
    signal?: AbortSignal
): Promise<StationDescription[]> {
    const baseUrl = getScavengerApiBaseUrl();
    const response = await fetch(
        `${baseUrl}/${STATION_DESCRIPTIONS_FLOW_ID}?game_id=${encodeURIComponent(gameId)}`,
        {
            method: 'GET',
            signal
        }
    );

    const payload = await readJsonBody(response);
    const parsed = parseDirectusFlowResponse<StationDescription[] | StationDescription>(payload);
    return Array.isArray(parsed) ? parsed : [parsed];
}
