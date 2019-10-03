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
        this.createMap = this.createMap.bind(this);
    }

    componentDidMount() {
        if(this.props.data.length !== 0) {
            this.createMap();
        }
    }

    projection = () => {
        return d3
        .geoAlbersUsa()
        .scale(1000)
        .translate([800 / 2, 450 / 2]);
    };

    createMap() {
        const data = this.props.data;
        console.log("here");
        console.log(data);
    }

  render() {
    return (
      <div className="map-container">
        <svg className={"map"} width={1000} height={700} viewBox="0 0 800 450">
          <g className={"states"}>
            {topojson.feature(us, us.objects.states).features.map((d, i) => (
              <path
                key={`path-${i}`}
                d={d3.geoPath().projection(this.projection())(d)}
                className="states"
                stroke="#101114"
                fill={ `#89E28E` }
                strokeWidth={0.5}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

export default Map;