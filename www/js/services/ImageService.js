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

        this.generateDataUrlFromFile = function(imgFile, maxWidth, maxHeight){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(e){
                    // var binFile = new BinaryFile(e.target.result);
                    var exif = EXIF.readFromBinaryFile(e.target.result);
                    var mpImg = new MegaPixImage(imgFile);
                    var img = new Image();
                    mpImg.render(img, {
                        maxWidth: maxWidth,
                        maxHeight: maxHeight,
                        orientation: exif.Orientation
                    });
                    img.onload = function(){
                        resolve(img.src);
                    };
                };
                // reader.readAsBinaryString(imgFile);
                reader.readAsArrayBuffer(imgFile);
            });
        };
    }
    return new ImageService();
});
