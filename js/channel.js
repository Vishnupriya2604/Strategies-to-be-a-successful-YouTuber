/*
 * Create node directed image graph to find and display Top channels in YouTube.
 * Reference: http://bl.ocks.org/eesur/be2abfb3155a38be4de4
 */

// some colour variables
var tcBlack = "#130C0E";

// rest of vars
var w = 960,
    h = 800,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;

var vis;
var force = d3.layout.force();

// add the SVG element
vis = d3.select("#chart4").append("svg").attr("width", w).attr("height", h);

//Add the data
//Connected data to api so that it would be compatiable across all browsers
//d3.json("data/Data_Final/channel.json", function(json) {
d3.json("https://api.myjson.com/bins/tpxmi", function (json) {

    //console.log(json);
    root = json;
    //root.fixed = true;
    root.x = w / 2;
    root.y = h / 4;

    // Build the path
    var defs = vis.insert("svg:defs")
        .data(["end"]);

    //Append the path
    defs.enter().append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    update();
});

/**
 *   Update function to add nodes to each root
 */
function update() {
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    force.nodes(nodes)
        .links(links)
        .gravity(0.05)
        .charge(-1500)
        .linkDistance(100)
        .friction(0.5)
        .linkStrength(function (l, i) { return 1; })
        .size([w, h])
        .on("tick", tick)
        .start();

    //Define link to path
    var path = vis.selectAll("path.link")
        .data(links, function (d) { return d.target.id; });

    //For every data element
    path.enter().insert("svg:path")
        .attr("class", "link")
        .style("stroke", "#eee");


    // Exit any old paths.
    path.exit().remove();

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id; });


    // Enter any new nodes.
    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", click)
        .call(force.drag);

    // Append a circle
    nodeEnter.append("svg:circle")
        .attr("r", function (d) { return Math.sqrt(d.size) / 10 || 4.5; })
        .style("fill", "#eee");


    // Append images
    var images = nodeEnter.append("svg:image")
        .attr("xlink:href", function (d) { return d.img; })
        .attr("x", function (d) { return -25; })
        .attr("y", function (d) { return -25; })
        .attr("height", 50)
        .attr("width", 50);


    // make the image grow a little on mouse over and add the text details on click
    var setEvents = images
        // Append text and link
        .on('click', function (d) {
            d3.select("h2").html(d.Channel_title);
            d3.select("h3").html("Take me to " + "<a href='" + d.link + "' >" + d.Channel_title + " web page ⇢" + "</a>");
        })
        //mouse events
        .on('mouseenter', function () {
            // select element in current context
            d3.select(this)
                .transition()
                .attr("x", function (d) { return -60; })
                .attr("y", function (d) { return -60; })
                .attr("height", 100)
                .attr("width", 100);
        })
        // set back
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .attr("x", function (d) { return -25; })
                .attr("y", function (d) { return -25; })
                .attr("height", 50)
                .attr("width", 50);
        });

    // Append name on roll over next to the node as well
    nodeEnter.append("text")
        .attr("class", "nodetext")
        .attr("x", x_browser)
        .attr("y", y_browser + 15)
        .attr("fill", tcBlack)
        .text(function (d) { return d.Channel_title; });


    // Exit any old nodes.
    node.exit().remove();


    // Re-select for update.
    path = vis.selectAll("path.link");
    node = vis.selectAll("g.node");

    function tick() {


        path.attr("d", function (d) {

            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + ","
                + d.source.y
                + "A" + dr + ","
                + dr + " 0 0,1 "
                + d.target.x + ","
                + d.target.y;
        });
        node.attr("transform", nodeTransform);
    }
}


/**
 * Gives the coordinates of the border for keeping the nodes inside a frame
 * http://bl.ocks.org/mbostock/1129492
 */
function nodeTransform(d) {
    d.x = Math.max(maxNodeSize, Math.min(w - (d.imgwidth / 2 || 16), d.x));
    d.y = Math.max(maxNodeSize, Math.min(h - (d.imgheight / 2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
}

/**
 * Toggle children on click.
 */
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }

    update();
}


/**
 * Returns a list of all nodes under the root.
 */
function flatten(root) {
    var nodes = [];
    var i = 0;

    function recurse(node) {
        if (node.children)
            node.children.forEach(recurse);
        if (!node.id)
            node.id = ++i;
        nodes.push(node);
    }

    recurse(root);
    return nodes;
}

