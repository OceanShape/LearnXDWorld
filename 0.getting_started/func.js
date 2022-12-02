var GLOBAL = {
    engineDirectory: "../engine/",
    LAYER: null
};

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {
	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);
    Module.map = Module.getMap();
    
    Module.canvas.onmousedown = function(e) {
    	
    	var screenPosition = new Module.JSVector2D(e.x, e.y);
    	
    	// 화면->지도 좌표 변환
    	var mapPosition = Module.map.ScreenToMapPointEX(screenPosition);
    	
    	document.getElementById("Lon").value = parseFloat(mapPosition.Longitude).toFixed(6);
    	document.getElementById("Lat").value = parseFloat(mapPosition.Latitude).toFixed(6);
    	document.getElementById("Alt").value = parseFloat(mapPosition.Altitude).toFixed(6);
    };

	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);
	Module.setVisibleRange("facility_build", 3.0, 1000000.0);
	
	// 건물 객체 반환
	var layerList = new Module.JSLayerList(false);
	GLOBAL.LAYER = layerList.nameAtLayer("facility_build");
	setTileTextureLOD(0.5);
	
	// 텍스쳐 용량 제한 해제
	Module.getOption().setTextureCapacityLimit(false);
}

/* 건물 정보 출력 */
function setTileTextureLOD(_lod_rate) {
	
	// 레이어 리스트에서 객체 키를 사용해 객체 반환
	if (GLOBAL.LAYER == null) {
		return;
	}
	
	// 텍스쳐 화질 LOD 조정
	GLOBAL.LAYER.lod_object_detail_ratio = _lod_rate;
	document.getElementById("texture_lod_rate").innerHTML = _lod_rate;
	
	// 화면 갱신
	Module.XDRenderData();
}

// 엔진 파일 로드
(function(){

	// 1. XDWorldEM.asm.js 파일 로드
	var file = GLOBAL.engineDirectory + "XDWorldEM.asm.js";
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function() {
	
		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		document.body.appendChild(script);
		
		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function() {
			(function() {
				var memoryInitializer = GLOBAL.engineDirectory + "XDWorldEM.html.mem";
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        		xhr.open('GET', memoryInitializer, true);
					xhr.responseType = 'arraybuffer';
					xhr.onload =  function(){
						
						// 3. XDWorldEM.js 파일 로드
						var url = GLOBAL.engineDirectory + "XDWorldEM.js";
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
	}
)();
