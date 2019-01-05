/*
JS for top trending videos.
*/

// set the dimensions of the canvas
var margin = { left: 80, right: 20, top: 50, bottom: 200 };
var height = 700 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
var tempColor;

// set the ranges
var x = d3.scale.category10().rangeBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

//Define tooltip
var tooltip = d3.select('#chart').append('div')
    .style('position', 'absolute')
    .style('padding', '0px 10px')
    .style('background', 'white')
    .style('opacity', 0); //don't show initially

//Define Axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


var tooltip = d3.select('#chart').append('div')
    .attr("class", "tooltip")
    .style('opacity', 0);


// add the SVG element
var svg_bars = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



// load the data
//Connected data to api so that it would be compatiable across all browsers
//data/Data_Final/Count_of_videos.json
d3.json("https://api.myjson.com/bins/1fhji2", function (error, data) {

    data.forEach(function (d) {
        d.Category = d.Category;
        d.Number_of_videos = d.Number_of_videos;
    });


    // scale the range of the data
    x.domain(data.map(function (d) { return d.Category; }));
    y.domain([0, d3.max(data, function (d) { return d.Number_of_videos; })]);

    // add axis
    svg_bars.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .text("Categories of YouTube Videos")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg_bars.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")


    //Add text
    svg_bars.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 60) + ")")
        .style("text-anchor", "middle")
        .text("Video Categories");

    svg_bars.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Videos");


    // Add bar chart
    svg_bars.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.Category); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.Number_of_videos); })
        .attr("height", function (d) { return height - y(d.Number_of_videos); })
        
    //Add mouse events
        .on('mouseover', function (d) {

            tooltip.transition()
                .style('opacity', 0.9)

            tooltip.html(d.Number_of_videos + "<br/>" + "Videos")
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 1030) + 'px')

            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', 0.5)
                .style('fill', 'tempColor')
        })

        .on('mouseout', function () {
            tooltip.transition()
                .style('opacity', 0)
            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', 1)
                .style('fill', 'tempColor')
        })

});
