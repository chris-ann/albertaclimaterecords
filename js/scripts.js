var mapy;
var csvFile;
var lon;
var lat;
var vViz = 0;
var tViz = 1;
var log1 = 0;
var logFilter = [];
var hereLat;
var hereLon;
var ABID;

var COLORS = {'fd': '#75adf0', 'gs': '#69bd7f', 'hw': '#fb9956', 'xg25': '#da4a4e', 'xl0': '#3e79e4', 'ml25': '#b67433'};
var NCOLORS = {'fd': '#d9ae72', 'gs': '#8c8a85', 'hw': '#4aa9d2', 'xg25': '#4f9dac', 'xl0': '#ce8e52', 'ml25': '#1253af'};



function initialize() {
    
  //fade out loading gif at page load
  $(".loading").fadeOut('slow');
    
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
  var baseStyle = {
    fillColor: 'white',
    fillOpacity: 0.0,
    strokeWeight: 0.05,
    strokeColor: '#6a6a6a'
  }
  
  mapy.data.setStyle(baseStyle);

  mapy.data.addListener('click', function(event) {
    mapy.data.revertStyle();
    hereLat = event.feature.getProperty('Lat');
    hereLon = event.feature.getProperty('Lon') + (window.innerWidth*.00026); //add a fraction to center horizontally
    csvFile = event.feature.getProperty('csvfile');
      
    console.log(window.innerWidth*.00026);
    
      // FOR TREND SUMMARY
    if (tViz === 1) {
        loadTable(csvFile, runHere); 
        //Highlight selected cell
        mapy.data.overrideStyle(event.feature, {strokeWeight: 0.75, strokeColor: '#000000'});
    } 
      // FOR DETAIL VISUALIZATION
      else if (vViz === 1){
        loadTable(csvFile, runVariability);
        
          //Recenter and zoom map into location
        mapy.setCenter({lat: hereLat, lng: hereLon});
        mapy.setZoom(10);
          //Highlight selected cell
        mapy.data.overrideStyle(event.feature, {strokeWeight: 1, strokeColor: '#000000'});
   }
      
    ABID = event.feature.getProperty('AB_ID');
    
    //For CSV Download
    var a = document.getElementById('exportdoc');
    a.href = csvFile;
    $("#exportdoc").addClass("exportShow");

  });
    
  jQuery('.filter').each(function(e) {
    
    jQuery(jQuery(this)).click(function(z) {
      
      z.preventDefault();
      what=$(this).attr('id');
      mapy.data.setStyle(baseStyle);
      
        //FOR TREND SUMMARY
      if (tViz == 1){
        
        $(".spinner").fadeIn('5000'); // FADE IN THE LOADING ANIMATION
        
        mapy.data.setStyle({});
        jQuery('.filter').each(function() {
          $(this).removeClass('activeBut');
        });
        
        mapy.data.setStyle(function(feature) {
            var activeIndex = feature.getProperty(what);
            
            var fillOp = activeIndex.fillOpacity;
            var posNeg = activeIndex.s;

            if (posNeg === 'p'){
                return {
                    fillOpacity: fillOp,
                    fillColor: COLORS[what],
                    strokeWeight: 0.05
                };
            } else {
                return {
                    fillOpacity: fillOp,
                    fillColor: NCOLORS[what],
                    strokeWeight: 0.05
                };
            }

        });
        
        $(".spinner").fadeOut('3000'); // FADE OUT AFTER MAP LOADS... BUT IT ALWAYS FADES OUT BEFORE MAP IS DONE
  
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
  
  // Start visualization with Growing Season
  jQuery('#gs').click();


  
//---- BUTTONS ---- //
    
  $("#detail").click(function(){
    
    logFilter[log1] = what;
    log1++;

    if (tViz == 1){
      vViz = 1;
      tViz = 0;
      $(".transformdiv").toggleClass('vActive');
      mapy.panTo({lat: hereLat, lng: hereLon});
      mapy.setZoom(10);
      mapy.data.setStyle(baseStyle);
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
