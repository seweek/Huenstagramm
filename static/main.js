window.onload = function(){
	var input = document.getElementById("input");
	var imagedata = document.getElementById("imagedata");
	var glitchButton = document.getElementById("glitch");
	var imgContainer = document.getElementById("container");
	var canvas = document.getElementById("image");
	var form = document.getElementById("form");
	var button = document.getElementById("button");
	var bool = false;
	var rawimg;
	document.getElementById("username").value = localStorage.username;
	function random(){
		return Math.floor(Math.random()*101;;)
	}
	function applyGlitch(){
		var ctx;
		var ctx = canvas.getContext('2d');
		ctx.putImageData(rawimg, 0,0);
		var data = ctx.getImageData(0,0,canvas.width, canvas.height);
		glitch(data, {amount: random(), seed: random(), iterations: random(), quality: random()}, function(data){
			ctx.putImageData(data, 0, 0);
			imagedata.value = canvas.toDataURL('image/jpg');
		})
	}
	button.onclick = function(){
		applyGlitch();
	}
	form.onsubmit = function(){
		if (bool == false){
			return false;
		}
	}
	input.onchange = function(){
		var reader = new FileReader();
		reader.onload = function(event){
			var img = new Image();
			img.src = event.target.result;
			var ctx = canvas.getContext('2d');
			img.onload = function() {
				canvas.width = 290;
				canvas.height = img.height*(290/img.width);				
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 290, canvas.height);
				rawimg = ctx.getImageData(0,0,canvas.width, canvas.height);
				input.value = '';
				imagedata.value = canvas.toDataURL('image/jpg');
			};
		}
		reader.readAsDataURL(input.files[0]);
		bool = true;
	}
}