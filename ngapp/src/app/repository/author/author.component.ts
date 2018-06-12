import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RepositoriesService } from '../../services/repositories.service';
import { prepareDailyActivity, commitCalender } from '../age/age.component';
import { makeColor } from '../commits/commits.component';

@Component({
    selector: 'app-author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.styl']
})
export class AuthorComponent implements OnInit, OnDestroy {
    subscriptions = new Set<any>();
    author_data;
    author;
    lines: any = {};
    summary: any = {};
    repo;

    active_days = 0;
    years;
    max_values = {
        commits: 0,
        insertions: 0,
        deletions: 0
    };
    charts = [];
    chart_type = 'commits';

    hours = Array.from({length: 24}, (_, i) => i);
    hour_colors = [];

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

    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    getRepo({name, author}: any) {
        this.repo = name;
        this.author = author;
        this.subscriptions.add(
            this.repoService.getRepoActivity(name)
                .subscribe(data => this.setRepoActivity(data))
        );
        this.subscriptions.add(
            this.repoService.getAuthors(name)
                .subscribe(data => this.setAuthor(data))
        );
        this.subscriptions.add(
            this.repoService.getRepoSummary(name)
                .subscribe(data => this.setLines(data))
        );
    }

    setRepoActivity(data) {
        const daily = data.by_authors[this.author].daily;
        const commit_days = Object.keys(daily.commits);
        const {years, max_values, active_days} = prepareDailyActivity(commit_days, daily);
        this.active_days = active_days;
        this.years = years;
        this.max_values = max_values;
        this.setHeatmap(this.chart_type);

        this.author_data = data.by_authors[this.author];
        this.setHourColors();
    }

    setHeatmap(chart_type) {
        this.chart_type = chart_type;
        this.charts = commitCalender(this.years, this.max_values[chart_type], chart_type);
    }

    setHourColors() {
        this.hour_colors = this.hours.map(h => {
            return {
                commits: makeColor(this.author_data.at_hour.commits[h], this.max_values.commits),
                insertions: makeColor(this.author_data.at_hour.insertions[h], this.max_values.insertions),
                deletions: makeColor(this.author_data.at_hour.deletions[h], this.max_values.deletions)
            };
        });
    }

    setAuthor(data) {
        this.lines = {
            lines: data.lines[this.author],
            files: data.files[this.author],
        };
    }

    setLines(data) {
        const summary = {};
        data.forEach(x => summary[x.key] = x.value);
        this.summary = summary;
    }
}
