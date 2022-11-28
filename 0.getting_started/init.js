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

		// contextmenu disabled
		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
	
		// 생성한 Canvas 엘리먼트를 body에 추가합니다.
		document.body.appendChild(canvas);
		return canvas;
	})()
};

window.onresize = function() {

	if (typeof Module == "object") {
		Module.Resize(window.innerWidth, window.innerHeight);
		Module.XDRenderData();
	}
};
