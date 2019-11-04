import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from '../match.service';
import { Subscription } from 'rxjs';
import { Match } from '../match.model';
import { PageEvent, MatTabChangeEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-matches',
  templateUrl: './match-list-screen.component.html',
  styleUrls: ['./match-list-screen.component.css']
})
export class MatchesComponent implements OnInit, OnDestroy {
  
  currentRouterLink:string = "/signin";
  isAuth:boolean = false;
  // TODO: Might want to change from being hard coded
  organizations: string[] = ['UFC', 'Bellator'];
  currentOrgIndex: number = 0;
  tempFighter1Img: string = "https://amp.businessinsider.com/images/5b0533fd1ae66272008b4f90-750-375.jpg";
  tempFighter2Img: string = "https://www.aljazeera.com/mritems/Images/2019/9/8/1cbece168fa24aefb2b37a739e83e59f_18.jpg";
  private matchesSub: Subscription;
  private authSub: Subscription;
  matches: Match[];
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]
  currentPage: number = 1;
  isLoading: boolean = false;
  constructor(private matchService: MatchService, private authService: AuthService) { }

  ngOnInit() {
    this.matchService.getMatches(this.pageSize,1,'UFC');
    this.isAuth = this.authService.userIsAuth();
    this.getListeners();
  }
  
  ngOnDestroy(): void {
    this.matchesSub.unsubscribe();
    this.authSub.unsubscribe();
  }
  
  getListeners(){
    this.isLoading = true;
    this.matchesSub = this.matchService.getMatchUpdateListener().subscribe((matchData: {matches: Match[], maxMatch:number}) => {
        this.isLoading = false;
        this.matches = matchData.matches;
        this.pageLength = matchData.maxMatch;
    });

    this.authSub = this.authService.getAuthStatusListener().subscribe(auth => {
      this.isAuth = auth;
      console.log(this.currentRouterLink);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }
  
  onChangedTab(tabData: MatTabChangeEvent){
    this.isLoading = true;
    this.currentOrgIndex = tabData.index;
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }
}
