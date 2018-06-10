import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RepositoriesService } from '../../services/repositories.service';
import { prepareDailyActivity, commitCalender } from '../age/age.component';

@Component({
    selector: 'app-author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.styl']
})
export class AuthorComponent implements OnInit {
    subscription;
    author_data;
    author;
    repo;

    charts;
    active_days = 0;

    hours = Array.from({length: 24}, (_, i) => i);

    constructor(
        public repoService: RepositoriesService,
        public route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => this.getRepo(params)
        );
    }

    getRepo({name, author}: any) {
        this.repo = name;
        this.author = author;
        this.subscription = this.repoService.getRepoActivity(name)
            .subscribe(
                data => this.setRepoActivity(data)
            );
    }

    setRepoActivity(data) {
        this.author_data = data.by_authors[this.author];
        const daily = data.by_authors[this.author].daily;
        const commit_days = Object.keys(daily.commits);
        const {years, max_values, active_days} = prepareDailyActivity(commit_days, daily);
        this.setHeatmap(years, max_values.commits);
    }

    setHeatmap(years, max_commits) {
        this.charts = commitCalender(years, max_commits, 'commits');
    }
}
