var GLOBAL = {
    engineDirectory: "../engine/",
};

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 위치 설정
	Module.getViewCamera().setLocation(new Module.JSVector3D(126.92836647767662, 37.52439503321471, 1000.0));

	// 폴리곤을 추가 할 레이어 생성
	var layer = createLayer("COLOR_POLYGONS");

	// 폴리곤 생성 (a, r, g, b)
	var RED = new Module.JSColor(180, 255, 0, 0);
	var BLUE = new Module.JSColor(180, 0, 0, 255);
	var YELLOW = new Module.JSColor(255, 255, 255, 0);
	var WHITE = new Module.JSColor(255, 255, 255, 255);

	createPolygon(layer, "POLYGON_0", [
		[126.92880093356217, 37.526449697149275, 15.0],
		[126.92747156107778, 37.52580690438921, 15.0],
		[126.9285966142554, 37.524600367428434, 15.0],
		[126.92999683697185, 37.52541675406735, 15.0]
	], RED, BLUE, 100.0);

	createPolygon(layer, "POLYGON_1", [
		[126.92978578374051, 37.525006010930404, 15.0],
		[126.92929982642171, 37.524706839120505, 15.0],
		[126.92911433683298, 37.523961592581536, 15.0],
		[126.92947216441964, 37.523596673383544, 15.0],
		[126.9305395635455, 37.5241947870904, 15.0]
	], YELLOW, RED, 90.0);

	createPolygon(layer, "POLYGON_2", [
		[126.9284333955597, 37.524177634131256, 15.0],
		[126.92725820948873, 37.52348524178598, 15.0],
		[126.92923633591509, 37.52333808155665, 15.0]
	], BLUE, YELLOW, 10.0);

	createPolygon(layer, "POLYGON_3", [
		[126.92810438243193, 37.52444826677564, 15.0],
		[126.92735008425544, 37.52511746600832, 15.0],
		[126.92652558959448, 37.52464088575271, 15.0]
	], RED, null, 30.0);

	createPolygon(layer, "POLYGON_4", [
		[126.92561176604246, 37.52413901559285, 15.0],
		[126.92635958087928, 37.523317844403614, 15.0],
		[126.92722230982808, 37.52380950125158, 15.0],
		[126.9264552990246, 37.524569911257736, 15.0]
	], YELLOW, null, 50.0);

	createPolygon(layer, "POLYGON_5", [
		[126.92662769941579, 37.5258323117311, 15.0],
		[126.92594406688102, 37.52444316569473, 15.0],
		[126.92727337285713, 37.5252340699095, 15.0]
	], BLUE, null, 70.0);
}

/* 레이어 생성 */
function createLayer(_layerName) {

	var layerList = new Module.JSLayerList(true);
	var layer = layerList.createLayer(_layerName, Module.ELT_POLYHEDRON);

	return layer;
}

function createPolygon(_layer, id, _vertices, _fillColor, _outlineColor, _height) {

	// 폴리곤 객체 생성
	var polygon = Module.createPolygon(id);

	// 버텍스 배열 생성
	var vertex = new Module.JSVec3Array();
	for (var i=_vertices.length - 1; i>=0; i--) {
		vertex.push(new Module.JSVector3D(_vertices[i][0], _vertices[i][1], _vertices[i][2]));
	}

	var part = new Module.Collection();
	part.add(_vertices.length);

	polygon.setPartCoordinates(vertex, part);

	// 높이가 있는 다면체 폴리곤으로 설정
	polygon.setHeight(_height);
	
	// 폴리곤 색상 설정
	var polygonStyle = new Module.JSPolygonStyle();
	polygonStyle.setFill(true);
	polygonStyle.setFillColor(_fillColor);
	if (_outlineColor != null) {
		polygonStyle.setOutLine(true);
		polygonStyle.setOutLineWidth(2.0);
		polygonStyle.setOutLineColor(_outlineColor);
	}
	else polygonStyle.setOutLine(false);
	
	polygon.setStyle(polygonStyle);

	// 레이어에 객체 추가
	_layer.addObject(polygon, 0);
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
