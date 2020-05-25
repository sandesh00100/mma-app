import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { FilterState } from '../matchesExplorer/reducers/filter.reducer';
import { Observable } from 'rxjs';
import { selectFilterState } from '../matchesExplorer/matchesExplorer.selector';
import { PageEvent } from '@angular/material';
import { updatePageOptions, removeFilter } from '../matchesExplorer/matchesExplorer.actions';
import { Filter } from '../matchesExplorer/match.model';

@Component({
  selector: 'app-matchfilter',
  templateUrl: './matchfilter.component.html',
  styleUrls: ['./matchfilter.component.css']
})
export class MatchfilterComponent implements OnInit {
  filter$:Observable<FilterState>;
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20];
  currentPage: number = 1;
  isLoading: boolean = false;
  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    this.filter$ = this.store.pipe(
      select(selectFilterState)
    );
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.store.dispatch(updatePageOptions({currentPage:this.currentPage,pageSize:this.pageSize}));
    console.log("FILTER STATE");
    //console.log(this.filterState);
 }
 
  removeFilter(filterToRemove:Filter){
    this.store.dispatch(removeFilter({filter:filterToRemove}));
  }
}