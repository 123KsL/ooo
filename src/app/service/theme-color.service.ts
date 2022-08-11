import { Injectable } from '@angular/core';
declare const tinycolor: any;
@Injectable({
  providedIn: 'root'
})

export class ThemeColorService {
  constructor() { }
  //  primaryColor = '#012135';
  // // primaryColor = '#f44336';
  // accentColor = '#590a3e';
  // warnColor = '#f44336'

  Theme(primaryColor: string, theme: string) {
    // console.log(primaryColor);
    // console.log(this.computeColors(primaryColor));
    this.updateTheme(this.computeColors(primaryColor), theme)
    console.log(this.computeColors(primaryColor), theme);
    // console.log( this.updateTheme());



  }
  updateTheme(colors: Color[], theme: string) {
    colors.forEach((color) => {
      document.documentElement.style.setProperty(`--theme-${theme}-${color.name}`, color.hex);
      document.documentElement.style.setProperty(`--theme-${theme}-contrast-${color.name}`,
        color.darkContrast ? 'rgba(black, 0.87)' : 'white'
      );
    });
  }

  computeColors(hex: string): Color[] {
    return [
      this.getColorObject(tinycolor(hex).lighten(52), '50'),
      this.getColorObject(tinycolor(hex).lighten(37), '100'),
      this.getColorObject(tinycolor(hex).lighten(26), '200'),
      this.getColorObject(tinycolor(hex).lighten(12), '300'),
      this.getColorObject(tinycolor(hex).lighten(6), '400'),
      this.getColorObject(tinycolor(hex), '500'),
      this.getColorObject(tinycolor(hex).darken(6), '600'),
      this.getColorObject(tinycolor(hex).darken(12), '700'),
      this.getColorObject(tinycolor(hex).darken(18), '800'),
      this.getColorObject(tinycolor(hex).darken(24), '900'),
      this.getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
      this.getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
      this.getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
      this.getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
    ];
  }

  getColorObject(value: any, name: string): Color {
    const c = tinycolor(value);
    return {
      name: name,
      hex: c.toHexString(),
      darkContrast: c.isLight()
    };
  }
}


export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}




