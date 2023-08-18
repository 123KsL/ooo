import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewkslComponent } from './newksl/newksl.component';
import { ResolveService } from './service/resolve.service';
import { PhotosComponent } from './photos/photos.component';
import { TrianglesComponent } from './triangles/triangles.component';
import { OneComponent } from './one/one.component';
import { WebglComponent } from './webgl/webgl.component';
import { CssComponent } from './css/css.component';
import { ThreeJsComponent } from './three-js/three-js.component';

export const routes: Routes = [
  // { path: '', component: NewkslComponent, resolve: { msg: ResolveService } }
  { path: 'two', component: NewkslComponent },
  { path: 'photo', component: PhotosComponent },
  { path: 'one', component: OneComponent },
  { path: 'node', component: TrianglesComponent },
  { path: 'webgl', component: WebglComponent },
  { path: 'css', component: CssComponent },
  { path: 'three-dom', component: ThreeJsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { preloadingStrategy: PreloadAllModules }//预加载
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
