import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import { select } from 'd3-selection';

class WordFrequency extends Component {
  constructor(props){
    super(props);
    this.createWordFrequency = this.createWordFrequency.bind(this);
  }

  componentDidMount() {
    console.log("Performing Mount");
    if (this.props.data.length !== undefined) {                           //makes sure data is an array 
                                                                        //covers asyncronous passing of initial {}
      this.createWordFrequency();
    }
  }

  componentDidUpdate() {
    console.log("Performing update")
    if (this.props.data.length !== undefined) {
      this.createWordFrequency();
    }
  }

  createWordFrequency() {
    const node = this.node;
    const data = this.props.data;
    const excludedShapes = ["unknown", "other"];

    // construct a map from each shape to the number of occurrences
    let shapeFrequency = {};
    let shape = "";
    for (let sighting of data) {
        shape = sighting.shape.toLowerCase();
        if (shape in shapeFrequency) {
            shapeFrequency[shape] += 1;
        } else {
            shapeFrequency[shape] = 1;
        }
    }

    // merge repetitive entries and delete unnecessary ones
    shapeFrequency = this.merge("light", "fireball", shapeFrequency);
    for (let s of excludedShapes) {
        delete shapeFrequency[s];
    }

    // find the 5 shapes with the most occurrences
    let shapes = Object.keys(shapeFrequency);
    let maxShapes = {};
    if (shapes.length < 5) {
        maxShapes = shapeFrequency;
    } else {
        let maxShape = "";
        for (let i = 0; i < 5; i++) {
            shapes = Object.keys(shapeFrequency);
            maxShape = shapes.reduce((a, b) => shapeFrequency[a] > shapeFrequency[b] ? a : b, shapes[0]);
            maxShapes[maxShape] = shapeFrequency[maxShape];
            delete shapeFrequency[maxShape];
        }
    }

    // calculate number of occurrences of each shape relative to 100
    const sum = Object.values(maxShapes).reduce((a, b) => a + b);
    const proportions = {}
    let p = 0;
    let totalSum = 0;
    for (let [s, n] of Object.entries(maxShapes)) {
        p = n/sum * 100;
        proportions[s] = Math.round(p);
        totalSum += proportions[s];
    }
    while (totalSum < 100) {
        for (let s of Object.keys(proportions)) {
            proportions[s] += 1;
            totalSum += 1;
        }
    }
    while (totalSum > 100) {
        for (let s of Object.keys(proportions)) {
            proportions[s] -= 1;
            totalSum -= 1;
        }
    }

    // add icons to the final data arrays
    const iconMap = {
        "light, fireball": "\uf0e7",
        "circle": "\uf111",
        "triangle": "\uf0d8",
        "sphere": "\uf0ac",
        "oval": "\uf06e"
    }
    const finalData = [];
    for (let [s, v] of Object.entries(proportions)) {
        for (let i = 0; i < v; i++) {
            finalData.push([s, iconMap[s], s])
        }
    }
    const dataIcons = [];
    for (let [s, i] of Object.entries(iconMap)) {
        dataIcons.push([s,i]);
    }

    var fontSize = 24;
    var iconSpace = 3;
    var legendSpace = 20;
    var legendX = 300;
    var legendY = 20;
    var legendTitle = "Shapes";
    
    var color = d3.scaleOrdinal()
                .range(["#2BD134","#5ADA61", "#89E28E", "#C5F2C7", "#EBFAEC"]);
    var row = 0;
	var svg = d3.select(node).append("svg")
		.attr("transform", "translate(0, 0)");
 
	var icons = svg.selectAll("g")
					.data(finalData).enter()
                        .append("g");
    let updateText = function(className, newText) {
        d3.selectAll(className).text(newText);
    }
	
    icons.append("text")
        .on("mouseover", function(d){ updateText("p", d[2]); })
		.attr("x", function(d, i){ return ((i%10 + 1) * (fontSize + 1 + iconSpace)) - fontSize;})
		.attr("y", function(d, i){ if(i%10 === 0){row++}; return row * fontSize;})
		.attr('font-family', 'FontAwesome')
		.attr('font-size', fontSize)
		.attr("fill", function(d){ return color(d);})
        .text(function(d) { return "\u00A0 " + d[1]; });
    
    var legend = svg.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) { return "translate(" + legendX + ", " + legendY + ")"; });

	legend.append("text")
        .attr("transform", "translate(0, 5)")
        .attr("fill", d =>"#EBFAEC")
		.text(legendTitle);
		
	var legendItems = legend.selectAll("g")
		.data(dataIcons).enter()
			.append("g")
				.attr("class", "item")
				.attr("transform", function(d, i){ return "translate(0, " + (i*legendSpace + fontSize) + ")"; });
	
	legendItems.append("text")
		.attr('font-family', 'FontAwesome')
		.attr("fill", function(d){ return color(d);})
		.text(function(d) { return d[1]; });
	
	legendItems.append("text")
        .attr("transform", function(d){ return "translate(" + legendSpace + ", 0)"; })
        .attr("fill", function(d){ return color(d);})
		.text(function(d) { return d[0]; });
}
  
  merge (a, b, shapeFrequency) {
      shapeFrequency[a + ", " + b] = shapeFrequency[a] + shapeFrequency[b];
      delete shapeFrequency[a];
      delete shapeFrequency[b];
      return shapeFrequency;
  }

  render() {
    return (
        <div>
            <h3 className="map-title">Shapes of the UFO Sightings</h3>
            <svg ref={node => this.node = node} width={800} height={400} />
        </div>
    );
  }
  
}

export default WordFrequency;