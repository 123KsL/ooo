import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { count, expand, from, map, of, scan, startWith, tap } from 'rxjs';


@Component({
  selector: 'app-mp4',
  templateUrl: './mp4.component.html',
  styleUrls: ['./mp4.component.scss']
})
export class Mp4Component implements OnInit {
  showFiller: boolean = true;
  videoAllCount: number = 0 //video总长
  // videoVolume: number = 0 //音量
  paused: boolean = true  //整个video是否开始
  ForCountLists: number[] = [19, 8, 17, 13, 10, 558] //video 各个url的时长列表
  @ViewChild('video1') video!: ElementRef;
  @ViewChild('videoButton') videoButton!: ElementRef;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('drawer') drawer!: any;
  SrcListItem!: string   //video Url
  selected: number = 0.5 //倍速
  values: number = 0 //整个video的进度条
  videoCounted: number = 0 //当前所在分段的前面时长的总长
  // values1: number = 0
  loading: boolean = false

  SrcList: string[] =
    [
      'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4',
      'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4',
      'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4',
      'https://www.w3schools.com/html/movie.mp4',
      'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
      'http://jyh.wuhan.gov.cn/masvod/public/2021/10/13/20211013_17c79b4bb9a_r1_1200k.mp4'
    ]
  TimeList: string[] =
    [
      '2022-11-11',
      '2022-11-12',
      '2022-11-13',
      '2022-11-14'
    ]

  constructor(private renderer: Renderer2) {
    this.SrcListItem = this.SrcList[0]
    from(this.ForCountLists).pipe(map(sum => sum)).subscribe(_ => {
      this.videoAllCount = _ + this.videoAllCount
      //console.log(_, 'ss', this.videoAllCount)
    })
  }
  Sidebar() {
    this.drawer.toggle()
    this.showFiller = !this.showFiller
  }
  formatLabel(value: number) {
    var h = Number(value / 3600).toFixed(0)
    var m = Number((value % 3600) / 120).toFixed(0)
    var s = Number((value % 3600) % 60).toFixed(0)
    return h + ':' + m + ':' + s
  }

  ngOnInit(): void {
    
  }

  Error<T>(event: T) { alert(event + '出错了') }

  DateAll() {
    //切换下一天视频
    this.SrcList = []
    this.SrcList.push(...[
      'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
      'https://www.w3schools.com/html/movie.mp4',
    ])
    this.SrcListItem = this.SrcList[0]
  }
  StartEnd() {
    //开关
    this.paused = !this.paused
    if (this.values == Number(this.videoAllCount.toFixed(0))) {
      this.video.nativeElement.src = this.SrcList[0]
      this.Load(() => {
        this.video.nativeElement.play()
        this.paused = false
        this.video.nativeElement.currentTime = 0
        this.videoCounted = 0
        this.values = 0
      })
    } else {
      //console.log('222', this.paused);
      this.paused ? this.video.nativeElement.pause() : this.video.nativeElement.play();
    }

    console.log(this.video.nativeElement.buffered.end(0));
  }

  VideoSpeed(text: number) {  //设置倍速
    this.selected = text
    this.video.nativeElement.playbackRate = text
  }


  TimeupDate() {   //进度条change
    // //console.log(this.video.nativeElement.buffered.start(0), this.video.nativeElement.buffered.end(0)
    //   , '缓冲');
    if (this.values < this.videoAllCount) {
      this.values = this.videoCurrentTime + this.videoCounted
    }
  }

  Ended() {   //每个分段结束...
    this.video.nativeElement.pause()
    if (this.video.nativeElement.src != this.SrcList[this.SrcList.length - 1]) {
      this.videoCounted = this.videoDurations + this.videoCounted
      this.video.nativeElement.src = this.SrcList[this.SrcList.indexOf(this.video.nativeElement.src) + 1]


      this.Load(() => {
        this.video.nativeElement.playbackRate = this.selected
        // this.video.nativeElement.volume = this.videoVolume ? (Number(this.videoVolume) / 10) : 0
        this.video.nativeElement.play().then((result: any) => {
          this.loading = false
        }).catch((err: any) => {
          this.loading = true
          //console.log(err);
        });
      })
    }
  }
  waiting() {
    this.loading = true
  }
  playing() {
    this.loading = false
  }


  // Count(callback: () => void | undefined) {
  //   this.videoAllCount = 0
  //   this.SrcList.forEach((item, index) => {
  //     if (index == this.SrcList.length - 1) {
  //       var audio = new Audio(item)
  //       // var duration = 0
  //       audio.addEventListener("loadedmetadata", _ => {
  //         // duration = audio.duration // 通过添加监听来获取视频总时长字段，即duration
  //         this.ForCountLists.push(Number(audio.duration.toFixed(0)))
  //         this.videoAllCount = this.videoAllCount + audio.duration
  //         callback()
  //       });
  //     } else {
  //       var audio = new Audio(item)
  //       // var duration = 0
  //       audio.addEventListener("loadedmetadata", _ => {
  //         //////console.log('222');
  //         // duration = audio.duration // 通过添加监听来获取视频总时长字段，即duration
  //         this.videoAllCount = this.videoAllCount + audio.duration
  //       });
  //     }
  //   })
  // }

  Time(time: number): string {
    var h = Number(time / 3600).toFixed(0)
    var m = Number((time % 3600) / 120).toFixed(0)
    var s = Number((time % 3600) % 60).toFixed(0)
    // document.write("这是" + h + '小时' + m + '分' + s + '秒');
    return h + ':' + m + ':' + s

  }
  // videoVolumeChange(event: any) {  //设置音量
  //   this.videoVolume = event
  //   this.video.nativeElement.volume = event ? (Number(event) / 10) : 0
  // }
  VideoChange(event: MatSliderChange) {  //快进后退
    this.ForCountList(this.ForCountLists, event.value!, event.value! > this.values)
  }
  ForCountList(a: number[], c: number, boolean: boolean) {
    this.video.nativeElement.pause()
    //////console.log(c);
    var arr: number[] = []
    this.values = c
    this.paused = false
    //this.loading=true

    a.forEach((value: number, index: number, array: number[]) => {
      //console.log(a, c, index, this.sum(a.slice(0, index)));
      if (this.sum(a.slice(0, index + 1)) > c) {
        arr.push(index)
      } else if (this.sum(a.slice(0, index + 1)) == c) {
        arr.push(index)
      }
      //c属于哪个哪个位置
    })
    this.videoCounted = arr[0] == 0 ? 0 : this.sum(a.slice(0, arr[0]))

    // this.video.nativeElement.appendBuffer(buffer) 
    //console.log(arr, arr[0]);
    if (this.SrcList[arr[0]] != this.video.nativeElement.src) this.video.nativeElement.src = this.SrcList[arr[0]] //切换一个分段
    this.Load(() => {
      this.video.nativeElement.currentTime = c - this.videoCounted       //需要在分段添加的count
      // alert(this.video.nativeElement.currentTime)
      this.video.nativeElement.play().then((result: any) => {
        //this.loading=false
      }).catch((err: any) => {
        //this.loading=true
        alert('flied')
      });
    })





  }

  sum(arr: number[]) {
    let s = 0;
    arr.forEach(val => s += val, 0)
    return s;
  }
  // Muted() { //静音
  //   this.video.nativeElement.muted = true
  //   this.videoVolume = 0
  // }
  get Bo() {
    return this.paused || (this.values == Number(this.videoAllCount.toFixed(0)))
  }

  requestFullscreen() {
    if (!this.Fullscreen) {
      if (this.videoContainer.nativeElement.webkitRequestFullscreen) {
        this.videoContainer.nativeElement.webkitRequestFullscreen();
      } else if (this.videoContainer.nativeElement.mozRequestFullScreen) {
        this.videoContainer.nativeElement.mozRequestFullScreen();
      } else {
        //其他浏览器待补充……
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .then(() => console.log("Document Exited from Full screen mode"))
          .catch((err) => console.log(err))
      } else {
        document.documentElement.requestFullscreen();
      }
    }

  }

  get Fullscreen(): boolean {
    return document.fullscreenElement ? true : false
  }
  pointermove() {

    // this.renderer.setStyle(this.videoButton.nativeElement, 'display', 'flex')
  }
  pointerout() {
    // setTimeout(() => {
    //   this.renderer.setStyle(this.videoButton.nativeElement, 'display', 'none')
    // }, 10000);

    // this.fullScreen ? this.renderer.setStyle(this.videoButton.nativeElement, 'display', 'none'): ''
  }



  get videoDurations(): number {
    if (this.video) {
      return Number(this.video.nativeElement.duration.toFixed(0))
    } else {
      return 0
    }

  }

  get videoCurrentTime() {
    if (this.video) {
      return Number(this.video.nativeElement.currentTime.toFixed(0))
    } else {
      return 0
    }

  }

  get buffered() {
    console.log(this.videoAllCount / (this.videoCounted + (this.video ? this.video.nativeElement.buffered.end(0) : 0)))
    return 100 / (this.videoAllCount / (this.videoCounted + (this.video ? this.video.nativeElement.buffered.end(0) : 0)))
  }

  Load(callback: () => void | undefined) {
    this.video.nativeElement.load()
    callback()
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event:KeyboardEvent) {
    //console.log(event);
    if (event.code == 'Space') {
      event.preventDefault() //禁用空格退出全屏
      this.StartEnd()
    }
  }

  videoData: videoData[] = [
    {
      id: '1',
      url: 'https://www.w3schools.com/html/movie.mp4',
      //count: number,
      date: new Date(),
    },
    {
      id: '2',
      url: 'https://www.w3schools.com/html/movie.mp4',
      //count: number,
      date: new Date(),
    }
  ]

}
//video[]
export interface videoData {
  id: string;
  url: string;
  //count: number;
  date: Date;
}  
