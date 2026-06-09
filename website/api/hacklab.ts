import siteConfig from '@generated/docusaurus.config';

const { HACKLAB_API_BASE_URL } = siteConfig.customFields as {
    HACKLAB_API_BASE_URL?: string;
};

export const isHackLabApiAvailable = !!HACKLAB_API_BASE_URL;

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

function getHacklabApiBaseUrl() {
    if (!HACKLAB_API_BASE_URL) {
        throw new Error('HACKLAB_API_BASE_URL is not configured.');
    }
    return HACKLAB_API_BASE_URL;
}

export async function genericGet<T>(
    flowId: string,
    queryString?: string,
    signal?: AbortSignal
): Promise<T | T[]> {
    const baseUrl = getHacklabApiBaseUrl();
    const response = await fetch(`${baseUrl}/${flowId}${queryString || ''}`, {
        method: 'GET',
        signal
    });

    const payload = await readJsonBody(response);
    const parsed = parseDirectusFlowResponse<T>(payload);
    return Array.isArray(parsed) ? parsed : [parsed];
}
