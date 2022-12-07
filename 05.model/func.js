var GLOBAL = {
	ghostSymbolMap : null,
	ghostSymbolLayer : null,
	ghostSymbolObject : null,
    engineDirectory: "../engine/"
};

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {
	
    // 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);
	
	// 카메라 설정
	Module.getViewCamera().setLocation(new Module.JSVector3D(129.126128, 35.170648, 200.0));
	
	// 고스트 심볼 모델 관리 맵 반환
	GLOBAL.ghostSymbolMap = Module.getGhostSymbolMap();
	
	// 고스트 심볼 레이어 생성
	var layerList = new Module.JSLayerList(true);
	GLOBAL.ghostSymbolLayer = layerList.createLayer("GHOST_SYMBOL_LAYER", Module.ELT_GHOST_3DSYMBOL);
	
	Module.getGhostSymbolMap().insert({
		id : "TREE",
		url : "./data/sample01.3ds",
		callback : function(e) {
			
			// 텍스쳐 설정
			Module.getGhostSymbolMap().setModelTexture({
				id : e.id,
				face_index : 0,
				url : "./data/sample01.jpg",
				callback : function(e) {
					console.log(e.id);
				}
			});

			// 오브젝트 생성 및 레이어 추가
			var object = createGhostSymbol("object_tree", e.id, [129.1261352701963, 35.170643013330896, 5.807222427800298]);
			GLOBAL.ghostSymbolLayer.addObject(object, 0);
			GLOBAL.ghostSymbolObject = object;
			
			// 오브젝트 속성 정보 출력
			displayGhostSymbolProperties();
		}
	});
	
	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 50);
	
	// 지형 반투명
	Module.XDESetPlanetTransparecny(0.7);
}

/* 고스트 심볼 모델 오브젝트 생성 */
function createGhostSymbol(_objectKey, _modelKey, _position) {
	
	var newModel = Module.createGhostSymbol(_objectKey);
	
	// base point 설정
	var modelHeight = GLOBAL.ghostSymbolMap.getGhostSymbolSize(_modelKey);
	
	newModel.setBasePoint(0, -modelHeight.height*0.5, 0);
	newModel.setRotation(0, 90.0, 0);
	newModel.setScale(new Module.JSSize3D(1.0, 1.0, 1.0));
	//newModel.setScale(new Module.JSSize3D(0.001, 0.001, 0.001));
	newModel.setGhostSymbol(_modelKey);
	newModel.setPosition(new Module.JSVector3D(_position[0], _position[1], _position[2]));			
		
	return newModel;
}

/* 고스트 심볼 모델 속성 반환 및 출력 */
function displayGhostSymbolProperties() {
	
	if (GLOBAL.ghostSymbolObject == null) {
		return;
	}
	
	// Position
	var position = GLOBAL.ghostSymbolObject.getPosition();
	document.getElementById("longitude").value = position.Longitude;
	document.getElementById("latitude").value = position.Latitude;
	document.getElementById("altitude").value = position.Altitude;
	
	// Rotate
	var rotateX = GLOBAL.ghostSymbolObject.getRotationX();
	document.getElementById("rotationXtext").innerHTML = rotateX.toFixed(1);
	document.getElementById("rotationX").value = rotateX;
	
	var rotateY = GLOBAL.ghostSymbolObject.getRotationY();
	document.getElementById("rotationYtext").innerHTML = rotateY.toFixed(1);
	document.getElementById("rotationY").value = rotateY;
	
	var rotateZ = GLOBAL.ghostSymbolObject.getRotationZ();
	document.getElementById("rotationZtext").innerHTML = rotateZ.toFixed(1);
	document.getElementById("rotationZ").value = rotateZ;
	
	// Scale
	var scale = GLOBAL.ghostSymbolObject.getScale();
	document.getElementById("scaleXtext").innerHTML = scale.width.toFixed(1);
	document.getElementById("scaleX").value = scale.width;
	
	document.getElementById("scaleYtext").innerHTML = scale.height.toFixed(1);
	document.getElementById("scaleY").value = scale.height;
	
	document.getElementById("scaleZtext").innerHTML = scale.depth.toFixed(1);
	document.getElementById("scaleZ").value = scale.depth;
	
	// Base point
	var basePointX = GLOBAL.ghostSymbolObject.getBasePointX();
	document.getElementById("basePointXtext").innerHTML = basePointX.toFixed(1);
	document.getElementById("basePointX").value = basePointX;
	
	var basePointY = GLOBAL.ghostSymbolObject.getBasePointY();
	document.getElementById("basePointYtext").innerHTML = basePointY.toFixed(1);
	document.getElementById("basePointY").value = basePointY;
	
	var basePointZ = GLOBAL.ghostSymbolObject.getBasePointZ();
	document.getElementById("basePointZtext").innerHTML = basePointZ.toFixed(1);
	document.getElementById("basePointZ").value = basePointZ;
}

/* 고스트 심볼 위치 조정 */
function setPosition() {

	if (GLOBAL.ghostSymbolObject == null) {
		return;
	}
	
	var position = new Module.JSVector3D(
		parseFloat(document.getElementById("longitude").value),
		parseFloat(document.getElementById("latitude").value),
		parseFloat(document.getElementById("altitude").value)
	);
	
	GLOBAL.ghostSymbolObject.setPosition(position);
}

/* 고스트 심볼 회전 각도 조정 */
function setRotation() {
	
	if (GLOBAL.ghostSymbolObject == null) {
		return;
	}
	
	var rotateX = parseFloat(document.getElementById("rotationX").value);
	var rotateY = parseFloat(document.getElementById("rotationY").value);
	var rotateZ = parseFloat(document.getElementById("rotationZ").value);
	
	GLOBAL.ghostSymbolObject.setRotation(rotateX, rotateY, rotateZ);
	
	document.getElementById("rotationXtext").innerHTML = rotateX.toFixed(1);
	document.getElementById("rotationYtext").innerHTML = rotateY.toFixed(1);
	document.getElementById("rotationZtext").innerHTML = rotateZ.toFixed(1);
		
	
	Module.XDRenderData();
}

/* 고스트 심볼 스케일 조정 */
function setScale() {
	
	if (GLOBAL.ghostSymbolObject == null) {
		return;
	}
	
	var scaleX = parseFloat(document.getElementById("scaleX").value);
	var scaleY = parseFloat(document.getElementById("scaleY").value);
	var scaleZ = parseFloat(document.getElementById("scaleZ").value);
	
	GLOBAL.ghostSymbolObject.setScale(new Module.JSSize3D(scaleX, scaleY, scaleZ));
	
	document.getElementById("scaleXtext").innerHTML = scaleX.toFixed(1);
	document.getElementById("scaleYtext").innerHTML = scaleY.toFixed(1);
	document.getElementById("scaleZtext").innerHTML = scaleZ.toFixed(1);
	
	Module.XDRenderData();
}

/* 고스트 심볼 베이스 포인트 조정 */
function setBasePoint() {
	
	if (GLOBAL.ghostSymbolObject == null) {
		return;
	}
	
	var basePointX = parseFloat(document.getElementById("basePointX").value);
	var basePointY = parseFloat(document.getElementById("basePointY").value);
	var basePointZ = parseFloat(document.getElementById("basePointZ").value);
	
	GLOBAL.ghostSymbolObject.setBasePoint(basePointX, basePointY, basePointZ);
	
	document.getElementById("basePointXtext").innerHTML = basePointX.toFixed(1);
	document.getElementById("basePointYtext").innerHTML = basePointY.toFixed(1);
	document.getElementById("basePointZtext").innerHTML = basePointZ.toFixed(1);
	
	Module.XDRenderData();
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
