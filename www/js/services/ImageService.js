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
    }
    return new ImageService();
});