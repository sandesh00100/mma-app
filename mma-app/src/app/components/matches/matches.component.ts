import { Component, OnInit } from '@angular/core';
import { MatchService } from './match.service';
import { Subscription } from 'rxjs';
import { Match } from './match.model';
import { PageEvent, MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  // TODO: Might want to change from being hard coded
  organizations: string[] = ['UFC', 'Bellator'];
  currentOrgIndex: number = 0;
  tempFighter1Img: string = "https://amp.businessinsider.com/images/5b0533fd1ae66272008b4f90-750-375.jpg";
  tempFighter2Img: string = "https://www.aljazeera.com/mritems/Images/2019/9/8/1cbece168fa24aefb2b37a739e83e59f_18.jpg";
  private matchesSub: Subscription;
  matches: Match[];
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]
  currentPage: number = 1;
  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getMatches(4,1,'UFC');
    this.getListeners();
  }

  getListeners(){
    this.matchesSub = this.matchService.getMatchUpdateListener().subscribe((matchData: {matches: Match[], maxMatch:number}) => {
        this.matches = matchData.matches;
        this.pageLength = matchData.maxMatch;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }
  
  onChangedTab(tabData: MatTabChangeEvent){
    this.currentOrgIndex = tabData.index;
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }
}
