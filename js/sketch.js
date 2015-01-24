var ABID;
var vizCanvas;
var varViz;
var mapViz;
var varDiv;
var varDivNode;

//-----Column Locations----//
var FDcol = 1;
var FDtcol = 2;
var GScol = 5;
var GStcol = 6;
var HWcol = 7;
var HWtcol = 8;
var xG25col = 27;
var xG25tcol = 28;
var xL0col = 29;
var xL0tcol = 30;
var mL25col = 31;
var mL25tcol = 32;
var firstRow = 6;
var lastRow = 66;

var xScale;
var yscale;

var vizWidth;
var vizHeight;

//----- LAYOUT POSITIONS------//
var xHalf;
var yHalf;
var  x1 = 50; // MARGINS
var x2;

//---- DATA VARIABLES---//
var yearPos; 
var idxVar; 

//-----SCALE OF COROPLETH MAP----//
var gradientScale = 50;

//---FONTS----//
var fsm = 10;
var fmed = 13;
var flg = 18;
var fxlg = 23;
var sans = "Arial";
var serif = "Georgia";

var green;
var greenOp;
var orange;
var orangeOp;
var red;
var redOp;
var ltBlue;
var ltBlueOp;
var mdBlue;
var mdBlueOp;
var dkBlue;
var dkBlueOp;
var white;
var black;
var grey;

function setup() {
  
  //--- INITIAL SIZING---//
  vizWidth = 300;
  vizHeight = windowHeight;
  
  vizCanvas = createCanvas(vizWidth, vizHeight);
  vizCanvas.parent('vizContainer');
  
  //--------/colors/------//
  green = color(105, 189, 127);
  greenOp = color(140, 138, 133);
  orange = color(251, 153, 86);
  orangeOp = color(74, 169, 210);
  red = color(218, 74, 78);
  redOp = color(79, 157, 172);
  ltBlue = color(116, 201, 255);
  ltBlueOp = color(217, 174, 114);
  mdBlue = color(57, 134, 232);
  mdBlueOp = color(206, 142, 82);
  dkBlue = color(18, 83, 175);
  dkBlueOp = color(182, 116, 51);
  white =  color(255, 255, 255);
  black = color(0, 0, 0);
  grey = 150;
}

function windowResized() {
  vizHeight = windowHeight;
  resizeCanvas(vizWidth, vizHeight);
  if(tViz == 1){
  loadTable(csvFile, runHere);
  }
  if (vViz ==1){
  loadTable(csvFile, runVariability); 
  }
}

function runVariability (here) {
  varViz = true;
  mapViz = false;
  
  removeElements();
  
  background(255);
  
  vizHeight = windowHeight - 90; // leave room for footer and header
  vizWidth = windowWidth*0.70;
  resizeCanvas(vizWidth, vizHeight);
  
  xScale = (vizWidth - (x1*2))/61; //50 px padding on left and right
  yScale = (vizHeight - 80)/-365; //padding 25px on bottom and top, -365 to move into negative
  
  //--Move the origin to the bottom --- //
  push();
  translate(x1, vizHeight - 30); // 50px padding on left, 20px padding on top
  
  
  //DISPLAY LOCATION INFORMATION
  loadJSON("here_info.json", displayInfo);

  //AXIS
  stroke(grey);
  line(0, 0, 60*xScale, 0);
  line(0, 365*yScale, 60*xScale, 365*yScale);
  noStroke();
  text("0 days", 61*xScale, 2);
  text("365 days", 61*xScale, 365*yScale + 2);
  
  // DRAW VARIABILITY LINES//
  if ($("#gs").hasClass("activeBut") === true) {
  variability(GScol, GStcol, green, "GROWING SEASON DAYS");
  }
  if ($("#hw").hasClass("activeBut") === true){
  variability(HWcol, HWtcol, orange, "HEAT WAVE DAYS");
  }
  if ($("#xg25").hasClass("activeBut") === true){
  variability(xG25col, xG25tcol, red, "DAYS ABOVE 25\xB0C");
  }
  if($("#fd").hasClass("activeBut") === true){
  variability(FDcol, FDtcol, ltBlue, "FROST DAYS");
  }
  if ($("#xl0").hasClass("activeBut") === true){
  variability(xL0col, xL0tcol, mdBlue, "FULL DAYS BELOW 0\xB0C");
  }
  if ($("#ml25").hasClass("activeBut") === true){
  variability(mL25col, mL25tcol, dkBlue, "DAYS BELOW -25\xB0C");
  }
  
  function variability(inputVarCol, inputTrendCol, idxColor, idxText) {
  noStroke();
  
  //--Variability points---//
  var rowCount = here.getRowCount();
  var varCol = here.getColumn(inputVarCol); // Variability Column
  var yearCol = here.getColumn(0); // Year Column
  idxVar; //Variable Values
  var nextIdx; //Variable Values
  var trend1; //1950 trend value
  var trend2; //2010 trend value
  yearPos; //Will be position of the year
  var year; // Actual value of the year
  var nextYear; // year after for connecting lines

  
  for (var row = firstRow; row < rowCount-1; row++) {
    
    year = yearCol[row];
    yearPos = (row-firstRow)*xScale;
    nextYear = (row-firstRow+1)*xScale;
    
    if (inputTrendCol == 32) {
      idxVar = (365-varCol[row])*yScale; // multiply by -1 to appear above the new origin
      nextIdx = (365-varCol[row+1])*yScale;}
    else {
      idxVar = varCol[row]*yScale; // multiply by -1 to appear above the new origin
      nextIdx = varCol[row+1]*yScale;}
    
    //--DRAW VARIABILITY POINTS--//
    fill(idxColor);
    ellipse(yearPos, idxVar, 5, 5);
    
    //--- Variability Conecting Lines----//
    if (row < rowCount-2) {
      stroke(idxColor, 100);
      line(yearPos, idxVar, nextYear, nextIdx);
      noStroke();
    }
    
    varDivNode = createDiv(" ");
    varDivNode.parent(vizContainer);
    varDivNode.position(yearPos + 47, vizHeight - (idxVar * -1) + 10);
    varDivNode.size(7, 7);
    varDivNode.id("year");

    
    varDiv = createDiv("<strong>" + round(idxVar/yScale) + "</strong> " + idxText + " in " + year);
    varDiv.parent(vizContainer);
    varDiv.style("color", "black");
    varDiv.style("background-color", "white");
    varDiv.style("font-size", "11px");
    varDiv.style("padding", "2px");
    varDiv.position(yearPos + 45, vizHeight - (idxVar * -1) - 10);
    //varDiv.size(140, 20);
    varDiv.class('divText');
    varDiv.class('text' + year);
    
  }
  

  //--- Trend line----//
  var trendCol = here.getColumn(inputTrendCol); //Trend column
  
  if (inputTrendCol == 32) {
  trend1 = 365-trendCol[firstRow];
  trend2 = 365-trendCol[lastRow];
  }
  else {
  trend1 = trendCol[firstRow];
  trend2 = trendCol[lastRow];
  }
  stroke(idxColor);
  line(0, trend1*yScale, yearPos, trend2*yScale);
  
  //DISPLAY TREND VALUES
  noStroke();
  fill(idxColor);
  textFont(sans);
  textSize(flg);
  textAlign(RIGHT);
  textStyle(BOLD);
  text(round(trend1), -5, trend1*yScale + 5);
  textAlign(LEFT);
  text(round(trend2), yearPos + 5, trend2*yScale + 5);
  textSize(fmed);
  textStyle(NORMAL);
  textAlign(RIGHT);
  text(yearCol[firstRow], -5, trend1*yScale + 18);
  textAlign(LEFT);
  text(yearCol[lastRow], yearPos + 5, trend2*yScale + 18);
  
  }

  pop();
  
}


function runHere(here) {
  
  vizHeight = windowHeight - 50; // -50 for footer on bottom
  vizWidth = 300;
  resizeCanvas(vizWidth, vizHeight);
  
  
  varViz = false;
  mapViz = true;
  
  //VERTICAL POSITIONS BASED ON TOTAL WINDOW HEIGHT
  yHalf = vizHeight/2;
  yThird = vizHeight/2.7;
  
  //SCALE DATA TO FIT CANVAS//
  xScale = vizWidth/61;
  yscale = vizHeight/365 * -0.21;
  
  //SPECIFY MARGINS & MIDDLE POSITIONS
  x2 = vizWidth - x1;
  xHalf = vizWidth/2;
  
  background(255);
  noStroke();
  
  if (what == 'gs'){
  trendViz(GStcol, green, greenOp, "GROWING SEASON DAYS");
  }
  else if (what == 'hw'){
  trendViz(HWtcol, orange, orangeOp, "HEAT WAVE DAYS");
  }
  else if (what == 'xg25'){
  trendViz(xG25tcol, red, redOp, "DAYS ABOVE 25\xB0C");
  }
  else if(what == 'fd'){
  trendViz(FDtcol, ltBlue, ltBlueOp, "FROST DAYS");
  }
  else if (what == 'xl0'){
  trendViz(xL0tcol, mdBlue, mdBlueOp, "FULL DAYS BELOW 0\xB0C");
  }
  else if (what == 'ml25'){
  trendViz(mL25tcol, dkBlue, dkBlueOp, "DAYS BELOW -25\xB0C");
  }
  
  // CLASS FOR EACH TREND
  function trendViz(inputTrendCol, idxColor, idxColorOp, idxText) {
    
    // MESSAGE UNTIL FIRST LOCATION IS CHOSEN
    if (here === undefined) {
      var preText = "Click on the map to display the data for each location.";
      textFont(sans);
      textSize(flg);
      textAlign(CENTER);
      textStyle(NORMAL);
      textLeading(30);
      fill(grey);
      text(preText, xHalf, yHalf-100, 240, 100);
    }
    else {
    
    //--------TREND VISUALIZATION----------//
    
    push();
    //MOVE ORIGIN TO BOTTOM (WILL MULTIPLY VALUES BY -1 TO DISPLAY ABOVE)
    translate(0, yThird);
    
    //DISPLAY LOCATION INFORMATION
    loadJSON("here_info.json", displayInfo);
    
    //SET VIZ TITLE
    var title = "Trend for the # of " + idxText + " per year:";
    
    //DISPLAY VIZ TITLE
    textFont(sans);
    textStyle(NORMAL);
    textSize(fmed);
    textAlign(LEFT);
    fill(grey);
    textLeading(20);
    text(title, x1, 365*yscale - 60, 220, 60);
    
    //DISPLAY AXIS
    fill(245);
    rect(x1, 365*yscale, x2 - x1, -365*yscale);
    fill(grey);
    textSize(fsm);
    textAlign(LEFT);
    textStyle(NORMAL);
    text("0 days", x2+1, 5);
    text("365 days", x2+1, 365*yscale + 5);
    stroke(grey);
    strokeWeight(0.5);
    line(x1,0,x2,0);
    line(x1,365*yscale,x2,365*yscale);
    
    //LOAD YEAR ARRAY
    var yearCol = here.getColumn(0);
    
    //SPECIFY COLUMN FOR SELECTED INDEX 
    var trendCol = here.getColumn(inputTrendCol);
    
    //SELECT FIRST (1950) AND LAST (2010) TREND VALUES
    if (inputTrendCol == 32) {
    trend1 = 365 - trendCol[firstRow]; 
    trend2 = 365 - trendCol[lastRow];  
    }
    else {
    trend1 = trendCol[firstRow]; 
    trend2 = trendCol[lastRow];
    }
    
    //print("first row = " + trend1);
    //print("last row = " + trend2);
    
    //DISPLAY TREND LINE
    stroke(0);
    strokeWeight(1.5);
    line(x1,trend1*yscale,x2,trend2*yscale);
    
    //DISPLAY TREND VALUES
    noStroke();
    fill(white);
    rect(x2, trend2*yscale - 20, 40, 35);
    fill(black);
    textFont(sans);
    textSize(flg);
    textAlign(RIGHT);
    textStyle(BOLD);
    text(round(trend1), x1 - 5, trend1*yscale - 1);
    textAlign(LEFT);
    text(round(trend2), x2 + 5, trend2*yscale - 1);
    textSize(fmed);
    textStyle(NORMAL);
    textAlign(RIGHT);
    text(yearCol[firstRow], x1 - 5, round(trend1*yscale)+12);
    textAlign(LEFT);
    text(yearCol[lastRow], x2 + 5, round(trend2*yscale)+12);
    
    pop();
    
    //------- DIFFERENCE VISUALIZATION --------- //
    
    push();
    translate(0, yHalf+30);
    
    //DISPLAY DIFFERENCE VISUALIZATION TITLE
    var diffText = "Trend difference from 1950 - 2010:";
    textFont(sans);
    textStyle(NORMAL);
    textSize(fmed);
    textAlign(LEFT);
    fill(grey);
    textLeading(20);
    text(diffText, x1, -80, 220, 60);
    
    //FIND THE DIFFERENCE BETWEEN THE TWO TREND VALUES
    var diff = round(trend2) - round(trend1);
    
    //GRADIENT DISPLAY
    var changeScale = ((vizWidth-(x1*2))/2)/gradientScale;
    var pos = abs(diff*changeScale);
    
    //DISPLAY NUMBER FOR AMOUNT OF CHANGE ABOVE SCALE
    textFont(sans);
    textSize(fxlg);
    textStyle(BOLD);
    textAlign(CENTER);
    stroke(0);
    fill(0);
    var morefewer; //for display summary of change below
    
    if (diff <= 0) {
        text(diff, xHalf-pos, -20);
        line(xHalf-pos-10, -15, xHalf-pos, -5);
        line(xHalf-pos, -5, xHalf-pos+10, -15);
        morefewer = " FEWER ";
      }
    else {
      text("+" + diff, xHalf+pos-5, -20);
      line(xHalf+pos-10, -15, xHalf+pos, -5);
      line(xHalf+pos, -5, xHalf+pos+10, -15);
      morefewer = " MORE ";
    }
    
    setGradient(x1, 0, xHalf - x1, 15, idxColorOp, white);
    setGradient(xHalf, 0, xHalf - x1, 15, white, idxColor);
    
    // GRADIENT LABELS 0 - 50
      for (var i = -50; i <= 50; i = i + 25) {
        var xMark = (i*changeScale)+xHalf;
        stroke(grey);
        line(xMark, 20, xMark, 25);
        fill(grey);
        noStroke();
        textAlign(CENTER);
        textStyle(NORMAL);
        textSize(fsm);
        text(i, xMark, 35);
      }
      
    // SUMMARY OF CHANGE TEXT
    var changeText;
    if (diff === 0) {
    changeText = "THE TREND INDICATES NO CHANGE IN " + idxText + " PER YEAR SINCE 1950.";  
    }
    else {
    changeText = "THE TREND INDICATES "  + abs(diff) + morefewer + idxText + " PER YEAR SINCE 1950.";
    }
    textAlign(LEFT);
    textSize(flg);
    fill(grey);
    textLeading(24);
    textStyle(BOLD);
    text (changeText, x1, yThird/3.3, 220, 110);
    
    pop();
    
    }
  }
  
}

function displayInfo(hereInfo) {
  
  for (var h = 0; h < hereInfo.length; h++) {
    var infoABID = hereInfo[h].AB_ID;
    
    if(infoABID == ABID){
      textFont(sans);
      textAlign(LEFT);
      fill(black);
      textSize(fsm);
      textStyle(NORMAL);
      text("AT: ", x1, 28);
      textStyle(BOLD);
      textSize(flg);
      text(hereInfo[h].Lat + ", " + hereInfo[h].Lon, x1 + 20, 28);
      //textSize(fmed);
      //textStyle(NORMAL);
      //text(hereInfo[h].Elev + "m above sea level", 0, 25);
      //text(hereInfo[h].NRNAME + " Natural Region", 0, 45);
      //text(hereInfo[h].NSRNAME + " Subregion", 0, 65);
    }
  }
}


function setGradient(x, y, w, h, c1, c2) {
  noFill();

  for (var i = x; i <= x+w; i++) {
    var inter = map(i, x, x+w, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(i, y, i, y+h);
  }
}




