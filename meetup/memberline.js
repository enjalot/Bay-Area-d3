
var svg = d3.select("#memberline");
svg.style("background-color", "E0E0DA");

var members = _.sortBy(members, function(d) {
    return new Date(d.joined);
})
//console.log(members)
//console.log(members[0]);
//console.log(members.length);

var w = 640;
var h = 300;

var xoffset = 100;
var yoffset = 112;


var histoffset = 365;

var joined = _.map(_.pluck(members, "joined"), function(d) {
    return new Date(d);
});

var cumu_joined = {};
var joined_hist = {};
var n = 0;
var rd;
joined.forEach(function(d,i) {
  n+=1;
  rd = new Date(d);
  rd.setHours(0);
  rd.setMinutes(0);
  rd.setSeconds(0);
  rd = rd.toString();
  cumu_joined[rd] = n;
  if(!joined_hist[rd]) {
    joined_hist[rd] = 1;
  } else {
    joined_hist[rd] += 1;
  }
});
var cdates = _.keys(cumu_joined);
var cvals = _.values(cumu_joined);
var hvals = _.values(joined_hist);
//depending on keys and values coming back in the right order..
//i don't think cumu_joined is in order tho, but we stitch it back into an array
cdata = [];
cdates.forEach(function(d,i) {
  cdata.push({x: cdates[i], y: cvals[i]});
})
  
hdata = [];
cdates.forEach(function(d,i) {
  hdata.push({x: cdates[i], y: hvals[i]});
})
//console.log("cvals", cvals);

var tmin = d3.min(joined);
var mmax = d3.max(joined);

var emax = d3.max(events, function(d) {
  return new Date(d.time);
})
var tmax = d3.max([mmax, emax]);

var rsvpmax = d3.max(events, function(d) {
  return parseInt(d.rsvpcount);
})

var tscale = d3.time.scale()
    .domain([tmin, tmax])
    .range([0, w]);

//console.log(tscale(new Date(members[5].joined)))

var xscale = d3.scale.ordinal()
    .domain(members)
    .rangeBands([0, w])
    
var yscale = d3.scale.linear()
    .domain([0, members.length])
    .range([h, 0]);

var histscale = d3.scale.linear()
    .domain([0, d3.max(hvals)])
    .range([0, 101])
    
    
    
var circlescale = d3.scale.sqrt()
    .domain([0, rsvpmax])
    .range([10, 20])



/*
var membs = svg.selectAll("rect.memb")
    .data(members)
    
membs.enter()
    .append("rect")
  .classed("memb", true)
membs.attr("width", 2)
    .attr("height", 30)
    .style("fill-opacity", 0.1)
    .style("fill", "#0000ff")
    .attr("transform", function(d,i) {
        //console.log(tscale(new Date(d.joined)))
        //var x = i * 15
        var x = tscale(new Date(d.joined));
        var y = 395;
        return "translate(" + [x,y] + ")" + "rotate(" + -40 +")";
    })
*/
var hist = svg.append("g").classed("histogram", true)
    .attr("transform", "translate(" + [xoffset, yoffset + histoffset] +")")
var hists = hist
    .selectAll("rect.hist")
    .data(hdata)
hists.enter()
    .append("rect")
  .classed("hist", true)
hists.attr("width", 2)
  	.attr("height", function(d,i) {
      return histscale(d.y);
  	})
  .attr("y", function(d) {
    return histscale.range()[1] - histscale(d.y);
  })
    .style("fill-opacity", 0.65)
    .style("fill", "#1C85BA")
    .attr("transform", function(d,i) {
        //console.log(tscale(new Date(d.joined)))
        //var x = i * 15
        var x = tscale(new Date(d.x)) + 2;
        return "translate(" + [x,0] + ")";
    })

//console.log("event", events)
hist.append("text")
  .text("per day")
  .style("text-anchor", "end")
  .style("alignment-baseline", "middle")
  .attr("y", histscale.range()[1]/2)
  .attr("x", -15)
  .style("font-size","16")
  .style("fill","#606164")
  


hist.append("text")
  .text(0)
  .style("text-anchor", "end")
  .style("alignment-baseline", "middle")
  .attr("y", histscale.range()[1])
  .attr("x", -15)
  .style("font-size","16")
  .style("fill","#606164")
  

hist.append("text")
  .text(42)
  .style("text-anchor", "end")
  .style("alignment-baseline", "middle")
  .attr("y", histscale.range()[0])
  .attr("x", -15)
  .style("font-size","16")
  .style("fill","#606164")
  

  
  
//AXIS stuff
var yaxisdata = [0, 100, 200, 300, 400, 500];
var xaxisdata =["February", "March", "April", "May", "June", "July", "August"];

//draw y axis lines
var yaxislines = svg.append("g")
    .attr("transform", "translate(" + [xoffset, yoffset] +")")
    .selectAll("line")
    .data(yaxisdata)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", w)
    .attr("y1", function(d) {
      return yscale(d);
    })
    .attr("y2", function(d) {
      return yscale(d);
    })
    .style("stroke", "#FFFFFF")
    .style("stroke-width", 3)
    .attr("stroke-dasharray", [3, 4])
            
  
var yaxistext = svg.append("g")
    .attr("transform", "translate(" + [xoffset, yoffset] +")")
    .selectAll("text")
    .data(yaxisdata)
    .enter()
    .append("text")
    .text(function(d) {
      if(d === 0) {
        return "zero";
      }
      return d;
    })
    .attr("y", function(d) {
      return yscale(d) + 1;
    })
    .attr("x", -10)
    .style("text-anchor", "end")
    .style("alignment-baseline", "middle")
    .style("font-family", "Share")
    .style("font-size","20")
    .style("fill","#606164")
  
    
var xaxisscale = d3.scale.ordinal()
    .domain(d3.range(xaxisdata.length))
    .rangeBands([0, w], 0)
var xaxistext = svg.append("g")
    .attr("transform", "translate(" + [xoffset, h + yoffset + 20] +")")
    .selectAll("text")
    .data(xaxisdata)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("x", function(d,i) {
      return xaxisscale(i) + 50;
    })
    
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style("font-family", "Share")
  	.style("font-size","20")
    .style("fill","#B4B3AE")
 
  
  

  
  
var cumu_line = d3.svg.line()
    .x(function(d,i) {
      return tscale(new Date(d.x));
    })
    .y(function(d) {
      return yscale(d.y);
    })
   
    
var cumu_line_g = svg.append("g").classed("cumulative", true)
    .selectAll("path")
    .data([cdata])
cumu_line_g.enter()
  .append("path")
    
cumu_line_g.attr("d", cumu_line)
  .style("fill", "none")
  .style("stroke", "#666666")
  .style("stroke-width", 2)
  .attr("transform", "translate(" + [xoffset, yoffset] + ")");
    

var evts = svg.append("g")
    .classed("events", true)
    .attr("transform", "translate(" + [xoffset, yoffset] +")")
    .selectAll("g.evt")
.data(events)
.enter()
.append("g").classed("evt", true)

evts.attr("transform", function(d,i) {
  var dt = new Date(d.time);
    var x = tscale(dt);
    //console.log(d.time)
  	//look up y value for the event in a slow way...
  var j;
  var y = yscale(500);
  
  var c;
  for(j = cdata.length; j > 0; j--) {
    //console.log(j);
    c = cdata[j];
    if(!c) { continue;}
    if(dt < new Date(c.x)) { 
      y = yscale(c.y);
    }
  }
    return "translate(" + [x,y] + ")";

})

//console.log(events.length);
evts
  .append("circle").classed("c1", true)
  .attr("r", function(d) {
    return circlescale(parseInt(d.rsvpcount)) * 0.9;
  })
  .attr("cy", 4)
.style("fill", "#1C85BA");

evts
  .append("circle").classed("c2", true)
  .attr("r", function(d) {
    return circlescale(parseInt(d.rsvpcount));
  })
.style("fill", "#FFFFFF")
.style("fill-opacity", 1)
  
evts.append("text")
  .text(function(d,i) {
    return i + 1;
  })
  .attr("alignment-baseline", "central")
  .attr("text-anchor", "middle")
  .style("fill","#1C85BA")
  .style("font-size","17")
  
  
  
evts.on("mouseover", function() {
    d3.select(this).selectAll("text.label")
      .style("display", "")
  })
  .on("mouseout", function() {
     d3.select(this).selectAll("text.label")
      .style("display", "none")
  })
//description
  
var labeldeltas = [
  {x: -26, y: 28},
  {x: -12, y: 33},
  {x: 21, y: 8},
  {x: 25, y: 14},
  {x: 8, y: 30},
  {x: -2, y: 33},
  {x: 5, y: 30},
  {x: 10, y: 33},
  {x: -71, y: -36},
  {x: -72, y: -35}
]  
    
  
var dy = 0;
var evtlabels = evts.append("g")
    .classed("evtlabels", true);
evtlabels
  .append("text")
  .classed("label", true)
  .text(function(d,i) {
    return d.name;
  })
  .attr("alignment-baseline", "central")
  .attr("text-anchor", "left")
    .style("fill", "#666666")
  .attr("transform", function(d,i) {
    //var y = (i % 2) * -dy + dy/2;
    //var x = 0;
    var x = labeldeltas[i].x
    var y = labeldeltas[i].y
    return "translate(" + [x,y] + ")"
  })
  .style("display", "none")
  
evtlabels.append("text")
    .classed("label", true)
  .text(function(d,i) {
    return d.venue_name;
  })
  .attr("alignment-baseline", "central")
  .attr("text-anchor", "left")
  .attr("dy", "1em")
  .style("fill", "#1C85BA")
  .attr("transform", function(d,i) {
    //var y = (i % 2) * -dy + dy/2;
    //var x = 0;
    var x = labeldeltas[i].x
    var y = labeldeltas[i].y
    return "translate(" + [x,y] + ")"
  })
  .style("display", "none")


          
svg.selectAll("text").style("font-family", "Share") 
    
