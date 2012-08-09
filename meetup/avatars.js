var w = 780;

var svg = d3.select("#avatarsvg");
svg.style("background-color", "E0E0DA");

var xoffset = 40;
var yoffset = 10;
var members = _.sortBy(members, function(d) {
    return new Date(d.joined);
})
//members = members.slice(0, 40);
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
var aw = 35;
var as = 1;
//avatars
var avatars = svg.append("g").classed("avatars", true)
   .attr("transform", "translate(" + [xoffset, yoffset]+ ")");
var avis = avatars.selectAll("image")
    .data(members)
    .enter()
    .append("image")
    .attr("transform", function(d,i) {
    var x = i % nx * (aw + as);
    var y = parseInt(i/nx) * (aw + as);
    return "translate(" + [x,y] + ")";
  })
  .attr("xlink:href", function(d) {
  	return d.photo_url;
  })
  .attr("width", aw)
  .attr("height", aw)
  .on("mouseover", function(d,i) {
    avatars.selectAll("g.avitxt")
      .filter(function(c) {
        return c.name === d.name;
      })
      .style("display", "")
  })
  .on("mouseout", function(d,i) {
    avatars.selectAll("g.avitxt")
      .filter(function(c) {
        return c.name === d.name;
      })
      .style("display", "none")
  })

   

var avatars = svg.append("g")
    .classed("avatars", true)
    .attr("transform", "translate(" + [xoffset, yoffset]+ ")");

var avitxt = avatars.selectAll("g.avitxt")
    .data(members)
    .enter()
    .append("g")
    .classed("avitxt", true)
    .attr("transform", function(d,i) {
    var x = i % nx * (aw + as) + aw/2;
    var y = parseInt(i/nx) * (aw + as) + aw + 13;
    return "translate(" + [x,y] + ")";
  })
  .style("display", "none");

//.attr("width", aw*3)
//.attr("x", -aw*3/2)
var charw = 12;
  avitxt
    .append("rect")
    .attr("width", function(d,i) {
      var rw = d.name.length * charw;
      return rw;
    })
    .attr("x", function(d,i) {
      var rw = d.name.length * charw;
      return -rw/2;
    })
    
   .attr("height", 35 * 0.9)
    .attr("y", -3)
    .attr("rx", 6)
    .style("fill", "#1C85BA")
  avitxt
    .append("rect")
    .attr("height", 35)
    .attr("width", function(d,i) {
      var rw = d.name.length * charw;
      return rw;
    })
    .attr("x", function(d,i) {
      var rw = d.name.length * charw;
      return -rw/2;
    })
    .attr("y", -10)
    .attr("rx", 4)
    .style("fill", "#fff")
    avitxt
    .append("text")
    .text(function(d) {
      return d.name;
    })
    .style("alignment-baseline", "hanging")
    .style("text-anchor", "middle")
      .style("font-family","Share")
      .style("fill","")
      .style("font-size","20")
      



  d3.fisheye = {
    scale: function(scaleType) {
      return d3_fisheye_scale(scaleType(), 3, 0);
    },
    circular: function() {
      var radius = 200,
          distortion = 2,
          k0,
          k1,
          focus = [0, 0];

      function fisheye(d) {
        var dx = d.x - focus[0],
            dy = d.y - focus[1],
            dd = Math.sqrt(dx * dx + dy * dy);
        if (!dd || dd >= radius) return {x: d.x, y: d.y, z: 1};
        var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
        return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
      }

      function rescale() {
        k0 = Math.exp(distortion);
        k0 = k0 / (k0 - 1) * radius;
        k1 = distortion / radius;
        return fisheye;
      }

      fisheye.radius = function(_) {
        if (!arguments.length) return radius;
        radius = +_;
        return rescale();
      };

      fisheye.distortion = function(_) {
        if (!arguments.length) return distortion;
        distortion = +_;
        return rescale();
      };

      fisheye.focus = function(_) {
        if (!arguments.length) return focus;
        focus = _;
        return fisheye;
      };

      return rescale();
    }
  };

  function d3_fisheye_scale(scale, d, a) {

    function fisheye(_) {
      var x = scale(_),
          left = x < a,
          v,
          range = d3.extent(scale.range()),
          min = range[0],
          max = range[1],
          m = left ? a - min : max - a;
      if (m == 0) m = max - min;
      return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
    }

    fisheye.distortion = function(_) {
      if (!arguments.length) return d;
      d = +_;
      return fisheye;
    };

    fisheye.focus = function(_) {
      if (!arguments.length) return a;
      a = +_;
      return fisheye;
    };

    fisheye.copy = function() {
      return d3_fisheye_scale(scale.copy(), d, a);
    };

    fisheye.nice = scale.nice;
    fisheye.ticks = scale.ticks;
    fisheye.tickFormat = scale.tickFormat;
    return d3.rebind(fisheye, scale, "domain", "range");
  }

  



var fisheye = d3.fisheye.circular()
    .radius(120)
    .distortion(2);

svg.on("mousemove", function() {
  var mouse = d3.mouse(this);
  mouse[0] -= xoffset;
  mouse[1] -= yoffset;
  fisheye.focus(mouse);

  svg.select("g.avatars").selectAll("image")
    .attr("transform", function(d,i) {
      var x = i % nx * (aw + as);
      var y = parseInt(i/nx) * (aw + as);
      var fe = fisheye({x: x, y: y});
      var translate =  "translate(" + [fe.x,fe.y] + ")";
      var scale = "scale(" + fe.z +")";
      return translate + scale;
    })
})
