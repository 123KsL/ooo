import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mp41',
  templateUrl: './mp41.component.html',
  styleUrls: ['./mp41.component.scss']
})
export class Mp41Component implements OnInit, AfterViewInit {
  @ViewChild('video1') video!: ElementRef;
  mineCodes = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  constructor() {

  }
  ngAfterViewInit(): void {
    this.ddd()
  }

  ngOnInit(): void {
  }
  ddd() {
    var baseUrl = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/';
    //var baseUrl = 'https://www.w3schools.com/html/movie.mp4';
    var initUrl = baseUrl + 'init.mp4';
    var templateUrl = baseUrl + 'segment_$Number$.m4s';
    var sourceBuffer: SourceBuffer;
    var index = 0;
    var numberOfChunks = 52;
    // var video = document.querySelector('video');

    if (!window.MediaSource) {
      console.error('No Media Source API available');
      return;
    }

    var ms = new MediaSource();
    this.video.nativeElement.src = window.URL.createObjectURL(ms);
    const onMediaSourceOpen = () => {
      sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.4d401f"');
      sourceBuffer.addEventListener('updateend', nextSegment);

      this.GET(initUrl, appendToBuffer);

      this.video.nativeElement.play();
    }
    ms.addEventListener('sourceopen', onMediaSourceOpen);



    const nextSegment = () => {
      var url = templateUrl.replace('$Number$', String(index));
      this.GET(url, appendToBuffer);
      index++;
      if (index > numberOfChunks) {
        sourceBuffer.removeEventListener('updateend', nextSegment);
      }
    }

    const appendToBuffer = (videoChunk: Iterable<number>) => {
      if (videoChunk) {
        sourceBuffer.appendBuffer(new Uint8Array(videoChunk));
      }
    }



  }
  GET(url: string | URL, callback: { (videoChunk: Iterable<number>): void; (videoChunk: Iterable<number>): void; (arg0: any): void; }) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';

    xhr.onload = (e) => {
      if (xhr.status != 200) {
        console.warn('Unexpected status code ' + xhr.status + ' for ' + url);
        // return false;
      }
      callback(xhr.response);
    };

    xhr.send();
  }
 
}
