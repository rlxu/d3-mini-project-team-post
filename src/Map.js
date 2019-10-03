import React, { Component } from "react";
import * as d3_all from "d3";
import * as geo from "d3-geo";
import * as topojson from "topojson";

import us from "./assets/us-states.json";
import "./App.css";

const d3 = { ...d3_all, ...geo };

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statesData: []
        }
        this.createMapData = this.createMapData.bind(this);
    }

    componentDidMount() {
        if(this.props.data.length !== 0) {
            this.createMapData();
        }
    }

    componentDidUpdate() {
        if(this.props.data.length !== 0) {
            this.createMapData();
        }
    }

    projection = () => {
        return d3
        .geoAlbersUsa()
        .scale(1000)
        .translate([800 / 2, 450 / 2]);
    };

    createMapData() {
        const data = this.props.data;
        let states = [];

        for (let point in data) {
            if (data[point].state in states) {
                states[data[point].state] += 1
            }
            else {
                states[data[point].state] = 1
            } 
        }

        let finalData = [];
        for (let s in states) {
            finalData.push({
                'state': s,
                'numberSightings': states[s]
            })
        }

        if (this.state.statesData.length === 0) {
            console.log("updating");
            this.setState({statesData: finalData});
        } 

        console.log(this.state.statesData);

    
    }

    createColor(index) {
        if(this.state.statesData.length !== 0) {
            let data = this.state.statesData;
            let sightingNums = []

            for (let s in data) {
                sightingNums.push(data[s].numberSightings);
            }

            console.log(sightingNums);

            var max = this.findMax(sightingNums);
            console.log(max);
            
            if (data[index].numberSightings > (max * 0.9)) {
                return 1;
            } else if (data[index].numberSightings > (max * 0.7)) {
                return 0.9;
            } else if (data[index].numberSightings > (max * 0.5)) {
                return 0.7;
            } else if (data[index].numberSightings > (max * 0.3)) {
                return 0.5;
            } else if (data[index].numberSightings > (max * 0.1)) {
                return 0.4;
            } else {
                return 0.2;
            }
        }
    }

    findMax(list) {
        var max = 0;

        for (let i in list) {
            if (list[i] > max) {
                max = list[i];
            }
        }

        return max;
    }

  render() {
    return (
      <div className="map-container">
        <h3 className="map-title">Number of UFO Sightings Across the US</h3>
        <svg className={"map"} width={1000} height={600} viewBox="0 0 800 450">
          <g className={"states"}>
            {topojson.feature(us, us.objects.states).features.map((d, i) => (
              <path
                key={`path-${i}`}
                d={d3.geoPath().projection(this.projection())(d)}
                className="states"
                stroke="#27292e"
                fill={ `rgba(137, 226, 142,${this.createColor(i)})` }
                strokeWidth={0.5}
              />
            ))}
          </g>
          <g className={"legend"}>

          </g>
        </svg>
      </div>
    );
  }
}

export default Map;