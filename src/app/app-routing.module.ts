import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewkslComponent } from './newksl/newksl.component';
import { ResolveService } from './service/resolve.service';
import { Sss1Component } from './sss1/sss1.component';

export const routes: Routes = [
  { path: '', component: NewkslComponent, resolve: { msg: ResolveService } }
  //{path:'' ,component:Sss1Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { preloadingStrategy: PreloadAllModules }//预加载
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
