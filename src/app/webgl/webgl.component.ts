import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as pdfjslib from "pdfjs-dist";
import { catchError } from 'rxjs';
import * as THREE from 'three';
import { AmbientLight, BoxGeometry, Color, ColorRepresentation, Mesh, MeshLambertMaterial, PerspectiveCamera, PlaneGeometry, Scene, SpotLight, WebGLRenderer } from 'three';
const PDFJS = (<any>pdfjslib);
@Component({
  selector: 'app-webgl',
  templateUrl: './webgl.component.html',
  styleUrls: ['./webgl.component.scss']
})
export class WebglComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('ThereHtml') thereHtml!: ElementRef;

  constructor() {

  }
  ngAfterViewInit(): void {
    //this.thereWebgl();
    this.thereJs();
    //throw new Error('Method not implemented.');
    //this.Load();
  }
  ngOnInit(): void {

    // fetch('https://tekweld.promo.tekweld.com/impositions/TEKW1122/252784.pdf').then(_ => _.blob()).then(_ => {
    //   const newBlob = new Blob([_], { type: 'image/jpeg' });
    //   window.URL.createObjectURL(newBlob);
    //   console.log(window.URL.createObjectURL(newBlob))
    // })
    //throw new Error('Method not implemented.');
    // 从这里开始

  }
  Load() {
    //const canvas = document.querySelector("#glcanvas");
    // 初始化 WebGL 上下文
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement as (HTMLCanvasElement)
    const gl = canvasElement.getContext("webgl");
    //获取到 canvas 之后,会调用getContext 函数并向它传递 "webgl" 参数，来尝试获取WebGLRenderingContext。如果浏览器不支持 webgl, getContext 将会返回 null，我们就可以显示一条消息给用户然后退出。
    //如果 WebGL 上下文成功初始化，变量‘gl’会用来引用该上下文。在这个例子里，我们用黑色清除上下文内已有的元素。（用背景颜色重绘 canvas）。
    // 确认 WebGL 支持性
    if (!gl) {
      alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
      return;
    }

    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

    const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;



    //
    //  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      // 创建着色器程序

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // 如果创建失败，alert
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }

      return shaderProgram;
    }

    //
    // 创建指定类型的着色器，上传 source 源码并编译
    //
    function loadShader(gl, type, source) {
      const shader = gl.createShader(type);

      // Send the source to the shader object

      gl.shaderSource(shader, source);

      // Compile the shader program

      gl.compileShader(shader);

      // See if it compiled successfully

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };

    function initBuffers(gl) {
      const positionBuffer = initPositionBuffer(gl);

      return {
        position: positionBuffer,
      };
    }

    function initPositionBuffer(gl) {
      // Create a buffer for the square's positions.
      const positionBuffer = gl.createBuffer();

      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Now create an array of positions for the square.
      const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      return positionBuffer;
    }




  }
  //  drawScene(gl, programInfo, buffers) {
  //     gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  //     gl.clearDepth(1.0);                 // Clear everything
  //     gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  //     gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  //     // Clear the canvas before we start drawing on it.

  //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //     // Create a perspective matrix, a special matrix that is
  //     // used to simulate the distortion of perspective in a camera.
  //     // Our field of view is 45 degrees, with a width/height
  //     // ratio that matches the display size of the canvas
  //     // and we only want to see objects between 0.1 units
  //     // and 100 units away from the camera.

  //     const fieldOfView = 45 * Math.PI / 180;   // in radians
  //     const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  //     const zNear = 0.1;
  //     const zFar = 100.0;
  //     const projectionMatrix = mat4.create();

  //     // note: glmatrix.js always has the first argument
  //     // as the destination to receive the result.
  //     mat4.perspective(projectionMatrix,
  //                      fieldOfView,
  //                      aspect,
  //                      zNear,
  //                      zFar);

  //     // Set the drawing position to the "identity" point, which is
  //     // the center of the scene.
  //     const modelViewMatrix = mat4.create();

  //     // Now move the drawing position a bit to where we want to
  //     // start drawing the square.

  //     mat4.translate(modelViewMatrix,     // destination matrix
  //                    modelViewMatrix,     // matrix to translate
  //                    [-0.0, 0.0, -6.0]);  // amount to translate

  //     // Tell WebGL how to pull out the positions from the position
  //     // buffer into the vertexPosition attribute.
  //     {
  //       const numComponents = 2;  // pull out 2 values per iteration
  //       const type = gl.FLOAT;    // the data in the buffer is 32bit floats
  //       const normalize = false;  // don't normalize
  //       const stride = 0;         // how many bytes to get from one set of values to the next
  //                                 // 0 = use type and numComponents above
  //       const offset = 0;         // how many bytes inside the buffer to start from
  //       gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  //       gl.vertexAttribPointer(
  //           programInfo.attribLocations.vertexPosition,
  //           numComponents,
  //           type,
  //           normalize,
  //           stride,
  //           offset);
  //       gl.enableVertexAttribArray(
  //           programInfo.attribLocations.vertexPosition);
  //     }

  //     // Tell WebGL to use our program when drawing

  //     gl.useProgram(programInfo.program);

  //     // Set the shader uniforms

  //     gl.uniformMatrix4fv(
  //         programInfo.uniformLocations.projectionMatrix,
  //         false,
  //         projectionMatrix);
  //     gl.uniformMatrix4fv(
  //         programInfo.uniformLocations.modelViewMatrix,
  //         false,
  //         modelViewMatrix);

  //     {
  //       const offset = 0;
  //       const vertexCount = 4;
  //       gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  //     }
  //   }

  //   // Tell WebGL how to pull out the positions from the position
  //   // buffer into the vertexPosition attribute.
  //    setPositionAttribute(gl, buffers, programInfo) {
  //     const numComponents = 2; // pull out 2 values per iteration
  //     const type = gl.FLOAT; // the data in the buffer is 32bit floats
  //     const normalize = false; // don't normalize
  //     const stride = 0; // how many bytes to get from one set of values to the next
  //     // 0 = use type and numComponents above
  //     const offset = 0; // how many bytes inside the buffer to start from
  //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  //     gl.vertexAttribPointer(
  //       programInfo.attribLocations.vertexPosition,
  //       numComponents,
  //       type,
  //       normalize,
  //       stride,
  //       offset
  //     );
  //     gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // }




  thereJs() {
    console.log(this.thereHtml.nativeElement)
    // 场景
    const scene = new Scene()

    // 相机
    const camera = new PerspectiveCamera(45, this.thereHtml.nativeElement.clientWidth / this.thereHtml.nativeElement.clientHeight, 0.1, 1000)

    // 渲染器
    const renderer = new WebGLRenderer()

    // 设置渲染器的大小
    renderer.setSize(this.thereHtml.nativeElement.clientWidth, this.thereHtml.nativeElement.clientHeight)

    // // 地面
    // const planeGeometry = new PlaneGeometry(60, 40, 1, 1)
    // const planeMaterial = new MeshLambertMaterial({ color: 0xffffff })
    // const plane = new Mesh(planeGeometry, planeMaterial)

    // plane.rotation.x = -0.5 * Math.PI // 旋转平面，让它看起来像地面
    // // 设置地面位置
    // plane.position.x = 2
    // plane.position.y = 0
    // plane.position.z = -10
    // // 将地面添加到场景中
    // scene.add(plane)

    // 设置相机位置
    camera.position.x = -70
    camera.position.y = 30
    camera.position.z = 5
    // 将镜头锁定到地面上
    camera.lookAt(scene.position)


    // 环境光
    const ambientLight = new AmbientLight(0x3c3c3c)
    // 将环境光添加到场景中
    scene.add(ambientLight)

    // 聚光灯
    const spotLight = new SpotLight(0xffffff, 1, 150, 120)
    spotLight.position.set(-40, 60, -10)
    // 将聚光灯添加到场景中
    scene.add(spotLight)

    // 立方体列表
    // let cubeList = []

    // // 循环出20个立方体
    // for (let i = 0; i < 20; i++) {
    //   let cubeSize = Math.ceil((Math.random() * 3)) // 随机生成不同大小的立方体尺寸
    //   let cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize)
    //   let r = Math.floor(Math.random()  * 256)
    //   let g = Math.floor(Math.random() * 256)
    //   let b = Math.floor(Math.random() * 256)
    //   let color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
    //   let cubeMaterial = new MeshLambertMaterial({
    //     color // 设置随机颜色
    //   })

    //   // 生成立方体
    //   let cube = new Mesh(cubeGeometry, cubeMaterial)

    //   // 根据地面尺寸，随机设置立方体位置
    //   cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width))
    //   cube.position.y = Math.round((Math.random() * 5))
    //   cube.position.z = -30 + Math.round((Math.random() * planeGeometry.parameters.height))

    //   // 将立方体添加到立方体列表中
    //   cubeList.push(cube)
    // }

    // 解构立方体列表，将列表中所有立方体添加到场景中
    //scene.add(...cubeList)
    const SphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x03c03c,
      wireframe: true,
      
      //linewidth: 1,
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    });


    // const SphereMaterial = new THREE.LineBasicMaterial( {
    //   color: 'blue',
    //   linewidth: 1,
    //   linecap: 'round', //ignored by WebGLRenderer
    //   linejoin:  'round' //ignored by WebGLRenderer
    // } );
    const SphereGeometry = new THREE.SphereGeometry(20, 60, 60);
    const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
    //scene.add(planet);

    const geometry = new THREE.CapsuleGeometry(5, 15, 10, 50);
    const material = new THREE.MeshBasicMaterial({ color: '#999', wireframe: true });
    const capsule = new THREE.Mesh(geometry, material);
    scene.add(...[planet, capsule]);

    const TorusGeometry = new THREE.TorusGeometry(30, 5, 2, 200);
    const TorusMaterial = new THREE.MeshLambertMaterial({
      color: 0x40a9ff,
      wireframe: true
    });
    const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = -0.1 * (Math.PI / 2);
    scene.add(ring);

    
    const stars = new THREE.Group();
    for (let i = 0; i < 500; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 5, 0);
      const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 700;
      mesh.position.y = (Math.random() - 0.5) * 700;
      mesh.position.z = (Math.random() - 0.5) * 700;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;
      stars.add(mesh);
    }
    scene.add(stars);

    function render() {
     
      capsule.position.y = Math.random() * 0.1;
      renderer.render(scene, camera);
      //scene.rotation.y += 0.005;
      planet.rotation.y += 0.005;
      ring.rotation.x += 0.0005;
      requestAnimationFrame(render);
    }

    // 将场景和相机添加到渲染器中并执行渲染
    //renderer.render(scene, camera)
    render()
    // 将渲染器添加到div中
    this.thereHtml.nativeElement.appendChild(renderer.domElement)
  }
  // a(){
  //   function init() {
  //     let container, camera, scene, renderer, effect;

	// 		const spheres = [];

	// 		let mouseX = 0, mouseY = 0;

	// 		let windowHalfX = window.innerWidth / 2;
	// 		let windowHalfY = window.innerHeight / 2;

	// 		document.addEventListener( 'mousemove', onDocumentMouseMove );

	// 		init();
	// 		animate();
  //     container = document.createElement( 'div' );
  //     document.body.appendChild( container );

  //     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
  //     camera.position.z = 3200;

  //     scene = new THREE.Scene();
  //     scene.background = new THREE.CubeTextureLoader()
  //       .setPath( 'textures/cube/Park3Med/' )
  //       .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

  //     const geometry = new THREE.SphereGeometry( 100, 32, 16 );

  //     const textureCube = new THREE.CubeTextureLoader()
  //       .setPath( 'textures/cube/Park3Med/' )
  //       .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
  //     textureCube.mapping = THREE.CubeRefractionMapping;

  //     const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );

  //     for ( let i = 0; i < 500; i ++ ) {

  //       const mesh = new THREE.Mesh( geometry, material );
  //       mesh.position.x = Math.random() * 10000 - 5000;
  //       mesh.position.y = Math.random() * 10000 - 5000;
  //       mesh.position.z = Math.random() * 10000 - 5000;
  //       mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
  //       scene.add( mesh );

  //       spheres.push( mesh );

  //     }

  //     //

  //     renderer = new THREE.WebGLRenderer();
  //     renderer.setPixelRatio( window.devicePixelRatio );
  //     container.appendChild( renderer.domElement );

  //     effect = new StereoEffect( renderer );
  //     effect.setSize( window.innerWidth, window.innerHeight );

  //     //

  //     window.addEventListener( 'resize', onWindowResize );

  //   }

  //   function onWindowResize() {

  //     windowHalfX = window.innerWidth / 2;
  //     windowHalfY = window.innerHeight / 2;

  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();

  //     effect.setSize( window.innerWidth, window.innerHeight );

  //   }

  //   function onDocumentMouseMove( event ) {

  //     mouseX = ( event.clientX - windowHalfX ) * 10;
  //     mouseY = ( event.clientY - windowHalfY ) * 10;

  //   }

  //   //

  //   function animate() {

  //     requestAnimationFrame( animate );

  //     render();

  //   }

  //   function render() {

  //     const timer = 0.0001 * Date.now();

  //     camera.position.x += ( mouseX - camera.position.x ) * .05;
  //     camera.position.y += ( - mouseY - camera.position.y ) * .05;
  //     camera.lookAt( scene.position );

  //     for ( let i = 0, il = spheres.length; i < il; i ++ ) {

  //       const sphere = spheres[ i ];

  //       sphere.position.x = 5000 * Math.cos( timer + i );
  //       sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

  //     }

  //     effect.render( scene, camera );

  //   }
  // }

}
