import axios, { AxiosInstance } from 'axios';
import { DIRECTUS_URL } from './directusConfig';

export namespace DirectusApi {
    export const BASE_API_URL = flowApiUrl();

    function flowApiUrl() {
        return `${DIRECTUS_URL}/flows/trigger/`;
    }
}

const directusApi: AxiosInstance = axios.create({
    baseURL: DirectusApi.BASE_API_URL,
    withCredentials: false,
    headers: {}
});

export default directusApi;
