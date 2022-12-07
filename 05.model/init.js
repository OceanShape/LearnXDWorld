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
