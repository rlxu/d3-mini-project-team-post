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
    this.createStreamChart();
  }

  componentDidUpdate() {
    this.createStreamChart();
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
  
    for (let sighting of data.sightings){
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

    let maxInHistogram = 0;
    for (let year in histogram){
      for (let monthDay in year){
        if (year[monthDay] > maxInHistogram){
          maxInHistogram = year[monthDay];
        }
      }
    }
    
    
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    // set the ranges
    var x = d3.scaleLinear()
        .domain([1, 13])              //January 1 = 1+1/32    to     December 31 = 12+31/32
        .range([0, width])
    var y = d3.scaleLinear()
        .domain([0, maxInHistogram])
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
        .call(d3.axisBottom(x).tickSize(-height * 0.8).tickValues("February", "March", "April", "May","June","July",
                                                                  "August", "September", "October", "November", "December"));

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
    return <svg ref={node => this.node = node} width={500} height={400} />
  }
}

export default StreamChart;