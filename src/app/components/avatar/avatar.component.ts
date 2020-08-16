/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ShopService } from 'src/app/services/shop.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { AvatarDisplayComponent } from '../avatar-display/avatar-display.component';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'mean-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css',
        '../../shared/general-styles.css'],
    providers: [AvatarDisplayComponent]
})

export class AvatarComponent implements OnInit {
    userDetails: User;
    itemsShown = [];
    filteredAvatar = [];
    itemCategories: string[] = ['Hoofddeksel', 'Haar', 'Bril', 'Shirt', 'Broek', 'Schoenen', 'Medaille'];
    itemColumns: number;

    constructor(
        private shopService: ShopService,
        private avatarService: AvatarService,
        private avatarDisplay: AvatarDisplayComponent,
        private titleService: Title,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.shopService.shop('hoofddeksel').subscribe(shop => {
            this.userService.profile().subscribe(user => {
                this.userDetails = user;

                // Checks for items in the shop that the player bought
                for (let i = 0; i < shop.length; i++) {
                    if (user.inventory.find(x => x._id == shop[i]._id) != null) {
                        this.itemsShown.push(shop[i]);
                        this.filteredAvatar = this.filterAvatar();
                    }
                }
                this.avatarDisplay.showAvatar(user);
            });
        });

        this.setItemColumns();

        this.titleService.setTitle('Avatar' + environment.TITLE_TRAIL);
    }

    /** Method that assigns an item to the user's avatar in the database. */
    equip(item) {
        this.avatarService.equip(item).subscribe(data => {

            // Updates the image shown to the player without reloading the page.
            if (data.category == 'haar') {
                document.getElementById('haar1').setAttribute('src', data.imageFull2);
                document.getElementById('haar2').setAttribute('src', data.imageFull);
            }
            else{
                document.getElementById(data.category).setAttribute('src', data.imageFull);
            }
        });
    }

    /** Method to change the tab in the HTML and updates the shown items. */
    tabChange(event) {
        this.shopService.shop(event.tab.textLabel).subscribe(shop => {
            this.itemsShown = shop;
            this.filteredAvatar = this.filterAvatar();
        }, (err) => {
            console.error(err);
        });
    }

    /** Method to filter the avatar items to only show the items in the inventory/that the player bought. */
    filterAvatar(): AvatarComponent[] {
        return this.itemsShown.filter(x => {
            return this.userDetails.inventory.find(y => x._id == y._id) != null
        });
    }

    /** Method that sets the initial amount of columns based on screen width. */
    setItemColumns(): void {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 1000) {
            this.itemColumns = 3;
        } else if (screenWidth < 1000) {
            this.itemColumns = 2;
        }
    }

    /** Method that changes the amount of columns when the window size changes. */
    onResize(event): void {
        const screenWidth = event.target.innerWidth;

        if (screenWidth >= 1000) {
            this.itemColumns = 3;
        } else if (screenWidth < 1000) {
            this.itemColumns = 2;
        }
    }
}