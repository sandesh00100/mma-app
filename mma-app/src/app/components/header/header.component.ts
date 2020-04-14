import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { Subscription, Observable, fromEvent, iif } from 'rxjs';
import { MatDialog } from '@angular/material';
import { PreferencesComponent } from '../judge/preferences/preferences.component';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { logout } from '../judge/judge.actions';
import { Judge } from '../judge/judge.model';
import { isAuth, selectJudge, isNotAuth } from '../judge/judge.selector';
import { tap, map, debounce, distinct, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { MatchFilterMode, SearchResult, SearchResponse } from '../matchesExplorer/match.model';
import { addFilter } from '../matchesExplorer/matchesExplorer.actions';
import { MatchService } from '../matchesExplorer/match.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private judgeServiceListener: Subscription;
  filterOptions: MatchFilterMode[] = [MatchFilterMode.event, MatchFilterMode.fighter];
  isAuth$:Observable<boolean>;
  isNotAuth$:Observable<boolean>;
  searchResultsSubscription:Subscription;
  searchResults:SearchResult[];
  currentSearch:string;
  searchMode:MatchFilterMode = this.filterOptions[0];
  judge$:Observable<Judge>;

  username: string;

  @ViewChild("searchInput", {static: true}) input: ElementRef;
  constructor(private dialogService: MatDialog, private router: Router, private matchService: MatchService, private store: Store<AppState>) { }

  ngOnInit() {
    this.isAuth$ = this.store.pipe(
      select(isAuth),
    );
    
    this.isNotAuth$ = this.store.pipe(
      select(isNotAuth)
    );
    
    this.judge$ = this.store.pipe(
      select(selectJudge)
    );

    this.searchResultsSubscription = fromEvent(this.input.nativeElement, 'keyup')
    .pipe(
      map(
        (event:any) => event.target.value
      ),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(
        (search:string) => {
          if (search.length > 0){
            return this.matchService.search(search,this.searchMode.toLowerCase());
          } else {
            return [];
          }
        }
      ),
      tap(
        res => console.log(res)
      ),
      map(
        (res:SearchResponse) => res.searchResults
      )
    ).subscribe(
      (searchResults:SearchResult[]) => {
        this.searchResults = searchResults;
      }
    );
  }

  ngOnDestroy(): void {
    this.judgeServiceListener.unsubscribe();
    this.searchResultsSubscription.unsubscribe();
  }

  signout() {
    this.store.dispatch(logout());
  }

  openHistory() {
    this.router.navigate(["/history"]);
  }
  openPreferenceDialog() {
    this.dialogService.open(PreferencesComponent);
  }

  addFilter(){
    if (this.searchResults.length > 0) {
      this.currentSearch = "";
      this.store.dispatch(addFilter({filter:{
        mode:this.searchMode,
        searchResult:this.searchResults[0]
      }}));
    } else {
      // TODO: Give better error message
      console.log("Not valid");
    }
  }

  clearSearchResult(){
    console.log("Clearing search results");
    this.searchResults = [];
  }
}
