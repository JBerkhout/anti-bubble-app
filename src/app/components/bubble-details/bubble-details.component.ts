/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import * as Highcharts2 from 'highcharts';
import { milestones, titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { MilestoneUpdatesService } from '../../services/milestone-updates.service';
import { UserService } from '../../services/user.service';

/**
 * This class handles most of the logic for displaying the details of the user's bubble. This includes a table with the
 * current bubble's data (points per category) and a chart with the user's bubble history. The actual displaying of
 * the user's current bubble is handled by bubble-visualisation.component.ts.
 */
@Component({
	selector: 'bubble-details-component',
	templateUrl: './bubble-details.component.html',
	styleUrls: ['./bubble-details.component.css',
		'../../shared/general-styles.css']
})

export class BubbleDetailsComponent implements OnInit {
	public data;
	public charts = Highcharts2;

	// Optional string, defaults to 'chart'.
	public chartConstructor = 'chart';

	// Optional function, defaults to null.
	public chartCallback = function () {
	};

	// Optional boolean.
	public updateFlag = false;

	// Optional boolean, defaults to false.
	public oneToOneFlag = true;

	// Optional boolean, defaults to false.
	public runOutsideAngularFlag = false;
	public chartOptions = {};
	private userDetails: User;

	/**
	 * BubbleDetailsComponent constructor.
	 * @param userService
	 * @param titleService
	 * @param milestoneUpdates
	 * @param snackBar
	 */
	constructor(
		private userService: UserService,
		private titleService: Title,
		private milestoneUpdates: MilestoneUpdatesService,
		private snackBar: MatSnackBar
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
			this.data = user.bubble;
			this.initChart();
		});

		this.milestoneUpdates.updateMilestone(milestones[3], 1).subscribe(data => {
			if (data.completed) {
				this.milestoneUpdates.updateScoreboard(`${new Date().toLocaleString('nl-NL', { year: 'numeric', month: 'numeric', day: 'numeric' })}: Je hebt de badge 'Nieuwsgierige Niels' verdiend!`).subscribe();
				this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Nieuwsgierige Niels\' verdiend! \uD83C\uDF89', 'X', {
					duration: 4000,
					panelClass: ['style-succes']
				});
			}
		});

		// Set page title.
		this.titleService.setTitle('Bubbel details' + titleTrail);
	}

	/**
	 * Initialization method for showing the user's bubble history.
	 * @return
	 */
	private initChart(): void {
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
				categories: ['Start', 'Sessie 1', 'Sessie 2', 'Sessie 3', 'Sessie 4', 'Sessie 5', 'Sessie 6', 'Sessie 7']
			},
			yAxis: {
				title: {
					text: 'Points'
				},
				visible: true
			},
			series: [
				{
					name: 'Online',
					color: 'grey',
					data: this.data.online,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Social',
					color: 'blue',
					data: this.data.social,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Mainstream',
					color: 'green',
					data: this.data.mainstream,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Category 1',
					color: 'red',
					data: this.data.category1,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Category 2',
					color: 'blue',
					data: this.data.category2,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Knowledge',
					color: 'yellow',
					data: this.data.knowledge,
					tooltip: {
						valueSuffix: 'pt'
					}
				},
				{
					name: 'Techsavvyness',
					color: 'green',
					data: this.data.techSavvy,
					tooltip: {
						valueSuffix: 'pt'
					}
				}
			]
		};
	}
}
