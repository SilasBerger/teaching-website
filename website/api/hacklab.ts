import siteConfig from '@generated/docusaurus.config';
import directusApi from './directusBase';

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

export async function getFlag(): Promise<any> {
    return directusApi.get('e3586080-0d51-4e5f-aa03-639a840a2211');
}
