window.onload = function(){
	var input = document.getElementById("input");
	var imagedata = document.getElementById("imagedata");
	var glitchButton = document.getElementById("glitch");
	var imgContainer = document.getElementById("container");
	var canvas = document.getElementById("image");
	glitchButton.onclick = function(){
		var ctx = canvas.getContext('2d');
		var data = ctx.getImageData(0,0,canvas.width, canvas.height);
		glitch(data, {amount: 10, seed: 45, iterations: 30, quality: 30}, function(data){
			ctx.putImageData(data, 0, 0);
			imagedata.value = canvas.toDataURL('image/jpg');
		})
		
	}
	input.onchange = function(){
		var reader = new FileReader();
		reader.onload = function(event){
			var img = new Image();
			img.src = event.target.result;
			var ctx = canvas.getContext('2d');
			var width = img.width;
			var height = img.height;
			ctx.drawImage(img, 0, 0, {}, {},{},{}, width, height);
			input.value = '';
			imagedata.value = canvas.toDataURL('image/jpg');
		}
		reader.readAsDataURL(input.files[0]);
	}
}