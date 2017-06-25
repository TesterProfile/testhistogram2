//margins, width, and height of the chart
var margin = {top: 20, right: 30, bottom: 50, left: 70},
    width = 1344 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

//create chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//x axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.20);

//y axis
var y = d3.scale.linear()
    .range([height, 0]);

//define x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//define y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
	
//This creates the tooltip div that will appear.
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

	
var barDataByName = []; // data sorted by name
var barDataByCount = []; // data sorted by count
		
		

//read data from file
d3.tsv("histogramdata.tsv", type, function(error, data) {

	// copy data and then sort by count
	barDataByCount = data.slice();
	barDataByCount = barDataByCount.sort(function(a,b) { return d3.ascending(a.count, b.count)});
	
	// copy data and then sort by name
	barDataByName = data.slice();
	barDataByName = barDataByName.sort(function(a,b) { return d3.ascending(a.name, b.name)});
	
	//calls create function
	create(data);
		
});


d3.select("svg")
	// when mouse is clicked
	.on("mousedown", function() {
		var xCord = d3.mouse(this)[0];
		var yCord = d3.mouse(this)[1];
		
		
		
		// if click left of y axis
		if (xCord <= 69) {
			//delete current bars
			chart.selectAll(".bar").remove();
			chart.selectAll("text").remove();
			
			// create new bars sorted by count
			create(barDataByCount.reverse());
			
		}
		
		// if click below x axis
		else if (yCord >= 650) {
			chart.selectAll(".bar").remove();
			chart.selectAll("text").remove();
			
			//create new bars sorted by name
			create(barDataByName.reverse());
		}
		
	});

function type(d) {
    d.count = +d.count; // coerce to number
    return d;
}

// function that takes data to create the rest of the chart and bars
function create(data) {
	
	//define the domains of x and y dimensions
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // x axis
    chart.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(0," + height + ")") //moves axis to bottom of chart
	   .call(xAxis);

	// x axis label
	chart.append("text")
		.attr("x", width / 2 ) // positions text at half of chart width
        .attr("y",  height + margin.bottom ) // positions text below bottom margin
		.style("text-anchor", "middle") // center text
		.text("Location")
	   
    // y axis
    chart.append("g")
	   .attr("class", "axis")
	   .call(yAxis);
	   
	// y axis label   
	chart.append("text")
        .attr("transform", "rotate(-90)") //rotates text
        .attr("y",0 - margin.left) // positions text behind left margin
        .attr("x",0 - (height / 2)) // positions text at half of chart height
        .attr("dy", "1em")
        .style("text-anchor", "middle") // center text
        .text("Number of Visits Per Day");
		
	
	
    //create bars
    chart.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.name); }) //x position
		.attr("y", function(d) { return y(d.count); })//y position
		.attr("height", function(d) { return height - y(d.count); })//size of rectangle
		.attr("width", x.rangeBand()) //width
		//Creates the mouseover function that spawns the tooltip
		 .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.fullname + "<br/>" + d.count)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");})
		//Creates mouseout function that makes the tooltip disappear
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);})
    
		
	
}
