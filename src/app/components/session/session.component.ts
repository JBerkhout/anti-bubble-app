import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchage.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { beforeUnload } from '../../../../constants';

@Component({
    selector: 'mean-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css',
        '../../shared/general-styles.css']
})

export class SessionComponent implements OnInit {
    userDetails: User;
    players = [];
    pin;
    gameData;
    playerCount = 0;
    activity;
    gameStarted;
    interval;
    gameFinished = false;
    leaveByHomeButton = false;
    enableQuestions: boolean = true;
    pairs;
    randomGroups: boolean = false;

    constructor(
        private authenticationService: AuthenticationService,
        private socketService: SocketIOService,
        private data: DataService,
        private router: Router,
        private sessionService: SessionService,
    ) { }

    ngOnInit(): void {
        this.gameStarted = false;
        this.gameData = this.getGameData();
        if (this.gameData == undefined) {
            
            // Going to session page but not having joined a session redirects a user back to the home page.
            this.router.navigate(['home']);
        } else {
            if (this.gameData.teams != undefined && this.gameData.teams === "random") {
                this.randomGroups = true;
            }
    
            // Get pin of the session from the dataservice
            this.data.currentMessage.subscribe(message => {
                if (message) {
                    this.pin = message;
                    this.socketService.pin = message;
                }
            });
    
            this.authenticationService.profile().subscribe(user => {
                this.userDetails = user;
    
                if (this.userDetails.role == "teacher") {
                    this.socketService.listenForUpdates(newPlayer => { // Callback that gets called whenever a player connects with the session.
                        this.players.push(newPlayer); // Add player to the list.
                        // Create a tablerow with a textnode that contains the player's name.
                        let tableRow = document.createElement("tr");
                        tableRow.appendChild(document.createTextNode(newPlayer.firstName + " " + newPlayer.lastName));
                        tableRow.classList.add("player");
                        if (!this.randomGroups) {
                            let input = document.createElement("input");
                            input.setAttribute("placeholder", "Team nr");
                            input.setAttribute("id", newPlayer.email);
                            input.setAttribute("type", "number");
                            input.classList.add("teamInput");
                            tableRow.appendChild(input);
                        }
                        let table = document.getElementsByClassName("sessionTable")[0];
                        table.appendChild(tableRow); // Append the tablerow to the table.
    
                        this.playerCount = this.playerCount + 1; //Display number of players in top right corner.
    
                    }, removedPlayer => { // Gets called when a player leaves the session.
                        this.players = this.players.filter(x => x.email != removedPlayer.email); // Remove player from the list.
    
                        // Remove player from DOM.
                        let htmlPlayers = document.getElementsByClassName("player"); // Get all tr's with class player.
                        for (let i = 0; i < htmlPlayers.length; i++) {
                            if (htmlPlayers[i].childNodes[0].textContent == removedPlayer.name) { // If the name is equal to removed player.
                                htmlPlayers[i].remove(); // Remove the node.
                            }
                        }
    
                        this.playerCount = this.playerCount - 1; // Display number of players in top right corner.
                    });
    
                    // Call function that listens for students to submit answers.
                    this.socketService.listenForSubmits((data) => { // Receive answer from student.
    
                        // Add answer to screen using DOM manipulation.
                        var submitTable = document.getElementsByClassName('submitTable')[0];
                        var tablerow = document.createElement('tr');
                        tablerow.innerHTML = `<strong>${data.player.name}:</strong> ${data.message}<br>`
                        submitTable.appendChild(tablerow);
                        this.enableQuestions = false; // teacher cannot send any questions after having received at least one answer
                    });
                }
            });
    
            // Show confirm when trying to refresh or close the current tab with an ongoing session.
            window.addEventListener('beforeunload', beforeUnload);    
        }
    }

    // beforeUnload(e) {
    //     e.returnValue = "Weet je zeker dat je de sessie wilt verlaten?";
    //     return "Weet je zeker dat je de sessie wilt verlaten?";
    // }

    logoutButton() {
        return this.authenticationService.logout();
    }

    /** Function that calls the leave session function in the socket io service. */
    leaveSession() {
        this.socketService.leaveSession();
    }

    /** Function that returns if a student leaving the session was caused by the host disconnecting. */
    isHostDisconnected(): boolean {
        return this.socketService.hostDisconnected;
    }

    /** Function that returns the game data. */
    getGameData(): any {
        return this.socketService.gameData;
    }

    /** Function that sends the passed question to all students in the session. */
    sendQuestion(question: string) {
        this.socketService.sendQuestion(question);
    }

    /** Function that submits the passed answer to the host of the session. */
    submit(data) {
        this.socketService.studentSubmit(data);
    }

    /** Function that starts the game. Making it unable for students to join the session. */
    startGame() {
        this.gameStarted = true;
        this.socketService.startGame();

        let time = this.gameData?.duration * 60; // specified time for this activity (in seconds)
        this.initGame(this.gameData.game.name);
        this.startTimer(time);
    }

    initGame(game: string) {
        switch (game) {
            case "Naamloos Nieuws": break;
            case "Botsende Bubbels":
                if (this.randomGroups) {
                    this.pairStudents(null, 2, (pairs) => {
                        this.pairs = pairs;
                    });
                } else {
                    let pairs: String[][] = [];
                    let i = 0;
                    let inputs: any = document.getElementsByClassName("teamInput");
                    let playerList = this.players;
                    while (playerList.length > 0) {
                        let player = playerList.shift();
                        pairs[i] = [player];
                        let inputField: any = document.getElementById(player.email);
                        for (let j = 0; j < inputs.length; j++) {
                            if (inputs[j].id != player.email && inputs[j].value === inputField.value) {
                                pairs[i].push(playerList.filter(x => x.email === inputs[j].id)[0]);
                                playerList = playerList.filter(x => x.email != inputs[j].id);
                            }
                        }
                        i++;
                    }
                    this.pairStudents(pairs, 2, (pairs) => {
                        this.pairs = pairs;
                        console.log(this.pairs);
                    })
                }
                break;
            case "Alternatieve Antwoorden": break;
            case "Aanradend Algoritme": break;
        }
    }

    /** Function that makes timer count down at the top of the screen. */
    startTimer(time: number) {
        setTimeout(() => {
            // TODO: redirect naar home ofzo en update bubblewaarden alles
        }, time * 1000);

        // Create an interval that calls the given function every second. 
        // The function updates the value of the time at the top of the screen to be 1 second less than the previous second it was called.
        this.interval = setInterval(() => {
            if (time > 0) {
                time -= 1;
                let minutes = Math.floor(time / 60);
                let seconds = time % 60;
                if (seconds < 10) {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`;
                } else {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
                }
            } else {
                this.stopGame();
            }
        }, 1000);
    }

    /** Function that groups students. */
    pairStudents(groups: String[][], groupSize: Number, receivePairs) {
        this.socketService.pairStudents(groups, groupSize, pairs => {
            receivePairs(pairs);
        });
    }

    /** Function that stops the timer and game. */
    stopGame() {
        this.gameFinished = true;
        clearInterval(this.interval);
        let timeLeft = <HTMLElement[]><any>document.querySelectorAll('.timeLeft');
        timeLeft[0].style.color = "red";
        this.socketService.removeListeners(); // Remove all listeners so students cant submit answers.
    }

    /** Function that makes the host leave the session and the page. */
    leaveGame() {
        this.leaveSession();
        this.leaveByHomeButton = true;
        window.removeEventListener('beforeunload', beforeUnload);
        this.router.navigate(['home']);
    }
}
