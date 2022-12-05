var GLOBAL = {
    engineDirectory: "../engine/",
    LAYER: null,
	m_mercount: 0	// 측정 오브젝트 갯수
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

	// 카메라 위치 설정
	Module.getViewCamera().setLocation(new Module.JSVector3D(126.92836647767662, 37.52439503321471, 1000.0));

	// 분석 출력 POI 레이어 생성
	let POILayerList = new Module.JSLayerList(true);
	let layer = POILayerList.createLayer("MEASURE_POI", Module.ELT_3DPOINT);
	layer.setMaxDistance(20000.0);
	layer.setSelectable(false);

	// 면적측정 라인 랜더 옵션 설정
	Module.getOption().SetAreaMeasurePolygonDepthBuffer(false);	// WEBGL GL_DEPTH_TEST 설정
	//Module.getOption().SetAreaMeasurePolygonDepthBuffer(true);	// WEBGL GL_DEPTH_TEST 설정(오브젝트 겹침 발생)

	// 콜백 함수 설정 지속적으로 사용
	Module.getOption().callBackAddPoint(addPoint);		// 마우스 입력시 발생하는 콜백 성공 시 success 반환 실패 시 실패 오류 반환
	Module.getOption().callBackCompletePoint(endPoint);	// 측정 종료(더블클릭) 시 발생하는 콜백 성공 시 success 반환 실패 시 실패 오류 반환
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

/* 마우스 상태 변경 */
function setMouseState(_type){
	
	if (_type == "move") {
		// 지도 이동 마우스 모드 변경
		Module.XDSetMouseState(Module.MML_MOVE_GRAB);	
	}
	else if (_type == "measure") {
		// 면적 측정 마우스 모드 변경
		Module.XDSetMouseState(Module.MML_ANALYS_AREA_PLANE);
	}
}

/* callBackAddPoint에 지정된 함수 [마우스 왼쪽 클릭 시 이벤트 발생]*/
function addPoint(e) {
	// e 구성요소
	// dLon, dLat, dAlt : 면적 중심 좌표(경위 고도)
	// dArea			: 면적 크기	
	createPOI(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt), "rgba(255, 204, 198, 0.8)", e.dArea, true);
}

/* callBackCompletePoint에 지정된 함수 [마우스 더블 클릭 시 이벤트 발생]*/
function endPoint(e) {
	viewListOBjKey(e);
	GLOBAL.m_mercount++;
}

//=============================================== POI 생성 과정
/* 정보 표시 POI */
function createPOI(_position, _color, _value, _balloonType) {
	// 매개 변수
	// _position : POI 생성 위치
	// _color : drawIcon 구성 색상
	// _value : drawIcon 표시 되는 텍스트
	// _balloonType : drawIcon 표시 되는 모서리 옵션(true : 각진 모서리, false : 둥근 모서리)

	// POI 아이콘 이미지를 그릴 Canvas 생성
	var drawCanvas = document.createElement('canvas');
	// 캔버스 사이즈(이미지 사이즈)
	drawCanvas.width = 100;
	drawCanvas.height = 100;

	// 아이콘 이미지 데이터 반환
	let imageData = drawIcon(drawCanvas, _color, _value, _balloonType);

	let Symbol = Module.getSymbol();

	let layerList = new Module.JSLayerList(true);
	let layer = layerList.nameAtLayer("MEASURE_POI");

	// POI가 존재 하면 삭제 후 생성
	let key = GLOBAL.m_mercount + "_POI";
	layer.removeAtKey(key);
	
	// POI 생성 과정
	poi = Module.createPoint(GLOBAL.m_mercount + "_POI");
	poi.setPosition(_position);												// 위치 설정
	poi.setImage(imageData, drawCanvas.width, drawCanvas.height);			// 아이콘 설정
	layer.addObject(poi, 0);												// POI 레이어 등록
}

/* 아이콘 이미지 데이터 반환 */
function drawIcon(_canvas, _color, _value, _balloonType) {

	// 컨텍스트 반환 및 배경 초기화
	var ctx = _canvas.getContext('2d'),
		width = _canvas.width,
		height = _canvas.height
		;
	ctx.clearRect(0, 0, width, height);

	// 배경 Draw Path 설정 후 텍스트 그리기
	if (_balloonType) {
		drawBalloon(ctx, height * 0.5, width, height, 5, height * 0.25, _color);
		setText(ctx, width * 0.5, height * 0.2, _value);
	} else {
		drawRoundRect(ctx, 0, height * 0.3, width, height * 0.25, 5, _color);
		setText(ctx, width * 0.5, height * 0.5, _value);
	}

	return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
}

/* 말풍선 배경 그리기 */
function drawBalloon(ctx,
	marginBottom, width, height,
	barWidth, barHeight,
	color) {

	var wCenter = width * 0.5,
		hCenter = height * 0.5;

	// 말풍선 형태의 Draw Path 설정
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, height - barHeight - marginBottom);
	ctx.lineTo(wCenter - barWidth, height - barHeight - marginBottom);
	ctx.lineTo(wCenter, height - marginBottom);
	ctx.lineTo(wCenter + barWidth, height - barHeight - marginBottom);
	ctx.lineTo(width, height - barHeight - marginBottom);
	ctx.lineTo(width, 0);
	ctx.closePath();

	// 말풍선 그리기
	ctx.fillStyle = color;
	ctx.fill();
}

/* 둥근 사각형 배경 그리기 */
function drawRoundRect(ctx,
	x, y,
	width, height, radius,
	color) {

	if (width < 2 * radius) radius = width * 0.5;
	if (height < 2 * radius) radius = height * 0.5;

	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// 사각형 그리기
	ctx.fillStyle = color;
	ctx.fill();

	return ctx;
}

/* 텍스트 그리기 */
function setText(_ctx, _posX, _posY, _value) {

	var strText = "";

	// 텍스트 문자열 설정
	var strText = setTextComma(_value.toFixed(2)) + '㎡';

	// 텍스트 스타일 설정
	_ctx.font = "bold 16px sans-serif";
	_ctx.textAlign = "center";
	_ctx.fillStyle = "rgb(0, 0, 0)";

	// 텍스트 그리기
	_ctx.fillText(strText, _posX, _posY);
}

/* 단위 표현 */
function setTextComma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

//=============================================== 측정 목록 및 삭제 관련
function viewListOBjKey(_key) {
	let cell = document.getElementById("objList");
	let li = document.createElement('li');
	
	// 측정 객체 리스트 추가( ui )
	li.id = _key
	li.innerHTML = "<a href='#' onclick=\"deleteObject('" + _key + "');\">" + _key + "</a>"
	cell.appendChild(li);
}

function deleteObject(_key) {
	Module.XDClearAreaObject(_key);
	let li = document.getElementById(_key);
	li.remove();										// 선택 <a> 컨트롤러 삭제

	// 오브젝트 삭제
	let layerList = new Module.JSLayerList(true);
	let layer = layerList.nameAtLayer("MEASURE_POI");
	let list = layer.getObjectKeyList();

	let key = _key.replace(/[^0-9]/g, '') + "_POI";	// [생성순서]_POI_ 형태로 객체 생성
	let strlist = list.split(",");
	strlist.forEach((item, index) => {
		if (item.indexOf(key) !== -1) {
			layer.removeAtKey(item)						// 키값으로 레이어에 들어간 오브젝트 삭제
		}
	});
	
	// 화면 재 갱신
	Module.XDRenderData();
}

/* 분석 내용 초기화 */
function clearAnalysis() {

	// 실행 중인 분석 내용 초기화
	Module.XDClearAreaMeasurement();
	GLOBAL.m_mercount = 0;
	
	// 레이어 삭제
	let layerList = new Module.JSLayerList(true);
	let layer = layerList.nameAtLayer("MEASURE_POI");
	layer.removeAll();
	
	// <ui> 모든 노드 삭제
	let cell = document.getElementById("objList");
	while ( cell.hasChildNodes() ) { 
		cell.removeChild( cell.firstChild ); 
	}
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
