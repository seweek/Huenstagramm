window.onload = function(){
	var input = document.getElementById("input");
	var glitchButton = document.getElementById("glitch");
	var imgContainer = document.getElementById("container");
	var canvas = document.getElementById("image");
	glitchButton.onclick = function(){
		var ctx = canvas.getContext('2d');
		var data = ctx.getImageData(0,0,canvas.width, canvas.height);
		glitch(data, {amount: 10, seed: 45, iterations: 30, quality: 30}, function(data){
			ctx.putImageData(data, 0, 0);
		})
	}
	input.onchange = function(){
		var reader = new FileReader();
		reader.onload = function(event){
			var img = new Image();
			img.src = event.target.result;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
		}
		reader.readAsDataURL(input.files[0]);
	}
}