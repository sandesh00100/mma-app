import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from './match.service';
import { Subscription, Observable } from 'rxjs';
import { Match, Filter, Organization } from './match.model';
import { PageEvent, MatTabChangeEvent } from '@angular/material';
import { JudgeService } from '../judge/judge.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { isAuth, isNotAuth } from '../judge/judge.selector';
import { selectFilters, selectFilterState, selectAllMatches, areMatchesLoaded } from './matchesExplorer.selector';
import { removeFilter, updatePageOptions, updateOrg, getMatches} from './matchesExplorer.actions';
import { FilterState, filterStateToQuery } from './reducers/filter.reducer';
import { selectAllArticles } from './reducers/match.reducer';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-matches',
  templateUrl: './matchesExplorer.component.html',
  styleUrls: ['./matchesExplorer.component.css']
})
export class MatchExplorerComponent implements OnInit, OnDestroy {
  
  currentRouterLink:string = "/signin";
  isAuth$:Observable<boolean>;
  isNotAuth$:Observable<boolean>;
  // TODO: Might want to change from being hard coded
  organizations: Organization[] = [Organization.ufc, Organization.bellator, Organization.oneFc];
  currentOrgIndex: number = 0;
  private matchesSub: Subscription;
  private filterStateSub: Subscription;
  filters$: Observable<Filter[]>;
  filterState:FilterState;
  matches$: Observable<Match[]>;
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]
  currentPage: number = 1;
  isLoading: boolean = false;
  matchesAreLoaded$: Observable<boolean>;
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

    this.matches$ = this.store.pipe(
      select(selectAllMatches),
      tap(matches => {
        console.log("SELECTING ALL MATCHES")
        console.log(matches);
      })
    );

    this.matchesAreLoaded$ = this.store.pipe(
      select(areMatchesLoaded)
    );
    this.filterStateSub = this.store.pipe(
      select(selectFilterState)
    ).subscribe((filterState:FilterState) => {
        console.log("FILTER STATE");
        console.log(filterState);
        this.filterState = filterState;
    });

    // this.getListeners();
  }
  
  ngOnDestroy(): void {
    // this.matchesSub.unsubscribe();
    this.filterStateSub.unsubscribe();
  }
  
  // getListeners(){
  //   this.isLoading = true;
  //   this.matchesSub = this.matchService.getMatchUpdateListener().subscribe((matchData: {matches: Match[], maxMatch:number}) => {
  //       this.isLoading = false;
  //       // this.matches = matchData.matches;
  //       this.pageLength = matchData.maxMatch;
  //   });
  // }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.store.dispatch(updatePageOptions({currentPage:this.currentPage,pageSize:this.pageSize}));
    console.log("FILTER STATE");
    console.log(this.filterState);
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }
  
  onChangedTab(tabData: MatTabChangeEvent){
    this.isLoading = true;
    this.currentOrgIndex = tabData.index;
    this.store.dispatch(updateOrg({newOrg:this.organizations[this.currentOrgIndex]}));
    this.matchService.getMatches(this.pageSize,this.currentPage,this.organizations[this.currentOrgIndex]);
  }

  removeFilter(filterToRemove:Filter){
    this.store.dispatch(removeFilter({filter:filterToRemove}));
  }
}
