var GLOBAL = {
    engineDirectory: "../engine/",
	Symbol : null,		// 아이콘 관리 심볼 객체
    TEXTURE_LAYER : null, // 지도 텍스처 저장 레이어
    POI_LAYER : null,		// POI 저장 레이어
    nIndex : 0			// POI, Icon 생성 인덱스
};

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {
	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);
    Module.map = Module.getMap();

	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);
	Module.setVisibleRange("facility_build", 3.0, 100000.0);
    
    Module.canvas.onmousedown = function(e) {
    	
    	var screenPosition = new Module.JSVector2D(e.x, e.y);
    	
    	// 화면->지도 좌표 변환
    	var mapPosition = Module.map.ScreenToMapPointEX(screenPosition);
    	
    	document.getElementById("Lon").value = parseFloat(mapPosition.Longitude).toFixed(9);
    	document.getElementById("Lat").value = parseFloat(mapPosition.Latitude).toFixed(9);
    	document.getElementById("Alt").value = parseFloat(mapPosition.Altitude).toFixed(9);
    };

	
	// 아이콘 관리 심볼 생성
	GLOBAL.Symbol = Module.getSymbol();

    // 건물 객체 반환
	var facilityLayerList = new Module.JSLayerList(false);
	GLOBAL.TEXTURE_LAYER = facilityLayerList.nameAtLayer("facility_build");
	setTileTextureLOD(0.5);

	// 텍스쳐 용량 제한 해제
	Module.getOption().setTextureCapacityLimit(false);
	
	// 카메라 위치 설정
    let from = new Module.JSVector3D(129.127027776, 35.173027663, 50);
    let to = new Module.JSVector3D(129.130168889, 35.169365482, 32.280031785);
	Module.getViewCamera().look(from, to);

	// 분석 출력 POI 레이어 생성
	var POILayerList = new Module.JSLayerList(true);
	GLOBAL.POI_LAYER = POILayerList.createLayer("MEASURE_POI", Module.ELT_3DPOINT);
	GLOBAL.POI_LAYER.setMaxDistance(20000.0);
	GLOBAL.POI_LAYER.setSelectable(false);

    initEvent(Module.canvas);
}

/* 이벤트 등록 */
function initEvent(canvas) {

    // 거리측정 이벤트 설정
    canvas.addEventListener("Fire_EventAddAltitudePoint", function(e){
        createPOI(
            new Module.JSVector3D(e.dLon, e.dLat, e.dAlt), "rgba(10, 10, 0, 0.5)",
            e.dGroundAltitude, e.dObjectAltitude
        );
    });
}

/* 건물 정보 출력 */
function setTileTextureLOD(_lod_rate) {
	
	// 레이어 리스트에서 객체 키를 사용해 객체 반환
	if (GLOBAL.TEXTURE_LAYER == null) {
		return;
	}
	
	// 텍스쳐 화질 LOD 조정
	GLOBAL.TEXTURE_LAYER.lod_object_detail_ratio = _lod_rate;
	document.getElementById("texture_lod_rate").innerHTML = _lod_rate;
	
	// 화면 갱신
	Module.XDRenderData();
}

function setMouseState(_option){
    // 마우스 모드 설정
    Module.XDSetMouseState(_option);
}

/* 분석 내용 출력 POI 생성 */
function createPOI(_position, _color, _value, _subValue) {

    // POI 아이콘 이미지를 그릴 Canvas 생성
    var drawCanvas = document.createElement('canvas');
    drawCanvas.width = 200;
    drawCanvas.height = 100;

    // 아이콘 이미지 데이터 반환
    var imageData = drawIcon(drawCanvas, _color, _value, _subValue),
	nIndex = GLOBAL.nIndex
        ;

    // 심볼에 아이콘 이미지 등록
    if (GLOBAL.Symbol.insertIcon("Icon"+nIndex, imageData, drawCanvas.width, drawCanvas.height)) {

        // 등록한 아이콘 객체 반환
        var icon = GLOBAL.Symbol.getIcon("Icon"+nIndex);

        // JSPoint 객체 생성
        var count = GLOBAL.POI_LAYER.getObjectCount(),
            poi = Module.createPoint("POI"+nIndex)
            ;

        poi.setPosition(_position); // 위치 설정
        poi.setIcon(icon); // 아이콘 설정

        // 레이어에 오브젝트 추가
        GLOBAL.POI_LAYER.addObject(poi, 0);

        // 인덱스 값 상승
        GLOBAL.nIndex++;
    }
}

/* 아이콘 이미지 데이터 반환 */
function drawIcon(_canvas, _color, _value, _subValue) {

    // 컨텍스트 반환 및 배경 초기화
    var ctx = _canvas.getContext('2d'),
        width = _canvas.width,
        height = _canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 배경과 높이 값 텍스트 그리기
    if (_subValue == -1) {
        drawRoundRect(ctx, 50, 20, 100, 20, 5, _color);		// 오브젝트 높이 값이 유효하지 않는 경우
    } else {
        drawRoundRect(ctx, 50, 5, 100, 35, 5, _color);		// 오브젝트 높이 값이 유효한 경우
        setText(ctx, width*0.5, height*0.2, '지면고도 : ' + setKilloUnit(_subValue, 0.001, 0));
    }
    setText(ctx, width*0.5, height*0.2+15, '해발고도 : '+ setKilloUnit(_value, 0.001, 0));

    // 위치 표시 점 그리기
    drawDot(ctx, width, height);

    return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
}

/* 위치 표시 점 그리기 */
function drawDot(ctx, width, height) {

    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.arc(width*0.5, height*0.5, 2, 0, 2*Math.PI, false);
    ctx.closePath();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
    ctx.stroke();
}

/* 둥근 사각형 배경 그리기 */
function drawRoundRect(ctx, x, y, width, height, radius, color) {

    if (width < 2 * radius) {
        radius = width * 0.5;
    }
    if (height < 2 * radius) {
        radius = height * 0.5;
    }

    ctx.beginPath();
    ctx.moveTo(x+radius, y);
    ctx.arcTo(x+width, y, x+width, y+height, radius);
    ctx.arcTo(x+width, 	y+height, x, y+height, radius);
    ctx.arcTo(x, y+height, x, y, radius);
    ctx.arcTo(x, y, x+width, y, radius);
    ctx.closePath();

    // 사각형 그리기
    ctx.fillStyle = color;
    ctx.fill();
    
    return ctx;
}

/* 텍스트 그리기 */
function setText(_ctx, _posX, _posY, _strText) {

    _ctx.font = "bold 12px sans-serif";
    _ctx.textAlign = "center";

    _ctx.fillStyle = "rgb(255, 255, 255)";
    _ctx.fillText(_strText, _posX, _posY);
}

/* m/km 텍스트 변환 */
function setKilloUnit(_text, _meterToKilloRate, _decimalSize){

    if (_decimalSize < 0){
    	_decimalSize = 0;
    }
    if (typeof _text == "number") {
    	if (_text < 1.0/(_meterToKilloRate*Math.pow(10,_decimalSize))) {
            _text = _text.toFixed(1).toString()+'m';
	} else {
	    _text = (_text*_meterToKilloRate).toFixed(2).toString()+'㎞';
	}
    }
    return _text;
}

/* 분석 내용 초기화 */
function clearAnalysis() {

    var layer = GLOBAL.POI_LAYER,
        symbol = GLOBAL.Symbol;
    if (layer == null) {
    	return;
    }

    // 등록된 아이콘 리스트 삭제
    var i, len, icon, poi;
    for (i=0, len=layer.getObjectCount(); i<len; i++) {

    	poi = layer.keyAtObject("POI"+i);
    	icon = poi.getIcon();

	// 아이콘을 참조 중인 POI 삭제
	layer.removeAtKey("POI"+i);

	// 아이콘을 심볼에서 삭제
	symbol.deleteIcon(icon.getId());
    }

    // POI, Icon 키 지정 인덱스 초기화
    GLOBAL.nIndex = 0;
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
