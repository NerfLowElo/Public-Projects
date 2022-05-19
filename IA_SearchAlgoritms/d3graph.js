console.log("script ");

var solutions;
var limit = document.getElementById("limit").value;

const fileSelector = document.getElementById('file-selector');
  
fileSelector.addEventListener('change', (event) => {
   	const fileList = event.target.files;
    console.log(fileList);
    readSingleFile(fileList);
  });

function readSingleFile(e) {
 	var file = e[0];
 	  if (!file) 
 	    return;	
 	var reader = new FileReader();
  	reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);

    solutions = getPoints(contents);
    //writeGraph(solutions);
  	};
  	reader.readAsText(file);

 }

 function displayContents(contents) {
   var element = document.getElementById('file-content');
   element.textContent = contents;
 }

function getPoints(contents) {
	var p = contents.split("\n");
	var points = [];


	for (const i of p) {
		const reg = /\((-{0,1}\d+,-{0,1}\d+)\)/g;
		
		const parsed = (i
    	.match(reg) || [])
    	.map((hit) => hit.replace('(', '').replace(')', ''))
    	.map((pair) => ({ x: parseInt(pair.split(',')[0]), y: parseInt(pair.split(',')[1]) }));
    	//console.log(parsed);
    	points.push(parsed);

	}
	return points;
	//console.log(points);
}


// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 30},
    width = 850 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var sVg = d3.select("#Area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  // translate this svg element to leave some margin.
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
var x = d3.scaleLinear()
    .domain([-limit, limit])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]);       // This is the corresponding value I want in Pixel
sVg
  .append('g')
  .attr("transform", "translate(0," + height/2 + ")")
  .call(d3.axisBottom(x));

// X scale and Axis
var y = d3.scaleLinear()
    .domain([-limit, limit])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]);       // This is the corresponding value I want in Pixel
sVg
  .append('g')
  .attr("transform", "translate(" + width/2 + ",0)")
  .call(d3.axisLeft(y));

function writeGraph(i) {
	

	sVg
  	.selectAll("circle")
  	.data(solutions[i])
  	.enter()
  	.append("circle")
    .attr("cx", function(d){ return x(d.x) })
    .attr("cy", function(d){ return y(d.y) })
    .attr("r", 3);
    
    sVg
     .selectAll(".label")
     .data(solutions[i])
     .enter()
     .append("text")
     .classed("label", true)
     .attr("x", function(d){ return x(d.x) + 5 })
     .attr("y", function(d){ return y(d.y) + 5 })
     .text(function(d){ return "(" + d.x + "," + d.y + ")"})
    
    sVg
    .selectAll(".line")
    .remove();
    
    sVg
    .selectAll(".line")
    .data([solutions[i]])
    .enter()	
    .append("path")
    .classed("line", true)
    .attr("d", d3.line()
  	  .x(function(d) { return x(d.x) })
  	  .y(function(d) { return y(d.y) }))
  	.attr("stroke", "black")
  	.attr("fill", "none");
}
