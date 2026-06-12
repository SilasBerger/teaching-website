import directusApi from './directusBase';

export async function getFlag(): Promise<any> {
    return directusApi.get('e3586080-0d51-4e5f-aa03-639a840a2211');
}
