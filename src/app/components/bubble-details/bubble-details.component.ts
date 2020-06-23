/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import * as Highcharts2 from 'highcharts';

@Component({
    selector: 'mean-bubble-details',
    templateUrl: './bubble-details.component.html',
    styleUrls: ['./bubble-details.component.css',
        '../../shared/general-styles.css']
})
export class BubbleDetailsComponent implements OnInit {

    charts = Highcharts2;

    // Optional string, defaults to 'chart'.
    chartConstructor = 'chart';

    // Optional function, defaults to null.
    chartCallback = function (chart) { }

    // Optional boolean.
    updateFlag = false;

    // Optional boolean, defaults to false.
    oneToOneFlag = true;

    // Optional boolean, defaults to false.
    runOutsideAngularFlag = false;
    chartOptions = {}
    userDetails: User;

    constructor(private auth: AuthenticationService) {}

    ngOnInit() {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            this.initChart();
        })

    }

    initChart() {
        this.chartOptions = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Bubbel Geschiedenis'
            },
            subtitle: {
                text: 'Veranderingen van je bubbel over de tijd'
            },
            xAxis: {
                categories: ['Sessie 1', 'Sessie 2', 'Sessie 3', 'Sessie 4', 'Sessie 5', 'Sessie 6', 'Sessie 7']
            },
            yAxis: {
                title: {
                    text: 'Percentage (%)'
                },
                visible: true,
            },
            series: [
                {
                    name: 'Diversiteit van de inhoud',
                    color: 'yellow',
                    data: [],
                    tooltip: {
                        valueSuffix: '%'
                    }
                },
                {
                    name: 'Kennis en bewustzijn van filter bubbles',
                    color: 'blue',
                    data: [],
                    tooltip: {
                        valueSuffix: '%'
                    }
                }
            ]
        };
    }
}