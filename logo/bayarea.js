var svg = d3.select("svg");
svg.append("text")
  .text("d3.bayarea()")
  .attr({
    x: 100,
    y: 100,
    "font-size": 112,
    "fill": "#02003A",
    "text-anchor": "middle",
    "font-family": "ubuntu mono"
  })
  
WebFontConfig = {
google: { families: [ 'Ubuntu+Mono::latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();


