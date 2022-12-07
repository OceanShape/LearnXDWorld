var GLOBAL = {
    engineDirectory: "../engine/",
};

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 위치 설정
	Module.getViewCamera().setLocation(new Module.JSVector3D(126.001, 37.02, 500.0));

	// 폴리곤을 추가 할 레이어 생성
	var layerList = new Module.JSLayerList(true);
	layerList.createLayer("Line_Option", Module.ELT_3DLINE);

	createLine("LINE_1", [[126.0, 37.03, 20], [126.002, 37.01, 20]], 1);
	createLine("LINE_2", [[126.0, 36.9998, -5], [126.002, 36.9998, -5]], 2);
	createLine("LINE_3", [[126.0, 36.9996, 0], [126.002, 36.9996, 1]], 3);
	createLine("LINE_4", [[126.0, 36.9994, 20], [126.002, 36.9994, 20]], 4);
	createLine("LINE_5", [[126.0, 36.9992, 20], [126.002, 36.9992, 20]], 5);
	createLine("LINE_6", [[126.0, 36.9990, 20], [126.002, 36.9990, 20]], 6);
	createLine("LINE_7", [[126.0, 36.9988, 20], [126.002, 36.9988, 20]], 7);
	createLine("LINE_8", [[126.0, 36.9986, 20], [126.002, 36.9986, 20]], 8);
}

function createLine( _id, _coordinate, _type) {
	
	let coordinates = {
			coordinate: _coordinate,						// 정점 배열
			style: "XYZ",
			// style에 따른 배열 관계
			// "XY" = [x, y],[x, y],[..]
			// "XYZ" = [x, y, z],[x, y, z],[...]
			// "XYZARRAY" = [x, y, z, x, y, z ...]
			// "JSVector3D" = JSVector3D 인스턴스
		};

		let object_option = null;

		if (_type == 1) object_option = createNormalLineJson(coordinates);
		else if (_type == 2) object_option = createDashLineJson(coordinates, _type);
		else if (_type == 3) object_option = createDashLineJson(coordinates, _type);
		else if (_type == 4) object_option = createDashLineJson(coordinates, _type);
		else if (_type == 5) object_option = createDashLineJson(coordinates, _type);
		else if (_type == 6) object_option = createDashLineJson(coordinates, _type);
		else if (_type == 7) object_option = createArrowLineJson(coordinates);
		else if (_type == 8) object_option = createOutLineJson(coordinates);

		let line = Module.createLineString(_id)
		console.log(line.createbyJson(object_option));

		let layerList = new Module.JSLayerList(true);
		let lineLayer = layerList.nameAtLayer("Line_Option");
		lineLayer.addObject(line, 0);
}

function createNormalLineJson(_coordinates) {
	let data = {
		coordinates: _coordinates,
		type: 0,											// 실선 생성 		
		union: true,										// 지형 결합 유무
		depth: true,										// 오브젝트 겹침 유무
		color: new Module.JSColor(255, 255, 0, 0),			// ARGB 설정
		width: 10,											// 선 굵기
	}
	return data;
}

function createArrowLineJson(_coordinates) {
	let data = {
		coordinates: _coordinates,
		type: 3,											// 화살표선 생성 		
		union: false,										// 지형 결합 유무
		depth: true,										// 오브젝트 겹침 유무
		color: new Module.JSColor(255, 255, 0, 0),			// ARGB 설정
		width: 5,											// 선 굵기( type 3 일떄 width 1로 설정 시 화살표 X)
	}
	return data;
}

function createOutLineJson(_coordinates) {
	let data = {
		coordinates: _coordinates,
		type: 1,											// 그라데이션 선 생성 		
		union: false,										// 지형 결합 유무
		depth: true,										// 오브젝트 겹침 유무
		color: new Module.JSColor(200, 255, 0, 100),		// fill ARGB 설정
		strokecolor: new Module.JSColor(200, 100, 0, 255),	// stroke ARGB 설정
		strokewidth: 6.0,									// stroke 굵기 설정
		width: 10,											// 선 굵기( type 3 일떄 width 1로 설정 시 화살표 X)
	}
	return data;
}

function createDashLineJson(_coordinates, _type) {

	let union, depth,
		r, g, b, a,
		width, dash;

	union = false;	// 지형 결합 X
	depth = false;	// 지형 겹침 발생 금지

	if (_type == 2) {
		r = 0; g = 255; b = 0; a = 255;		// 녹색
		width = 2;							// 선 굵기
		dash = 5;							// 점선 O
	} else if (_type == 3) {
		depth = true;						// 지형 겹침 발생 
		r = 0; g = 0; b = 255; a = 255;		// 파랑
		width = 3;							// 선 굵기
		dash = 10;							// 점선 O

	} else if (_type == 4) {
		union = true;						// 지형결합 O
		r = 255; g = 255; b = 0; a = 255;	// 노랑
		width = 4;							// 선 굵기
		dash = 15;							// 점선 O
	} else if (_type == 5) {
		union = true;						// 지형결합 O
		r = 255; g = 0; b = 255; a = 255;	// 보라
		width = 5;							// 선 굵기
		dash = 20;							// 점선 O
	} else if (_type == 6) {
		union = true;						// 지형결합 O
		r = 255; g = 255; b = 255; a = 255;	// 하얀
		width = 6;							// 선 굵기
		dash = 25;							// 점선 O		
	}

	let data = {
		coordinates: _coordinates,
		type: 4,										// 점선 생성 
		union: union,									// 지형 결합 유무
		depth: depth,									// 지형 겹침 X
		color: new Module.JSColor(a, r, g, b),			// ARGB 설정
		width: width,									// 선 굵기
		dash: dash,										// 점선 간격(0)
	}
	return data;
}

/*********************************************************
* 엔진 파일을 로드합니다.
* 파일은 asm.js파일, html.mem파일, js 파일 순으로 적용합니다.
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
