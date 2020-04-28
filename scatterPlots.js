/* this function takes the entries array as parameter 
and return the mean value of all the grade attribute of entry */
var dur = 1000

var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}

/*this function defined how the circiles will be drawn on the graph*/
var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{

    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());/*call the setBanner function and pass the xProp and yProp parameter to it to change the title of the website based on the button pressed*/
    
    d3.select(target)/*select the target parameter which is the scatter id in the html*/
    .select(".graph")
    .selectAll("circle")/*create all the circle elements*/
    .data(students)
    .enter()
    .append("circle")/*add specific attributes for the circle elements*/
    .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));  /*the x position for the circle is decided by the mean grade of the student's xProp grade */  
    })
    .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));  /*the y position for the circle is decided by the mean grade of the student's yProp grade */    
    })
    .attr("r",4);
}

var recalculateScales = function(students,xProp,yProp,lengths)
{
    
    var xScale = d3.scaleLinear()
        .domain([0,students[0][xProp][0].max]) 
        .range([0,lengths.graph.width])
    
    var yScale = d3.scaleLinear()
        .domain([0,students[0][yProp][0].max])
        .range([lengths.graph.height,0])
    
    return { xScale:xScale,yScale:yScale}
}

var updateAxes = function(target,
                           xScale,yScale)
{
    console.log("updating axes");
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis)
}

var updateDrawScatter = function(students,target,xProp,yProp,lengths)
{
    
    
    console.log("updating graph");
    console.log(students[0][yProp][0].max);
    
    var scales = recalculateScales(students,xProp,yProp,lengths);
    var xScale = scales.xScale;
    var yScale = scales.yScale;
    
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    updateAxes(target,xScale,yScale);
    
    //JOIN - Rebind the data
    var circles = d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .data(students)

    //ENTER - add new stuff
    circles.enter()
        .append("circle");
    
    //EXIT - remove old stuff

    circles.exit()
        .remove();
    
    //UPDATE - REDECORATE

    //have to re select everything
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .transition()
        .duration(dur)
        .attr("cx",function(student)
        {
            return xScale(getMeanGrade(student[xProp]));  
        })
        .attr("cy",function(student)
        {
            return yScale(getMeanGrade(student[yProp]));  
        })
        .attr("r",4);
}

/*this function use the core d3 algorithm which selection all the circle element on the target svg and remove them all*/
var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

/*this function create x and y axis on the svg graph*/
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis");
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}

/*this function initialize the blank graph and set how large and where the graph will be on the whole website*/
var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    var lengths = {
        screen:screen,
        margins:margins,
        graph:graph
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(students,target,xScale,yScale,lengths);
    
    setBanner("Click buttons to graphs");
    
    

}

/*this function generates different buttons that allow users to select which scatter plot to be shown
by pass different text as xProp and yProp to the drawScatter function which will change the scatter using the same function*/
var initButtons = function(students,target,xScale,yScale,lengths)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        /*clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"final","homework");*/
        updateDrawScatter(students,target,"final","homework",lengths);
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        /*clearScatter(target);*/
        updateDrawScatter(students,target,"homework","quizes",lengths);
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        /*clearScatter(target);*/
        updateDrawScatter(students,target,"test","final",lengths);
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        /*clearScatter(target);*/
        updateDrawScatter(students,target,"test","quizes",lengths);
    })
    
    
    
}

/*this function change the head of the website by passing different text as msg parameter*/
var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



var penguinPromise = d3.json("classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});
