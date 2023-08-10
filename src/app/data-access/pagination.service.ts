import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PaginationService {
  private readonly numberOfItemsPerPage = 10;

  private currentPage$ = new BehaviorSubject(this.numberOfItemsPerPage);
  private totalNumberOfItems$ = new BehaviorSubject(0);

  currentPage = toSignal(this.currentPage$);
  totalNumberOfItems = toSignal(this.totalNumberOfItems$);
  hasMoreItems = computed(() => {
    const currentPage = this.currentPage() ?? 0;
    const totalNumberOfItems = this.totalNumberOfItems() ?? 0;

    return currentPage < totalNumberOfItems;
  });

  nextPage() {
    if (this.hasMoreItems()) {
      this.currentPage$.next(
        this.currentPage$.value + this.numberOfItemsPerPage
      );
    }
  }

  setTotalNumberOfItems(totalNumberOfItems: number) {
    this.totalNumberOfItems$.next(totalNumberOfItems);
  }
}
