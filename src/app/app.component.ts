import { Component } from '@angular/core';
import { Style, TableTemplate } from '@wslksw/my-table';
import { Subject } from 'rxjs';

import { ThemeColorService } from './service/theme-color.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(public ThemeColorService: ThemeColorService) {
    this.ThemeColorService.Theme('#000', 'primary')
    this.ThemeColorService.Theme('#999;', 'accent')

  }
}
