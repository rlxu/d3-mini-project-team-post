import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import { select } from 'd3-selection';

class StreamChart extends Component {
  constructor(props){
    super(props);
    this.createStreamChart = this.createStreamChart.bind(this);
  }

  componentDidMount() {
    console.log("Performing Mount");
    if(this.props.data.length !== undefined){                           //makes sure data is an array 
                                                                        //covers asyncronous passing of initial {}
      this.createStreamChart();
    }
  }

  componentDidUpdate() {
    console.log("Performing update")
    if(this.props.data.length !== undefined){
      this.createStreamChart();
    }
  }

  createStreamChart() {
    const node = this.node;

    /*
    Data in the form of:
    - list of sightings: data.sightings
    - format of each sighting (data.sightings[i]):
        "_id"
        "city"
        "date": "2016-09-29T22:00:00.000Z"
        "url"
        "state"
        "summary"
        "duration"
        "shape"
        "loc"
        "dateAdded"
    */
    const data = this.props.data;

    /*
    histogram structure
    {
      "year":{date: #occur, date: #occur}
      "year":{date: #occur, date: #occur}
    }
    */
    let histogram = {};
  
    for (let sighting of data){
      let year = sighting.date.substring(0,4);
      let monthDay = sighting.date.substring(5,10);
      if(histogram[year]){
        if(histogram[year][monthDay]){
          histogram[year][monthDay] = histogram[year][monthDay] + 1
        }
        else{
          histogram[year][monthDay] = 1
        }
      }
      else{
        histogram[year] = {
                            [monthDay]: 1
                          }
      }
    }


    //calcuate maximum total sightings on a day in histogram (coded retroactively so histogram is set up badly for this)
    let frequencyOfSightings = {};
    for (let year in histogram){
      if(Object.keys(histogram[year]).length > 30){
        for (let monthDay in histogram[year]){
          if(frequencyOfSightings[monthDay] === undefined){
            frequencyOfSightings[monthDay] = histogram[year][monthDay];
          }
          else{
            frequencyOfSightings[monthDay] = frequencyOfSightings[monthDay] + histogram[year][monthDay];
          }
        }
      }
    }
    let maxInHistogram = 0;
    for (let monthDay in frequencyOfSightings){
      if (frequencyOfSightings[monthDay] > maxInHistogram){
        maxInHistogram = frequencyOfSightings[monthDay];
      }
    }


    /*
    let maxInHistogram = 0;
    for (let year in histogram){
      for (let monthDay in histogram[year]){
        if (histogram[year][monthDay] > maxInHistogram){
          maxInHistogram = histogram[year][monthDay];
        }
      }
    }
    */

    console.log(histogram);
    //generate dense array for stacking
    
    //finds all days that have data
    let allRelevantMonthDays = [];
    for (let year in histogram){
      if(Object.keys(histogram[year]).length > 30){
        for (let monthDay in histogram[year]){
          if (!allRelevantMonthDays.includes(monthDay)){
            allRelevantMonthDays.push(monthDay);
          }
        }
      }
    }
    //create dense array
    let denseArray = [];
    let tempRow = {};
    for(let monthDay of allRelevantMonthDays){
      tempRow = {date: monthDay}
      for(let currentYear in histogram){

        if (Object.keys(histogram[currentYear]).length > 30){
          if (histogram[currentYear][monthDay] === undefined){
            tempRow[currentYear] = 0
          }
          else{
            tempRow[currentYear] = histogram[currentYear][monthDay];
          }
        }
      }
      denseArray.push(tempRow);
    }

    //sort denseArray
    denseArray.sort(function (a,b) {
      let dateValueA = 100*parseInt(a.date.substring(0,2)) + parseInt(a.date.substring(3,5));
      let dateValueB = 100*parseInt(b.date.substring(0,2)) + parseInt(b.date.substring(3,5)); 
      return dateValueA - dateValueB;
    });
    
    let relevantYears = [];
    for (let year in histogram){
      if (Object.keys(histogram[year]).length > 30){
        relevantYears.push(year);
      }
    }
    
    
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    // set the ranges
    var x = d3.scaleLinear()
        .domain([1, 13])              //January 1 = 1+1/32    to     December 31 = 12+31/32
        .range([0, width])
    var y = d3.scaleLinear()
        .domain([-maxInHistogram/6, maxInHistogram/6])
        .range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(node).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height*0.9 + ")")
        .call(d3.axisBottom(x).tickSize(-height * 0.8).tickValues([2,3,4,5,6,7,8,9,10,11,12]))
        .select(".domain").remove();
    svg.selectAll(".tick line")
        .attr("stroke", "#b8b8b8")
    let monthLabels = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    svg.selectAll(".tick text")
        .data(monthLabels)
        .text( d => d );
    
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height )
        .text("Time of Year");

      // create a tooltip
    let Tooltip = svg
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("opacity", 0)
      .style("font-size", 17)

    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(d) {
      Tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    let mousemove = function(d,i) {
      let grp = relevantYears[i]
      Tooltip.text(grp)
    }
    let mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    //processes denseArray to get heights for StreamChart
    let stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(relevantYears) (denseArray);

    let areaGenerator = d3.area()
        .x( function(d){  return x(parseInt(d.data.date.substring(0,2)) + parseInt(d.data.date.substring(3,5))/32);  })
        .y0( function(d){  return y(d[0]);  })
        .y1( function(d){  return y(d[1]);  })

    svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
      .append("path")
        .attr("class","myArea")
        .style("fill", function(d) { return colorScale(d.key)})
        .attr("d", areaGenerator)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    

    /*  
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (function(d) { return x(d.city); }))
        .attr("width", x.bandwidth())
        .attr("y", (function(d) { return y(d.freq); }))
        .attr("height", (function(d) { return height - y(d.freq); }))
        .style('fill', (d, i) => colorScale(i));
    
    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    */
  }

  render() {
    return <svg ref={node => this.node = node} width={800} height={400} />
  }
  
}

export default StreamChart;

//notes: IMPORTANT TO ORDER DATA BEFORE STACK(). OTHERWISE, THE POINTS ARE OUT OF ORDER