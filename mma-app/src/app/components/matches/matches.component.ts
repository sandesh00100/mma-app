import { Component, OnInit } from '@angular/core';
import { MatchService } from './match.service';
import { Subscription } from 'rxjs';
import { Match } from './match.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  organizations: string[] = ['UFC', 'Bellator'];

  private matchesSub: Subscription;
  matches = [
    {
      event:"UFC 222",
      fight:"Dustin Vs. Khabib"
    },
    {
      event:"UFC 223",
      fight:"Mcgregor Vs. Khabib"
    },
    {
      event:"UFC 225",
      fight:"Dustin Vs. Alverez"
    }
  ];
  pageLength: number = 10;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getMatches(4,1,'UFC');
  }

  getListeners(){
    this.matchesSub = this.matchService.getMatchUpdateListener().subscribe((matchData: {matches: Match[], maxMatch:number}) => {

    });
  }
}
