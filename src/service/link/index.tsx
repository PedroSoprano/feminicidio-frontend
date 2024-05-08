import { api } from "../api";

export function createVictims(data: any){
    return api.post('/api/vitimas/', data)
};
export function findSearch(){
    return api.get('/api/history/lastSearch')
};
export function findContent(idSite: string){
    return api.get('/api/site/'+idSite)
};
export async function findSearchLinks(search?: { column: string; value: string; }) {
    if (search) {
        return api.get(`/api/site?${encodeURIComponent(search.column)}=${encodeURIComponent(search.value)}`);
    } else {
        return api.get('/api/site');
    }
}

