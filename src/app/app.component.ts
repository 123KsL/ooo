declare const Email: any;
import { Component } from '@angular/core';
import { Style, TableTemplate } from '@wslksw/my-table';
import { Subject } from 'rxjs';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ThemeColorService } from './service/theme-color.service';
import { SwPush } from "@angular/service-worker";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(
    private SwPush:SwPush,
    public ThemeColorService: ThemeColorService,
) {
    pdfDefaultOptions.assetsFolder = 'assets';
    this.ThemeColorService.Theme('#000', 'primary')
    this.ThemeColorService.Theme('#999;', 'accent')

    //   if ('serviceWorker' in navigator) {
    //     //在调试阶段，如果发现 service worker 没有更新，可以先用下面的代码强制更新
    //     navigator.serviceWorker.getRegistrations().then((registrations) => {
    //         for (let registration of registrations) {
    //             registration.unregister()
    //         }
    //     });

    //     navigator.serviceWorker.register('/service-worker.js', {
    //         scope: '/'
    //     }).then((registration) => {
    //         registration.showNotification('Hello World');
    //     });
    // }

    if (!this.SwPush.isEnabled) {
      console.log("Notification is not enabled.");
      return;
    }

    this.SwPush.requestSubscription({
      serverPublicKey: 'BC4KHwc7JWt-ZIpo8_B5XOZ0N7irG8eWdalBlsInti-BzuLh5zcIuY36yIlIZTVJEsQnC5sgBz5MEYnTUTJt-3U'
    }).then((_: any) => {

      console.log(JSON.stringify(_),'ok');
    }).catch((_: any) =>{
      console.log(_,'no')
    });
  



  }

   

}
