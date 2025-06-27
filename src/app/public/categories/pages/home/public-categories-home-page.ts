import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource} from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
/*  */
import {Pagination,PaginationService,iPagination} from "@app/shared/components/pagination"
import { CategoryService } from '@app/public/categories/services';

import {IsEmptyComponent,IsErrorComponent,IsLoadingComponent} from '@app/shared/components/resource-status';
import { PublicCategoryCard } from "./components/";

@Component({
  selector: 'app-public-categories-home-page',
  imports: [IsEmptyComponent, IsErrorComponent, IsLoadingComponent, PublicCategoryCard,Pagination],
  templateUrl: './public-categories-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicCategoriesHomePage {
   private route: ActivatedRoute = inject(ActivatedRoute);
   public paginationService: PaginationService = inject(PaginationService);
   private categoryService: CategoryService = inject(CategoryService);

   categoriesRs=rxResource({
    stream:()=>
      combineLatest([
        this.route.queryParams.pipe(map((params)=>+params['_page'] || 1)),
      ]).pipe(
        switchMap(([currentPage])=>
          this.categoryService.getData({
            _page: currentPage,
            _per_page:5
          })
      
      )
      )
   });

   paginationData=computed<iPagination|null>(()=>{
    const data=this.categoriesRs.value();
    if(!data) return null;

    // extraer datos de paginacion

    const {data:items,...pagination}=data;
    return pagination as iPagination;
   });
}


export default PublicCategoriesHomePage;