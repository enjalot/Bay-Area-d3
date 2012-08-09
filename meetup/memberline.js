var w = 800;

var svg = d3.select("#memberline");
svg.style("background-color", "E0E0DA");

var yoffset = 100;
var members = _.sortBy(members, function(d) {
    return new Date(d.joined);
})
//console.log(members)
//console.log(members[0]);
console.log(members.length);

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
    .range([50, w]);

//console.log(tscale(new Date(members[5].joined)))

var xscale = d3.scale.ordinal()
    .domain(members)
    .rangeBands([0, w])
    
var yscale = d3.scale.linear()
    .domain([0, members.length])
    .range([300, 0]);

var histscale = d3.scale.linear()
    .domain([0, d3.max(hvals)])
    .range([0, 150])
    
    
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
var hist = svg.selectAll("rect.hist")
    .data(hdata)
hist.enter()
    .append("rect")
  .classed("hist", true)
hist.attr("width", 2)
  	.attr("height", function(d,i) {
      return histscale(d.y);
  	})
  .attr("y", function(d) {
    return 150 - histscale(d.y);
  })
    .style("fill-opacity", 0.50592)
    .style("fill", "#0000ff")
    .attr("transform", function(d,i) {
        //console.log(tscale(new Date(d.joined)))
        //var x = i * 15
        var x = tscale(new Date(d.x)) + 2;
        var y = 243;
        return "translate(" + [x,y] + ")";
    })

//console.log("event", events)




  
  
var cumu_line = d3.svg.line()
    .x(function(d,i) {
      return tscale(new Date(d.x));
    })
    .y(function(d) {
      return yscale(d.y);
    })
   
    
var cumu_line_g = svg.selectAll("path")
    .data([cdata])
cumu_line_g.enter()
  .append("path")
    
cumu_line_g.attr("d", cumu_line)
  .style("fill", "none")
  .style("stroke", "#000")
  .attr("transform", "translate(" + [0, yoffset] + ")");
    

var evts = svg.selectAll("g.evt")
.data(events)
.enter()
.append("g").classed("evt", true)

evts.attr("transform", function(d,i) {
  var dt = new Date(d.time);
    var x = tscale(dt);
    //console.log(d.time)
  	//look up y value for the event in a slow way...
  var j;
  var y = yoffset + yscale(500);
  
  var c;
  for(j = cdata.length; j > 0; j--) {
    //console.log(j);
    c = cdata[j];
    if(!c) { continue;}
    if(dt < new Date(c.x)) { 
      y = yoffset + yscale(c.y);
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
.style("fill", "#1400FF");

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
  
//description
  /*
      var dy = 82;
evts.append("text")
  .text(function(d,i) {
    return d.name;
  })
  .attr("alignment-baseline", "central")
  .attr("text-anchor", "left")
  .attr("transform", function(d,i) {
    var y = (i % 2) * -dy + dy/2;
    var x = 0;
    return "translate(" + [x,y] + ")"
  })
evts.append("text")
  .text(function(d,i) {
    return d.venue_name;
  })
  .attr("alignment-baseline", "central")
  .attr("text-anchor", "left")
  .attr("dy", "1em")
  .style("fill", "#0000ff")
  .attr("transform", function(d,i) {
    var y = (i % 2) * -dy + dy/2;
    var x = 0;
    return "translate(" + [x,y] + ")"
  })*/

    
