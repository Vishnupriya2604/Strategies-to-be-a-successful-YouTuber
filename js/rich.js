/*
Bar chart to find out the richest YouTubers in USA
*/

// set the dimensions of the canvas
var margin = { left: 80, right: 20, top: 50, bottom: 200 };
var height = 700 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
var tempColor;

// set the ranges
var x = d3.scale.category10().rangeBands([0, width], .5);

var y = d3.scale.linear().range([height, 0]);

var tooltip = d3.select('#chart9').append('div')
    .attr("class", "tooltip")
    .style('position', 'absolute')
    .style('padding', '0px 10px')
    .style('background', 'white')
    .style('opacity', 0); //don't show initially

// Define axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
var svg_rich = d3.select("#chart9").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



// load the data
//Connected data to api so that it would be compatiable across all browsers
//data/Data_Final/Richest_youtubers.json
d3.json("https://api.myjson.com/bins/zrj1a", function (error, data) {

    data.forEach(function (d) {
        d.Name = d.Name;
        d.Net_Worth = d.Net_Worth;
        d.Subscribers = d.Subscribers;
    });

    // scale the range of the data
    x.domain(data.map(function (d) { return d.Name; }));
    y.domain([0, d3.max(data, function (d) { return d.Net_Worth; })]);

    // add axis
    svg_rich.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .text("US currency($)")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg_rich.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")


    //Add text
    svg_rich.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 100) + ")")
        .style("text-anchor", "middle")
        .text("Names of YouTubers");

    svg_rich.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("US currency($)");


    // Add bar chart
    svg_rich.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.Name); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.Net_Worth); })
        .attr("height", function (d) { return height - y(d.Net_Worth); })

        .on('mouseover', function (d) {

            tooltip.transition()
                .style('opacity', 0.9)

            tooltip.html(d3.format(".2s")(d.Subscribers) + "<br/>" + "Subscribers")
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 4830) + 'px')


        })

        .on('mouseout', function () {
            tooltip.transition()
                .style('opacity', 0)

        })

});
