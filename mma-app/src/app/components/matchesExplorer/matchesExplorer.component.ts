import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Match, Organization } from './match.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { isAuth, isNotAuth } from '../judge/judge.selector';
import { selectFilterState, selectAllMatches, areMatchesLoaded } from './matchesExplorer.selector';
import { FilterState } from '../matchfilter/reducers';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-matches',
  templateUrl: './matchesExplorer.component.html',
  styleUrls: ['./matchesExplorer.component.css']
})
export class MatchExplorerComponent implements OnInit{
  
  currentRouterLink:string = "/signin";
  isAuth$:Observable<boolean>;
  isNotAuth$:Observable<boolean>;
  // TODO: Might want to change from being hard coded
  organizations: Organization[] = [Organization.ufc, Organization.bellator, Organization.oneFc];
  currentOrgIndex: number = 0;
  matches$: Observable<Match[]>;
  filter$: Observable<FilterState>;
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]
  currentPage: number = 1;
  isLoading: boolean = false;
  matchesAreLoaded$: Observable<boolean>;
  constructor( private store: Store<AppState>) { }

  ngOnInit() {
    //this.matchService.getMatches(this.pageSize,1,'UFC');
    this.isAuth$ = this.store.pipe(
      select(isAuth)
    );

    this.isNotAuth$ = this.store.pipe(
      select(isNotAuth)
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

    this.filter$ = this.store.pipe(
      select(selectFilterState)
    )

  }
} 