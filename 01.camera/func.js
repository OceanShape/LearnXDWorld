/*********************************************************
 * 엔진 파일을 로드합니다.
 * 파일은 asm.js파일, html.mem파일, js 파일 순으로 적용합니다.
 *********************************************************/

 var GLOBAL = {
    engineDirectory: "../engine/"
};

// tilt 정의
// 카메라 상하 회전 
// 최소 최대 각도 : 10~90도
// tilt 반환 샘플은 canvas.onmousemove 참조
function setTilt(_value) {
	_value *= 1;							// 문자 데이터를 숫자로 변경
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	camera.setTilt(_value);					// tilt 값 적용 ( getTilt 통해 현재값 반환 )
	setItemText("u_lab_nowTilt", "&nbsp;" + _value);	// 라벨 값 표시
}

// Direct 정의
// 카메라 좌우 회전 
// 최소 최대 각도 : -180~180도
// 북 : 0도 동 -90도 남 -180~180도 서 : 90도
// Direct 반환 샘플은 canvas.onmousemove 참조
function setDirect(_value) {
	_value *= 1;							// 문자 데이터를 숫자로 변경
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	camera.setDirect(_value);				// Dierct 값 적용 ( getDirect 통해 현재값 반환 )
	setItemText("u_lab_nowDirect", "&nbsp;" + _value);	// 라벨 값 표시
}

// Altitude 정의
// 카메라 좌우 회전 
// 최소 최대 각도 : -180~180도
// 북 : 0도 동 -90도 남 -180~180도 서 : 90도
// Altitude 반환 샘플은 canvas.onmousewheel 참조
function setAltitude(_value) {
	_value *= 1;							// 문자 데이터를 숫자로 변경
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	camera.setAltitude(_value);				// Altitude 값 적용 ( getAltitude 통해 현재값 반환 )
	setItemText("u_lab_nowAltitude", "&nbsp;" + _value);	// 라벨 값 표시
}
// move 정의
// 입력 좌표로 카메라 뷰를 이동
// 카메라 위치 좌표 반환은 canvas.onmouseup 참조
function setMove() {
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	let lon, lat, alt;

	lon = getItemValue("u_txt_lon");		// HTML Lon 값 반환
	lat = getItemValue("u_txt_lat");		// HTML Lat 값 반환
	alt = getItemValue("u_txt_alt");		// HTML alt 값 반환

	lon *= 1;								// 문자열 숫자로 변경
	lat *= 1;								// 문자열 숫자로 변경
	alt *= 1;								// 문자열 숫자로 변경

	let pos = new Module.JSVector3D(lon, lat, alt);		// 경위도를  JSVector3D 형태로 변경
	camera.setLocation(pos);							// 카메라 이동 ( getLocation 통해 현재값 반환)
	// 카메라 이동 관련 API는 아래 링크를 통해 확인 가능 (추가 예정)
}

// FOV 정의
// 화면 시야각도를 설정
// 카메라 위치 좌표 반환은 canvas.onmouseup 참조
// 시야각은 기본 45로 설정
function setFOV(_value) {
	_value *= 1;							// 문자 데이터를 숫자로 변경
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	camera.setFov(_value)
	setItemText("u_lab_nowFOV", "&nbsp;" + _value);	// 라벨 값 표시
}

// 1, 3인칭 정의
// 카메라 회전 모드를 변경
// 1인칭 : 카메라가 제자리에서 회전
// 3인칭 : 카메라가 바라보는 시점 기준으로 회전( Default )
function setPerson(_type) {
	_type *= 1;
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	if (_type == 1) {
		camera.setMoveMode(true);
	} else if (_type == 3) {
		camera.setMoveMode(false);
	}
}

// =================================================================================
// 초기 설정 관련 
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


// =================================================================================
/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);

	setinterface();

	let camera = Module.getViewCamera();
	let tilt = camera.getTilt();
	let direct = camera.getDirect();

	tilt = Math.floor(tilt);
	direct = Math.floor(direct);

	console.log(tilt, direct)

	setItemText("u_lab_nowTilt", "&nbsp;" + tilt);
	setItemText("u_lab_nowDirect", "&nbsp;" + direct);
	setItemValue("u_rag_nowTilt", tilt);
	setItemValue("u_rag_nowDirect", direct);
}

function setinterface() {
	setDivSizeHeight("interface", 300, 360)
}

function setDivSizeHeight(_div, _width, _height) {
	let div = document.getElementById(_div);
	div.style.width = _width + "px";
	div.style.height = _height + "px";
}

function setItemText(_div, _value) {
	let div = document.getElementById(_div);
	div.innerHTML = _value;
}

function setItemValue(_div, _value) {
	let div = document.getElementById(_div);
	div.value = "" + _value;
}

function getItemValue(_div) {
	let div = document.getElementById(_div);
	return div.value;
}

