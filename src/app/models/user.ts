/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Gender } from './gender';
import { Item } from './item';
import { Milestone } from './milestone';
import { Role } from './role';

export class User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	gender: Gender;
	password: string;
	salt: string;
	recoverPasswordToken: string;
	recoverPasswordExpires: Date;
	inventory: Item[];
	currency: number;
	milestones: Milestone[];
	classArray: string[];
	avatar: any;
	recentMilestones: string[];
	bubbleInit: boolean;
	labyrinthAnswers: number[];
	bubble: any;
}