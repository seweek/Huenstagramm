window.onload = function(){
	var input = document.getElementById("input");
	var imagedata = document.getElementById("imagedata");
	var glitchButton = document.getElementById("glitch");
	var imgContainer = document.getElementById("container");
	var canvas = document.getElementById("image");
	var form = document.getElementById("form");
	var amountInput = document.getElementById("amount");
	var seedInput = document.getElementById("seed");
	var iterationsInput = document.getElementById("iterations");
	var qualityInput = document.getElementById("quality");
	var upbutton = document.getElementById("button");
	var bool = false;
	var rawimg;
	document.getElementById("username").value = localStorage.username;
	function applyGlitch(){
		var ctx;
		var ctx = canvas.getContext('2d');
		ctx.putImageData(rawimg, 0,0);
		var data = ctx.getImageData(0,0,canvas.width, canvas.height);
		glitch(data, {amount: amountInput.value, seed: seedInput.value, iterations: iterationsInput.value, quality: qualityInput.value}, function(data){
			ctx.putImageData(data, 0, 0);
			imagedata.value = canvas.toDataURL('image/jpg');
		})
	}
	amountInput.onchange = function(){
		applyGlitch();
	}
	seedInput.onchange = function(){
		applyGlitch();
	}
	iterationsInput.onchange = function(){
		applyGlitch();
	}
	qualityInput.onchange = function(){
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
			canvas.width = 460;
			canvas.height = img.height*(460/img.width);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 460, canvas.height);
			rawimg = ctx.getImageData(0,0,canvas.width, canvas.height);
			input.value = '';
			imagedata.value = canvas.toDataURL('image/jpg');
		}
		reader.readAsDataURL(input.files[0]);
		bool = true;
	}
}