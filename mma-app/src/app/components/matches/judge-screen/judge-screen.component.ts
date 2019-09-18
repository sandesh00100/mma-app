import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../match.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-judge-screen',
  templateUrl: './judge-screen.component.html',
  styleUrls: ['./judge-screen.component.css']
})
export class JudgeScreenComponent implements OnInit {

  constructor(private matchService: MatchService, private route: ActivatedRoute) { }
  currentMatch: Match;

  ngOnInit() {
    // Don't fetch if we already have a match from the match-list-screen
    // Since we have the auth guard it will get it from the already fetched matches for now
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const matchId = paramMap.get('matchId');
      this.currentMatch = this.matchService.getLocalMatch(matchId);
      if (this.currentMatch == null){
        this.matchService.getMatch(matchId).subscribe(matchData => {
          const fetchedMatch = matchData.match;
          // Copy everything form fetched match but change the id
          this.currentMatch = {
            ...fetchedMatch,
            id:fetchedMatch._id
          };
        });
      }

    });
  }

}
