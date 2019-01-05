/*
Pie chart to get percentage of likes,dislikes and comments
*/

// add the SVG element
d3.select("input[value=\"total\"]").property("checked", true);
var tempColor;
var svg_pie = d3.select("#chart3")
    .append("svg")
    .append("g")
//Append attributes
svg_pie.append("g")
    .attr("class", "slices");
svg_pie.append("g")
    .attr("class", "labelName");
svg_pie.append("g")
    .attr("class", "labelValue");
svg_pie.append("g")
    .attr("class", "lines");
//// set the dimensions 
var width = 960,
    height = 450,
    radius = Math.min(width, height) / 2;

//Define pie chart
var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
        console.log(d);
        return d.value;
    });

// Define arc for pie chart
var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

//Define radius
var legendRectSize = radius * 0.05;
var legendSpacing = radius * 0.02;

//append to html div
var div = d3.select("#chart3").append("div")

svg_pie.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Define color range
var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
    .range(colorRange.range());

//Load the data
datasetViews = [
    { category: "Gaming", value: 2 },
    { category: "Science & Technology", value: 4 },
    { category: "Howto & Style", value: 4 },
    { category: "Sports", value: 7 },
    { category: "Comedy", value: 5 },
    { category: "People & Blogs", value: 5 },
    { category: "Film & Animation", value: 8 },
    { category: "Entertainment", value: 20 },
    { category: "Music", value: 43 }
];

datasetLikes = [
    { category: "Gaming", value: 3 },
    { category: "Science & Technology", value: 3 },
    { category: "Howto & Style", value: 5 },
    { category: "Sports", value: 4 },
    { category: "Comedy", value: 6 },
    { category: "People & Blogs", value: 6 },
    { category: "Film & Animation", value: 6 },
    { category: "Entertainment", value: 16 },
    { category: "Music", value: 48 }
];

datasetDislikes = [
    { category: "Gaming", value: 7 },
    { category: "Science & Technology", value: 3 },
    { category: "Howto & Style", value: 4 },
    { category: "Sports", value: 4 },
    { category: "Comedy", value: 5 },
    { category: "People & Blogs", value: 7 },
    { category: "Film & Animation", value: 4 },
    { category: "Entertainment", value: 23 },
    { category: "Music", value: 36 }
];

//Change the chart depending on input
change_pie(datasetViews);


d3.selectAll("input")
    .on("change", selectDataset);
    
//select the dataset based on input
function selectDataset() {
    var value = this.value;
    if (value == "views") {
        change_pie(datasetViews);
    }
    else if (value == "likes") {
        change_pie(datasetLikes);
    }
    else if (value == "dislikes") {
        change_pie(datasetDislikes);
    }
}

function change_pie(data) {

    //PIE SLICES
    var slice = svg_pie.select(".slices").selectAll("path.slice")
        .data(pie(data), function (d) { return d.data.category });

    slice.enter()
        .insert("path")
        .style("fill", function (d) { return color(d.data.category); })
        .style("opacity", 0.7)
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function (d) {
            div.style("left", d3.event.pageX + 10 + "px");
            div.style("top", d3.event.pageY - 25 + "px");
            div.style("display", "inline-block");
            div.html((d.data.category) + "<br>" + (d.data.value) + "%");
        });
    slice
        .on("mouseout", function (d) {
            div.style("display", "none");
        });

    slice.exit()
        .remove();


    //Text Labels

    var text = svg_pie.select(".labelName").selectAll("text")
        .data(pie(data), function (d) { return d.data.category });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
            return (d.data.category + ": " + d.value + "%");
        });

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function (d) {
            console.log(d);
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })
        .text(function (d) {
            return (d.data.category + ": " + d.value + "%");
        });


    text.exit()
        .remove();

    //SLICE TO TEXT POLYLINES 

    var polyline = svg_pie.select(".lines").selectAll("polyline")
        .data(pie(data), function (d) { return d.data.category });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
};
