import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyTableModule } from '@wslksw/my-table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OneComponent } from './one/one.component';
import { Mp4Component } from './mp4/mp4.component';
import { DemoMaterialModule } from './material-module';
import { FormsModule } from '@angular/forms';
import { Mp41Component } from './mp41/mp41.component';




@NgModule({
  declarations: [
    AppComponent,
    OneComponent,
    Mp4Component,
    Mp41Component,
  ],
  imports: [
    DemoMaterialModule,
    BrowserModule,
    MyTableModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
