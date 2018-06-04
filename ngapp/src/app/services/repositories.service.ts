import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RepositoriesService {
    endpoint = '/data/';

    constructor(
        public http: HttpClient
    ) {
    }

    get(path) {
        return this.http.get(`${this.endpoint}${path}`);
    }

    getRepositories() {
        return this.get('repos.json');
    }

    getRepoSummary(name) {
        return this.get(`${name}/summary.json`);
    }

    getRepoActivity(name) {
        return this.get(`${name}/activity.json`);
    }

    getLines(name) {
        return this.get(`${name}/lines.json`);
    }

    getFilesHistory(name) {
        return this.get(`${name}/files-history.json`);
    }

    getTags(name) {
        return this.get(`${name}/tags.json`);
    }

    getBranches(name) {
        return this.get(`${name}/branches.json`);
    }
}
