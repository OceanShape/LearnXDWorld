/*********************************************************
 *	엔진파일 로드 후 Module 객체가 생성되며,
 *  Module 객체를 통해 API 클래스에 접근 할 수 있습니다.
 *	 - Module.postRun : 엔진파일 로드 후 실행할 함수를 연결합니다.
 *	 - Module.canvas : 지도를 표시할 canvas 엘리먼트를 연결합니다.
 *********************************************************/

var Module = {
	TOTAL_MEMORY: 256 * 1024 * 1024,
	postRun: [init],
	canvas: (function () {

		// Canvas 엘리먼트 생성
		var canvas = document.createElement('canvas');

		// Canvas id, Width, height 설정
		canvas.id = "canvas";
		canvas.width = "calc(100%)";
		canvas.height = "100%";

		// Canvas 스타일 설정
		canvas.style.position = "fixed";
		canvas.style.top = "0px";
		canvas.style.left = "0px";

		// 생성한 Canvas 엘리먼트를 body에 추가합니다.
		document.body.appendChild(canvas);
		
		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});

		canvas.onmouseout = (e) => {
		}
		canvas.onmousemove = (e) => {
			//console.log("mousemove");
			if (e.buttons == 0) {
				// 그냥 이동

			} else if (e.buttons == 1) {
				// 왼쪽 클릭 (이동 처리)
			} else if (e.buttons == 2) {
				// 오른쪽 클릭 (카메라 회전)
				let camera = Module.getViewCamera();
				let tile = camera.getTilt();			// 카메라 tile(상하) 각도 (10~90)
				let direct = camera.getDirect();		// 카메라 방향 각도(좌우) (-180 ~ 180)	북 : 0 동 : -90 남 : -180 or 180 서 :90

				tile = Math.floor(tile);
				direct = Math.floor(direct);

				setItemText("u_lab_nowTilt", "&nbsp;" + tile);
				setItemText("u_lab_nowDirect", "&nbsp;" + direct);
				setItemValue("u_rag_nowTilt", tile);
				setItemValue("u_rag_nowDirect", direct);
			}
		}
		canvas.onmouseup = (e) => {
			let camera = Module.getViewCamera();
			let pos = camera.getLocation();
			setItemText("u_lab_nowLon", pos.Longitude);
			setItemText("u_lab_nowLat", pos.Latitude);
			setItemText("u_lab_nowAlt", pos.Altitude);
		}
		canvas.onmousewheel = (e) => {
			let camera = Module.getViewCamera();
			let alt = camera.getAltitude();
			alt = Math.floor(alt);
			setItemText("u_lab_nowAltitude", "&nbsp;" + alt);	// 라벨 값 표시
			setItemValue("u_rag_nowAltitude", alt);
		}
		return canvas;
	})()
};
