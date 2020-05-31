import { Component, OnInit, Input } from '@angular/core';
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
  @Input() isScoreCard: boolean;
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
    console.log("PAGE EVENT:");
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    console.log(this.isScoreCard);

    if (!this.isScoreCard) {
    } else {
      this.store.dispatch(updatePageOptions({currentPage:this.currentPage,pageSize:this.pageSize}));
    }
 }
 
  removeFilter(filterToRemove:Filter){
    this.store.dispatch(removeFilter({filter:filterToRemove}));
  }
}