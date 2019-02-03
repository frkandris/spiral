// Angular application start
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

  // init
  $scope.image = "safranek";
  $scope.maxLineWidth = "5";
  $scope.lineDistance = "0";
  generateSpiral($scope.image, parseInt($scope.maxLineWidth), parseInt($scope.lineDistance));

  // onChange
  $scope.onNgChange = function() {
    generateSpiral($scope.image, parseInt($scope.maxLineWidth), parseInt($scope.lineDistance));
  };

});
// Angular application end


function generateSpiral(image, maxLineWidth, lineDistance) {

  // load source image

  switch (image) {
    case 'safranek':
      var imgSrc = 'images/safranek.png';
      break;
    case 'bradpitt':
      var imgSrc = 'images/bradpitt.png';
      break;
    default:
      var imgSrc = 'images/safranek.png';
      break;
  }

  var img = new Image();
  img.src = imgSrc + '?' + new Date().getTime();
  // img.setAttribute('crossOrigin', '');


  // wait for image load, continue afterwards

  img.onload = function () { 

    // console.log("image loaded.");

    // init variables

    var maxPointSize = maxLineWidth;

    // init canvases

    var imageWidth = img.width;
    var imageHeight = img.height;

    cOriginCanvas = document.getElementById("myCanvasOrigin");
    cOriginCanvas.height = imageHeight;
    cOriginCanvas.width = imageWidth;
    cOrigin = cOriginCanvas.getContext("2d");

    cResultCanvas = document.getElementById("myCanvasResult");
    cResultCanvas.height = imageHeight;
    cResultCanvas.width = imageWidth;
    cResult = cResultCanvas.getContext("2d");

    cOrigin.drawImage(img, 0, 0); 


    // reset variables

    var canvasWidth = imageWidth;
    var canvasHeight = imageHeight;

    // generate array with point coordinates

    pointCoordinatesArray = createEquidistantPointsAlongAnArchimedeanSpiral(canvasWidth, canvasHeight, maxPointSize, lineDistance);

    // start animation, draw first frame

    var p = 0; // reset iterationcounter
    
    while (p < pointCoordinatesArray.length - 1) {
      iterateStuff(p, pointCoordinatesArray, maxPointSize);
      p++;
    } // end while
  }

} // end of GenerateCat function


function iterateStuff(p, pointCoordinatesArray, maxPointSize){

  // console.log("iteration: "+p);

  var x1 = pointCoordinatesArray[p].x;
  var y1 = pointCoordinatesArray[p].y;
  var pointSize1 = maxPointSize * getPointSize(x1, y1, cOrigin);

  var x2 = pointCoordinatesArray[p+1].x;
  var y2 = pointCoordinatesArray[p+1].y;
  var pointSize2 = maxPointSize * getPointSize(x2, y2, cOrigin);

  driveLineRounded(cResult, x1, y1, x2, y2, pointSize1, pointSize2);

} // end of iterateStuff function



// get the radius of a point that needs to be put
function getPointSize(x, y, canvas){

  var color = canvas.getImageData(x, y, 1, 1).data; 
  var monoColor = (0.2125 * color[0]) + (0.7154 * color[1]) + (0.0721 * color[2]);
  var monoColorNormaled = monoColor/255;
  var pointSize = 1 - monoColorNormaled;
  if (pointSize < 0) pointSize = 0;

  // console.log(pointSize);

  return pointSize;
  
} // end of getPointSize function


// varLineRounded : draws a line from A(x1,y1) to B(x2,y2)
// that starts with a w1 width and ends with a w2 width.
// relies on fillStyle for its color.
// ctx is a valid canvas's context2d.
// code from https://gamealchemist.wordpress.com/2013/08/28/variable-width-lines-in-html5-canvas/
function driveLineRounded(ctx, x1, y1, x2, y2, w1, w2) {
  var dx = (x2 - x1),  shiftx = 0;
  var dy = (y2 - y1),  shifty = 0;
  w1 /= 2;   w2 /= 2; // we only use w1/2 and w2/2 for computations.    
  // length of the AB vector
  var length = Math.sqrt( (dx*dx) + (dy*dy) );
  if (!length) return; // exit if zero length
  dx /= length ;    dy /= length ;
  shiftx = - dy * w1 ;  // compute AA1 vector's x
  shifty =   dx * w1 ;  // compute AA1 vector's y
  var angle = Math.atan2(shifty, shiftx);
  ctx.beginPath();
  ctx.moveTo(x1 + shiftx, y1 + shifty);
  ctx.arc(x1,y1, w1, angle, angle+Math.PI); // draw A1A2
  shiftx =  - dy * w2 ;  // compute BB1 vector's x
  shifty =    dx * w2 ;  // compute BB1 vector's y
  ctx.lineTo(x2 - shiftx, y2 - shifty); // draw A2B1
  ctx.arc(x2,y2, w2, angle+Math.PI, angle); // draw A1A2    
  ctx.closePath(); // draw B2A1
  ctx.fill();    
} // end of varLineRounded function


// calculate equidistant point coordinates along an archimedian spiral
// based on https://stackoverflow.com/questions/13894715/draw-equidistant-points-on-a-spiral
function createEquidistantPointsAlongAnArchimedeanSpiral(canvasWidth, canvasHeight, maxPointSize, lineDistance) {
  var width = canvasWidth,
      height = canvasHeight;

  var centerX = width/2,
      centerY = height/2,
      radius = width/2,
      coils = canvasWidth / 2 / (maxPointSize + lineDistance);
  
  var rotation = 2 * Math.PI;
  var thetaMax = coils * 2 * Math.PI;
  var awayStep = radius / thetaMax;
  var chord = 2;

  var points = [];

  for ( theta = chord / awayStep; theta <= thetaMax; ) {
      away = awayStep * theta;
      around = theta + rotation;
    
      x = centerX + Math.cos ( around ) * away;
      y = centerY + Math.sin ( around ) * away;

      theta += chord / away;
    
      points.push({x: x, y: y});
  }
  return points;
}