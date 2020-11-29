import { Component, OnInit } from '@angular/core';
import {IGameOverview} from './IGameOverview';

@Component({
  selector: 'app-available-games',
  templateUrl: './available-games.component.html',
  styleUrls: ['./available-games.component.css']
})

export class AvailableGamesComponent implements OnInit {

  availableGames: IGameOverview[] = [
    {owner:'test'},
    {owner:'test2'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
