//Code Created By Benjamin Luzier

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 15.0;\n' + //Set point size to 15
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function main() { //main code for the canvas It is called by the html onload and it does the main processing to get the webgl content ready and sets up the shaders. It also processes the initial mouse presses and its end result is to display the canvas and what gets printed on it.

    var canvas = document.getElementById('webgl'); //retrieves canvas element

    var gl = getWebGLContext(canvas); //Get the rendering context for WebGL
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Register function (event handler) to be called on a mouse press it processes whether or not the mouse is pressed
  canvas.onmousedown = function(ev){ 
    var isDrawing = true;
    canvas.onmousemove = function(ev) {
        if (isDrawing) {
            click(ev, gl, canvas, a_Position, u_FragColor);
        }
    };
    canvas.onmouseup = function() {
        isDrawing = false;
        canvas.onmousemove = null;
    };
    click(ev, gl, canvas, a_Position, u_FragColor);
  };
    
    gl.clearColor(0.0, 0.5, 0.0, 1.0); //Set clear color
    gl.clear(gl.COLOR_BUFFER_BIT); //clear canvas
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
function click(ev, gl, canvas, a_Position, u_FragColor) { //Is called by main when the mouse is clicked. Its input is whether the mouse is clicked, the frag color, the position, the canvas, and gl. It processes the position of the mouse and determines the color. Its end result is mapping the correct colored pixel to the canvas.
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);
  // Store the coordinates to g_points array
  if (y >= 0.5) {      // Top 
    g_colors.push([0.0, 0.0, 1.0, 1.0]);  // Blue
  } else if (y < 0.5 && y >= -0.5) { //  Middle
    g_colors.push([0.0, 0.0, 0.0, 1.0]);  // Black
  } else if (y < -0.5) {                         // Bottom
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  }

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}