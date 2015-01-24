var mapy;
var csvFile;
var lon;
var lat;
var vViz = 0;
var tViz = 1;
var log1 = 0;
var logFilter = [];

var COLORS = {'fd': '#75adf0', 'gs': '#69bd7f', 'hw': '#fb9956', 'xg25': '#da4a4e', 'xl0': '#3e79e4', 'ml25': '#b67433'};
var NCOLORS = {'fd': '#d9ae72', 'gs': '#8c8a85', 'hw': '#4aa9d2', 'xg25': '#4f9dac', 'xl0': '#ce8e52', 'ml25': '#1253af'};


function fadeLoader() {
  $(".preload").fadeOut('slow');
}

function initialize() {
  var mapOptions = {
    streetViewControl: false
  };
  var layer = "toner";
  mapy = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(55, -117),
    zoom: 5,
    mapTypeId: layer,
    mapTypeControlOptions: {
    mapTypeIds: [layer]
    }
  }, mapOptions);
  
  mapy.mapTypes.set(layer, new google.maps.StamenMapType(layer));

  // Load a GeoJSON from the same server as our demo.
  mapy.data.loadGeoJson('AB_10K-ID.json');
  

  
  // set initial style
  mapy.data.setStyle({
    fillColor: 'white',
    fillOpacity: 0.0,
    strokeWeight: 0.05,
    strokeColor: '#333333'
  });
  
  mapy.data.addListener('click', function(event) {
    mapy.data.revertStyle();
    hereLat = event.feature.getProperty('Lat');
    hereLon = event.feature.getProperty('Lon') + 0.5;

    if (tViz == 1){
    loadTable(event.feature.getProperty('csvfile'), runHere);}
    else if (vViz == 1){
    loadTable(event.feature.getProperty('csvfile'), runVariability);
    mapy.setCenter({lat: hereLat, lng: hereLon});
    mapy.setZoom(10);
    }
    
    ABID = event.feature.getProperty('AB_ID');
    
    //For CSV Download
    csvFile = event.feature.getProperty('csvfile');
    var a = document.getElementById('exportdoc');
    a.href = csvFile;
    $("#exportdoc").addClass("exportShow");
    
    //Highlight selected cell
    mapy.data.overrideStyle(event.feature, {strokeWeight: 1.2, strokeColor: '#000000'});
  });
    
  jQuery('.filter').each(function(e) {
    jQuery(jQuery(this)).click(function(z) {
      z.preventDefault();
      what=$(this).attr('id');
      mapy.data.setStyle({
        fillColor: 'white',
        fillOpacity: 0.0,
        strokeWeight: 0.05,
        strokeColor: '#000000'
      });
      if (tViz == 1){
        mapy.data.setStyle({});
        jQuery('.filter').each(function() {
          $(this).removeClass('activeBut');
        });
        mapy.data.setStyle(function(feature) {
          return {'fillOpacity': feature.k[what]['fillOpacity'], 'strokeWeight': 0.05, 'fillColor': (feature.k[what]['s'] == 'p' ? COLORS[what] : NCOLORS[what])};
        });
      fadeLoader();
        
      }

      $(this).toggleClass("activeBut");
      
      if (csvFile !== undefined) {
        if(tViz == 1){loadTable(csvFile, runHere);}
        else if (vViz == 1){loadTable(csvFile, runVariability); }
      }
      else { 
        if(tViz == 1){runHere();} 
        else if (vViz == 1){loadTable(csvFile, runVariability); }
      }
  
    });
  });
  
  
  jQuery('#gs').click();

  
  $("#detail").click(function(){
    
    logFilter[log1] = what;
    log1++;

    //print(logFilter[0]);

    if (tViz == 1){
      vViz = 1;
      tViz = 0;
      $(".transformdiv").toggleClass('vActive');
      mapy.panTo({lat: hereLat, lng: hereLon});
      mapy.setZoom(10);
      mapy.data.setStyle({
          fillColor: 'white',
          fillOpacity: 0.0,
          strokeWeight: 0.05,
          strokeColor: '#000000'
        });
      loadTable(csvFile, runVariability);
    }
  });
  
  $("#summary").click(function(){
    if (vViz == 1 ) {
      vViz = 0;
      tViz = 1;
      $(".transformdiv").toggleClass('vActive');
      $('.filter').removeClass('activeBut');
      jQuery('#' + logFilter[0]).click();
      mapy.panTo({lat: hereLat, lng: hereLon});
      loadTable(csvFile, runHere);
      log1 = 0;
    }
  });
 
  $("#about").click(function(){
    $("#dataPage").removeClass('showPage'); $("#data").removeClass('navActive');
    $("#faqPage").removeClass('showPage'); $("#faq").removeClass('navActive');
    $("#aboutPage").toggleClass('showPage'); $("#about").toggleClass('navActive');
  });
  
  $("#data").click(function(){
    $("#aboutPage").removeClass('showPage'); $("#about").removeClass('navActive');
    $("#faqPage").removeClass('showPage'); $("#faq").removeClass('navActive');
    $("#dataPage").toggleClass('showPage');$("#data").toggleClass('navActive');
  });
  
  $("#faq").click(function(){
    $("#aboutPage").removeClass('showPage');$("#about").removeClass('navActive');
    $("#dataPage").removeClass('showPage');$("#data").removeClass('navActive');
    $("#faqPage").toggleClass('showPage'); $("#faq").toggleClass('navActive');
  });
  
  
  $("#goHome").click(function(){
    $(".showPage").removeClass('showPage');
  });
  


}



google.maps.event.addDomListener(window, 'load', initialize);
