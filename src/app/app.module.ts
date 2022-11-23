import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MyTableModule } from '@wslksw/my-table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OneComponent } from './one/one.component';
import { Mp4Component } from './mp4/mp4.component';
import { DemoMaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Mp41Component } from './mp41/mp41.component';
import { SssComponent } from './sss/sss.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { OnepipePipe } from './onepipe.pipe';
import { NoPreloading, RouterModule } from '@angular/router';
import { ColorComponent } from './color-1/color-1.component';
import { ColorOneComponent } from './color-one/color-one.component';
//import { NgOptimizedImage } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular';
import { TrianglesComponent } from './triangles/triangles.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    OneComponent,
    Mp4Component,
    Mp41Component,
    SssComponent,
    OnepipePipe,
    ColorComponent,
    ColorOneComponent,
    TrianglesComponent,
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DemoMaterialModule,
    BrowserModule,
    MyTableModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxExtendedPdfViewerModule,
    DxButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
