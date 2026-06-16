import directusApi from './directusBase';

export async function getFlag(): Promise<any> {
    return directusApi.get('e3586080-0d51-4e5f-aa03-639a840a2211');
}

export async function getPasswordObject(): Promise<any> {
    return directusApi.get('d6b3bf4a-e722-4f81-a1bd-ceb0b74c7e94');
}
