app.factory("ImageService", function(){
    function ImageService(){
        this.getCompressedImgSrc = function(imgSrc, imgType, currentSize, targetSize){
            if (currentSize <= targetSize){
                return imgSrc;
            }
            var imgElem = document.createElement("img");
            imgElem.src = imgSrc;

            var compressionAmt = Math.floor(targetSize/currentSize * 100);
            console.log(imgSrc);
            console.log(compressionAmt);
            console.log(imgType);
            var outputSrc = jic.compress(imgElem, compressionAmt, imgType).src;
            console.log(outputSrc);
        };

        /**
         * Sets transform to rotate the image based on its initial orientation.
         * Also ensures that the width and height are within the max bounds.
         */
        var _updateImgProperties = function(imgProp, maxWidth, maxHeight){
            if (imgProp.orientation === 8){
                var width = imgProp.height;
                var height = imgProp.width;
                imgProp.transform = "left";
            } else if (imgProp.orientation === 6){
                temp = imgProp.width;
                width = imgProp.height;
                height = imgProp.width;
                imgProp.transform = "right";
            } else{
                width = imgProp.width;
                height = imgProp.height;
            }
            if (width/maxWidth > height/maxHeight) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            imgProp.width = width;
            imgProp.height = height;
        };

        /**
         * Creates a canvas element, loads the image into the canvas, apply
         * the necessary transforms, then extract the data url from the canvas.
         */
        var _generateDataUrl = function(imgFile, imgProp, outputFormat){
            console.log(imgProp);
            var canvas = document.createElement('canvas');
            canvas.width = imgProp.width;
            canvas.height = imgProp.height;
            var img = new Image();
            var url = window.URL ? window.URL : window.webkitURL;
            img.src = url.createObjectURL(imgFile);
            return new Promise(function(resolve, reject){
                img.onload = function(e) {
                    url.revokeObjectURL(this.src);
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, 700, 600);
                    if(imgProp.transform === 'left') {
                        ctx.setTransform(0, -1, 1, 0, 0, imgProp.height);
                        ctx.drawImage(img, 0, 0, imgProp.height, imgProp.width);
                    } else if(imgProp.transform === 'right') {
                        ctx.setTransform(0, 1, -1, 0, imgProp.width, 0);
                        ctx.drawImage(img, 0, 0, imgProp.height, imgProp.width);
                    } else if(imgProp.transform === 'flip') {
                        ctx.setTransform(1, 0, 0, -1, 0, imgProp.height);
                        ctx.drawImage(img, 0, 0, imgProp.width, imgProp.height);
                    } else {
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.drawImage(img, 0, 0, imgProp.width, imgProp.height);
                    }
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var data = canvas.toDataURL(outputFormat);
                    resolve(data);
                };
            });
        }

        this.generateDataUrlFromFile = function(imgFile, outputFormat, maxWidth, maxHeight){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(e){
                    var binFile = new BinaryFile(e.target.result);
                    var exif = EXIF.readFromBinaryFile(binFile);
                    var imgProp = {
                        orientation: exif.Orientation,
                        width: exif.ImageWidth,
                        height: exif.ImageHeight,
                        transform: "none"
                    };
                    console.log(imgProp);
                    _updateImgProperties(imgProp, maxWidth, maxHeight);
                    _generateDataUrl(imgFile, imgProp, outputFormat).then(function(dataUrl){
                        resolve(dataUrl);
                    }, function(err){
                        reject(err);
                    });
                };
                reader.readAsBinaryString(imgFile);
            });
        };
    }
    return new ImageService();
});