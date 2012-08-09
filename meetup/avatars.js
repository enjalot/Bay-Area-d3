var w = 800;

var svg = d3.select("#avatarsvg");
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
 
    
var nx = 20;
var aw = 40;
var as = 5;
//avatars
var avatars = svg.append("g");
var avis = avatars.selectAll("image")
    .data(members)
    .enter()
    .append("image");
avis.attr("xlink:href", function(d) {
  return d.photo_url;
})
  .attr("width", aw)
  .attr("height", aw)
  .attr("transform", function(d,i) {
    var x = i % nx * (aw + as);
    var y = parseInt(i/nx) * (aw + as);
    return "translate(" + [x,y] + ")";
  })
  
  
  
 
  
  
  
  
  
    
