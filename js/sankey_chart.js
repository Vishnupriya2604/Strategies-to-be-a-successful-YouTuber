/*
Sankey chart to show the flow of views,likes,dislikes and comments in each category of YouTube.
Reference: https://bost.ocks.org/mike/sankey/

*/

// set the dimensions of the canvas
var margin = {
    top: 1,
    right: 1,
    bottom: 9,
    left: 1
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

//Define font 
var fontScale = d3.scaleLinear()
  .range([8, 30]);

// format number
var formatNumber = d3.format(",.0f"),
  format = function(d) {
    return formatNumber(d.value);
  },
  color = d3.scaleOrdinal(d3.schemeCategory20);

// add the SVG element
var svg_sankey = d3.select("#chart2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//Add text
var weightText = svg_sankey.append("text")
  .attr("x", width/2)
  .attr("y", height)
  .style("font-size", "20px");

var sankey = d3.sankey()
  .nodeWidth(25)
  .nodePadding(10)
  .size([width, height]);

var path = sankey.link();

//Load data
//data/Data_Final/sankey.json 
d3.json("https://api.myjson.com/bins/613gq", function(category) {
  var empty_links = category.links.map(function(d) {
    d.id = d.source + " -> " + d.target;
    return {
      source: d.source,
      target: d.target,
      id: d.id,
      value: 1
    }
  });

  sankey
    .nodes(category.nodes)
    .links(empty_links)
    .layout(32);
   //console.log(encategoryergy.nodes)
   //console.log(empty_links)
  fontScale.domain(d3.extent(category.nodes, function(d) { return d.value }));

  //Add link
  var link = svg_sankey.append("g").selectAll(".link")
    .data(empty_links, function(d) { return d.id; })
    .enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function(d) {
      return Math.max(1, d.dy) + "px";
    })
    .sort(function(a, b) {
      return b.dy - a.dy;
    });

  link.append("title")
    .text(function(d) {
      return  d.source.name + " → " + d.target.name + "\n" + d.value;
    });

    //Add node
  var node = svg_sankey.append("g").selectAll(".node")
    .data(category.nodes, function(d) { return d.name; })
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    //Define chart
  node.append("rect")
    .attr("height", function(d) {
      return d.dy;
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function(d) {
      return d.color = color(d.name.replace(/ .*/, ""));
    })
    .style("stroke", function(d) {
      return d3.rgb(d.color).darker(1.8);
    })
    .append("title")
    .text(function(d) {
      return d.name + "\n" + format(d.value);
    });
//Append text
  node.append("text")
    .attr("x", -6)
    .attr("y", function(d) {
      return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .style("fill", function(d) {
      return d3.rgb(d.color).darker(2.4);
    })
    .text(function(d) {
      return d.name;
    })
    .style("font-size", function(d) {
      return Math.floor(fontScale(d.value)) + "px";
    })
    .filter(function(d) {
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

    //Link data and node
  function update(nodeData, linkData) {
    sankey
      .nodes(nodeData)
      .links(linkData)
      .layout(32);
    //console.log(nodeData)
    //console.log(linkData)
    sankey.relayout();
    fontScale.domain(d3.extent(nodeData, function(d) { return d.value }));
    //console.log(link)
    d3.select("div.parent").html("");
    d3.selectAll(".link").html("")
    link.append("title")
    .text(function(d) {
      return  d.source.name + " → " + d.target.name + "\n" + d.value;
    });
    svg_sankey.selectAll(".link")
      .data(linkData, function(d) { return d.id; })
      .sort(function(a, b) {
        return b.dy - a.dy;
      })
      .transition()
      .duration(1300)
      .attr("d", path)
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy) + "px";
      });

      svg_sankey.selectAll(".node")
      .data(nodeData, function(d) { return d.name; })
      .transition()
      .duration(1300)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      svg_sankey.selectAll(".node rect")
      .transition()
      .duration(1300)
      .attr("height", function(d) {
        return d.dy;
      });
      

      svg_sankey.selectAll(".node text")
      .transition()
      .duration(1300)
      .attr("y", function(d) {
        return d.dy / 2;
      })
      .style("font-size", function(d) {
        return Math.floor(fontScale(d.value)) + "px";
      });
  };

  var counter = 1;
  function toggleTransition() {
    counter++;
    var activeLinks = counter % 3 ? category.links : empty_links; 
    update(category.nodes, activeLinks);
    
  };
 document.getElementById("chart2").addEventListener("click", toggleTransition);

});

