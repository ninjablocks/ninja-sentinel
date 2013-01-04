/**
 * Cycles through an array of spectrum colors and animates their transition
 * @param  {Array} colorArray String array of CSS colors
 */
$.fn.spectrum=function(colorArray, intervalArray){
  return this.each(function(){
    var self=$(this);
    (function spectrum(){
      var hue=colorArray.shift();
      var interval = intervalArray.shift();
      // colorArray.push(hue);
      // intervalArray.push(interval);
      if (hue && interval) {
        self.animate({ backgroundColor: hue }, interval , spectrum);
      } else {
        self.stop(true, true);
        self.css({backgroundColor: 'transparent'});
      }

    })();
  });
};
