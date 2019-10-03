// import React, { Component } from "react";
// import * as d3 from "d3";
// import * as geo from "d3-geo";
// import * as topojson from "topojson";

// import us from './assets/us-states.json';

// class Map extends Component {
//     constructor(props){
//       super(props);
//       this.createMap = this.createMap.bind(this);
//     }

//     componentDidMount() {
//         if (this.props.data.length == 0) {
//             return
//         }
//         this.createMap();
//     }

//     projection = () => {
//         return d3
//           .geoAlbersUsa()
//           .scale(1000)
//           .translate([800 / 2, 450 / 2]);
//       };

//     createMap() {
//         const node = this.node;

//         var svg = d3.select(node).append("svg");

//         var path = d3.geoPath();

//         d3.json(map, function(error, us) {
//         if (error) throw error;

//         svg.append("g")
//             .attr("class", "states")
//             .selectAll("path")
//             .data(topojson.feature(us, us.objects.states).features)
//             .enter().append("path")
//             .attr("d", path);

//         svg.append("path")
//             .attr("class", "state-borders")
//             .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <svg className={"map"} width={800} height={450} viewBox="0 0 800 450">
//                     <g>
//                         {topojson.feature(us, us.objects.states).features.map((d, i) => (
//                         <path
//                             key={`path-${i}`}
//                             d={d3.geoPath().projection(this.projection())(d)}
//                             className="states"
//                             stroke="#000"
//                             strokeWidth={0.5}
//                         />
//                         ))}
//                     </g>
//                 </svg>
//             </div>
//         );
//     }
// }

// export default Map;

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
  }

  projection = () => {
    return d3
      .geoAlbersUsa()
      .scale(1000)
      .translate([800 / 2, 450 / 2]);
  };

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
                onClick={() => {
                  console.log(d);
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

export default Map;