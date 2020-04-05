import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from '../match.service';
import { Subscription, Observable } from 'rxjs';
import { Match, Filter } from '../match.model';
import { PageEvent, MatTabChangeEvent } from '@angular/material';
import { JudgeService } from '../../judge/judge.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { isAuth, isNotAuth } from '../../judge/judge.selector';
import { selectFilters } from '../match.selector';
import { createHostListener } from '@angular/compiler/src/core';
import { removeFilter } from '../match.actions';

@Component({
  selector: 'app-matches',
  templateUrl: './match-list-screen.component.html',
  styleUrls: ['./match-list-screen.component.css']
})
export class MatchesComponent implements OnInit, OnDestroy {
  
  currentRouterLink:string = "/signin";
  isAuth$:Observable<boolean>;
  isNotAuth$:Observable<boolean>;
  // TODO: Might want to change from being hard coded
  organizations: string[] = ['UFC', 'Bellator', 'One FC'];
  currentOrgIndex: number = 0;
  private matchesSub: Subscription;
  private authSub: Subscription;
  filters$: Observable<Filter[]>;
  matches: Match[];
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]
  currentPage: number = 1;
  isLoading: boolean = false;
  constructor(private matchService: MatchService, private judgeService: JudgeService, private store: Store<AppState>) { }

  ngOnInit() {
    this.matchService.getMatches(this.pageSize,1,'UFC');
    this.isAuth$ = this.store.pipe(
      select(isAuth)
    );

    this.isNotAuth$ = this.store.pipe(
      select(isNotAuth)
    );
    
    this.filters$ = this.store.pipe(
      select(selectFilters)
    );
    this.getListeners();
  }
  
  ngOnDestroy(): void {
    this.matchesSub.unsubscribe();
  }
  
  getListeners(){
    this.isLoading = true;
    this.matchesSub = this.matchService.getMatchUpdateListener().subscribe((matchData: {matches: Match[], maxMatch:number}) => {
        this.isLoading = false;
        this.matches = matchData.matches;
        this.pageLength = matchData.maxMatch;
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

  removeFilter(filterToRemove:Filter){
    this.store.dispatch(removeFilter({filter:filterToRemove}));
  }
}
