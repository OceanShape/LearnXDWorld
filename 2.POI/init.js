var GLOBAL = {
    engineDirectory: "./engine/",
    resourceDirectory: "./resource/"
};

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

    // 엔진 초기화 API 호출(필수)
    Module.Start(window.innerWidth, window.innerHeight);
    
	// 카메라 위치 설정
	Module.getViewCamera().setLocation(new Module.JSVector3D(126.92416038220622, 37.52166339268871, 500.0));
	
	createPOI();
}

function createPOI() {
	
	// POI 오브젝트를 추가 할 레이어 생성
	var layerList = new Module.JSLayerList(true);
	var layer = layerList.createLayer("POI_TEST", Module.ELT_3DPOINT);
	
	// TEXT POI
	var poi_with_text = Module.createPoint("POI_WITH_TEXT");
	poi_with_text.setPosition(new Module.JSVector3D(126.92294276906125, 37.52153977459489, 14.736136004328728));
	poi_with_text.setText("TEXT");
	layer.addObject(poi_with_text, 0);
	
	// Image POI
	var img = new Image();
	img.onload = function() {

		// 이미지 로드 후 캔버스에 그리기
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = this.width;
		canvas.height = this.height;
		ctx.drawImage(img, 0, 0);
		
		// 이미지 POI 생성
		var poi_with_image = Module.createPoint("POI_WITH_IMAGE");
		poi_with_image.setPosition(new Module.JSVector3D(126.92411650990323, 37.521620864485, 13.315417435020208));
		poi_with_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height);
		this.layer.addObject(poi_with_image, 0);
    };
    img.layer = layer;
    img.src = GLOBAL.resourceDirectory + "map_pin.png";
    
	// Text & image POI
	var img = new Image();
	img.onload = function() {

		// 이미지 로드 후 캔버스에 그리기
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		
		// 이미지 POI 생성
		var poi_with_text_n_image = Module.createPoint("POI_WITH_IMAGE");
		poi_with_text_n_image.setPosition(new Module.JSVector3D(126.92522784212862, 37.52163632683868, 13.357510312460363));
		poi_with_text_n_image.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height);
		
		// 텍스트 설정
		poi_with_text_n_image.setText("TEXT");
		
		this.layer.addObject(poi_with_text_n_image, 0);
    };
    img.layer = layer;
    img.src = GLOBAL.resourceDirectory + "map_pin.png";
}

/*********************************************************
 * 엔진 파일을 로드합니다.
 * 파일은 asm.js파일, html.mem파일, js 파일 순으로 로드합니다.
 *********************************************************/

;(function(){

    var tm = (new Date()).getTime();	// 캐싱 방지
    
	// 1. XDWorldEM.asm.js 파일 로드
	var file = GLOBAL.engineDirectory + "XDWorldEM.asm.js?tm="+tm;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function() {

		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		document.body.appendChild(script);

		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function() {
			(function() {

				var memoryInitializer = GLOBAL.engineDirectory + "XDWorldEM.html.mem?tm="+tm;
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
				xhr.open('GET', memoryInitializer, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload =  function(){

					// 3. XDWorldEM.js 파일 로드
					var url = GLOBAL.engineDirectory + "XDWorldEM.js?tm="+tm;
					var xhr = new XMLHttpRequest();
					xhr.open('GET',url , true);
					xhr.onload = function(){
						var script = document.createElement('script');
						script.innerHTML = xhr.responseText;
						document.body.appendChild(script);
					};
					xhr.send(null);
				}
				xhr.send(null);
			})();
		}, 1);
	};
	xhr.send(null);

})();


/*********************************************************
 *	엔진파일 로드 후 Module 객체가 생성되며,
 *  Module 객체를 통해 API 클래스에 접근 할 수 있습니다.
 *	 - Module.postRun : 엔진파일 로드 후 실행할 함수를 연결합니다.
 *	 - Module.canvas : 지도를 표시할 canvas 엘리먼트를 연결합니다.
 *********************************************************/

var Module = {
	TOTAL_MEMORY: 256*1024*1024,
	postRun: [init],
	canvas: (function() {

		// Canvas 엘리먼트 생성
		var canvas = document.createElement('canvas');

		// Canvas id, Width, height 설정
		canvas.id = "canvas";
		canvas.width="calc(100%)";
		canvas.height="100%";

		// Canvas 스타일 설정
		canvas.style.position = "fixed";
		canvas.style.top = "0px";
		canvas.style.left = "0px";

		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});

		// 생성한 Canvas 엘리먼트를 body에 추가합니다.
		document.body.appendChild(canvas);

		return canvas;
	})()
};
