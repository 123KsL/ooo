import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatCardXlImage } from '@angular/material/card';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSliderChange } from '@angular/material/slider';
import { count, expand, filter, from, map, of, scan, startWith, tap } from 'rxjs';


@Component({
  selector: 'app-mp4',
  templateUrl: './mp4.component.html',
  styleUrls: ['./mp4.component.scss']
})
export class Mp4Component implements OnInit, AfterViewInit {
  showFiller: boolean = true;
  videoAllCount: number = 0 //video总长
  paused: boolean = true  //整个video是否开始
  ForCountLists: number[] = [] //video 各个url的时长列表
  @ViewChild('video1') video!: ElementRef;
  @ViewChild('videoButton') videoButton!: ElementRef;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('drawer') drawer!: MatDrawer;
  SrcListItem!: string   //video Url
  selected: number = 0.5 //倍速
  values: number = 0 //整个video的进度条
  videoCounted: number = 0 //当前所在分段的前面时长的总长

  loading: boolean = false
  jump: boolean = false   //正在跳转
  drag: number = 0 //拖动
  dragend: boolean = false//正在拖动
  countedValue: number = 0
  countedValueList: number[] = []
  SrcList: string[] = []

  videoData1: video[] = [
    {

      url: 'https://www.w3schools.com/html/movie.mp4',
      count: 13,
    },
    {

      url: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
      count: 10,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4',
      count: 19,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4',
      count: 8,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4',
      count: 17,
    },
    {

      url: 'http://jyh.wuhan.gov.cn/masvod/public/2021/10/13/20211013_17c79b4bb9a_r1_1200k.mp4',
      count: 558,

    },

  ]
  videoData2: video[] = [
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4',
      count: 19,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4',
      count: 8,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4',
      count: 17,
    },
    {

      url: 'http://jyh.wuhan.gov.cn/masvod/public/2021/10/13/20211013_17c79b4bb9a_r1_1200k.mp4',
      count: 558,

    },

  ]
  videoData3: video[] = [

    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4',
      count: 8,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4',
      count: 19,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4',
      count: 17,
    }
  ]
  videoData4: video[] = [
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/tree.mp4',
      count: 17,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/cliffs-sunset.mp4',
      count: 8,
    },
    {

      url: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/shore-overhead.mp4',
      count: 19,
    },
  ]
  VideoInformation!: videoData[]

  constructor(private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,) {

    this.VideoInformation = [
      { id: '1', date: new Date('2022-08-12'), videoList: this.videoData1 },
      { id: '2', date: new Date('2022-08-13'), videoList: this.videoData2 },
      { id: '3', date: new Date('2022-08-14'), videoList: this.videoData3 },
      { id: '4', date: new Date('2022-08-15'), videoList: this.videoData4 },
    ]


    this.switchVideo(this.VideoInformation[3])
    this.Count(() => {
      console.log(this.TimeFormat(this.countedValue), this.countedValue, this.countedValueList, this.TimeFormat(625))
    })
  }
  ngAfterViewInit(): void {
    this.Sidebar()
    this.changeDetector.detectChanges();

  }
  Sidebar() {
    //this.drawer.toggle()
    this.showFiller = !this.showFiller
  }
  formatLabel(value: number) {
    if (this.drag != value) {
      //console.log('正在拖动');
      this.dragend = true
    } else {
      this.dragend = false
      //console.log('没拖动');
    }
    if (value) this.drag = value

    var h = Number(value / 3600).toFixed(0)
    var m = Number((value % 3600) / 120).toFixed(0)
    var s = Number((value % 3600) % 60).toFixed(0)
    return h + ':' + m + ':' + s
  }

  ngOnInit(): void {
    // this.changeDetector.detectChanges();
  }

  Error<T>(event: T) {
    console.log(event);
    alert(event + '出错了')
  }

  DateAll(data: videoData) {
    //切换下一天视频
    this.switchVideo(data)
  }
  switchVideo(data: videoData) {
    this.SrcList = []
    this.SrcList.push(...data.videoList.map(_ => _.url))
    this.SrcListItem = this.SrcList[0]
    // if( this.video) this.video.nativeElement.src = this.SrcList[0]
    this.ForCountLists = []
    data.videoList.map(_ => this.ForCountLists.push(_.count))
    this.videoAllCount = this.ArraySum(this.ForCountLists)
    this.values = 0
    this.videoCounted = 0
    if (!this.video) {
      this.paused = true
    } else if (this.video && !this.video.nativeElement.paused) {
      this.paused = true
    } else if (this.video && this.video.nativeElement.paused) {
      this.paused = true
    }
    console.log(this.video && !this.video.nativeElement.paused);
    // if(this.video && this.video.nativeElement.paused) 
    // this.video.nativeElement.pause();this.paused=false

  }
  StartEnd() {
    //开关
    this.paused = !this.paused
    if (this.values == Number(this.videoAllCount.toFixed(0))) {
      this.video.nativeElement.src = this.SrcList[0]
      this.Load(() => {
        this.paused = false
        this.video.nativeElement.currentTime = 0
        this.videoCounted = 0
        this.values = 0
        this.StartPlaying(() => undefined)
      })
    } else {
      ////console.log('222', this.paused);
      try {
        this.paused ? this.video.nativeElement.pause() : this.StartPlaying(() => undefined)
      } catch (err) {
        //console.log(err);
      }

    }

    // //console.log(this.video.nativeElement.buffered.end(0));
  }

  VideoSpeed(text: number) {  //设置倍速
    this.selected = text
    this.video.nativeElement.playbackRate = text
  }


  TimeupDate() {
    //console.log('跑');
    if (this.values < this.videoAllCount && !this.jump && !this.dragend) {
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
        this.StartPlaying(() => undefined)
      })
    }
  }
  Waiting() {
    this.loading = true
  }
  Playing() {
    this.loading = false
  }


  Count(callback: () => void | undefined) {

    this.SrcList.forEach((item, index) => {
      var audio = new Audio(item)
      // var duration = 0
      audio.addEventListener("loadedmetadata", _ => {
        console.log(audio);
        // duration = audio.duration // 通过添加监听来获取视频总时长字段，即duration
        this.countedValueList.push(Number(audio.duration.toFixed(0)))
        this.countedValue = this.countedValue + Number(audio.duration.toFixed(0))

      });
      // if (index == this.SrcList.length - 1) {

      // } else {
      //   var audio = new Audio(item)
      //   // var duration = 0
      //   audio.addEventListener("loadedmetadata", _ => {
      //     ////////console.log('222');
      //     // duration = audio.duration // 通过添加监听来获取视频总时长字段，即duration
      //     this.countedValueList.push(Number(audio.duration.toFixed(0)))
      //     this.countedValue = this.countedValue + Number(audio.duration.toFixed(0))
      //   });
      // }

    })
    callback()
  }
  TimeFormat(time: number): string {
    var h = Number(time / 3600).toFixed(0)
    var m = Number((time % 3600) / 120).toFixed(0)
    var s = Number((time % 3600) % 60).toFixed(0)
    //console.log(h + m +s);
    // document.write("这是" + h + '小时' + m + '分' + s + '秒');
    return h + ':' + m + ':' + s

  }

  VideoChange(event: MatSliderChange) {  //快进后退

    this.ForCountList(this.ForCountLists, event.value!, event.value! > this.values)

  }
  ForCountList(a: number[], c: number, boolean: boolean) {
    this.jump = true
    this.video.nativeElement.pause()

    var arr: number[] = []
    this.values = c
    this.paused = false
    console.log('跳转:' + c, '进度条:' + this.values);
    //this.loading=true

    a.forEach((value: number, index: number, array: number[]) => {
      ////console.log(a, c, index, this.sum(a.slice(0, index)));
      if (this.ArraySum(a.slice(0, index + 1)) > c) {
        arr.push(index)
      } else if (this.ArraySum(a.slice(0, index + 1)) == c) {
        arr.push(index)
      }
      //c属于哪个哪个位置
    })
    this.videoCounted = arr[0] == 0 ? 0 : this.ArraySum(a.slice(0, arr[0]))

    // this.video.nativeElement.appendBuffer(buffer) 
    ////console.log(arr, arr[0]);
    if (this.SrcList[arr[0]] != this.video.nativeElement.src) this.video.nativeElement.src = this.SrcList[arr[0]] //切换一个分段
    this.Load(() => {
      this.video.nativeElement.currentTime = c - this.videoCounted       //需要在分段添加的count
      this.video.nativeElement.playbackRate = this.selected
      this.StartPlaying(() => { this.jump = false })
    })





  }

  StartPlaying(callback: () => void | undefined) {
    this.video.nativeElement.play().then((result: any) => {
      //console.log(result);
      // this.video.nativeElement.volume
      console.log('音量', this.video.nativeElement.volume);
      callback()
    }).catch((err: any) => {
      this.StartPlaying(() => callback())
      //alert('flied')
    });
  }

  ArraySum(arr: number[]) {
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
    //console.log(this.video && this.video.nativeElement.buffered.length > 0 ? this.video.nativeElement.buffered.end(0) / (this.videoAllCount / 100) : 0);
    return this.video && this.video.nativeElement.buffered.length > 0 ? (this.video.nativeElement.buffered.end(0) + this.videoCounted) / (this.videoAllCount / 100) : 0
  }

  Load(callback: () => void | undefined) {
    try {
      this.video.nativeElement.load()
      callback()
    } catch (error) {
      this.Load(() => callback())
    }





  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    ////console.log(event);
    if (event.code == 'Space') {
      event.preventDefault() //禁用空格退出全屏
      this.StartEnd()
    }
  }


}

export interface video {
  url: string;
  count: number;
}
export interface videoData {
  id: string;
  date: Date;
  videoList: video[]
}

