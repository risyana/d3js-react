import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';
import worlddata from '../asset/world'

class MeteorStrike extends Component {
    constructor(props) {
        super(props);
        this.state = {meteor:null} ;
    }

    componentDidMount() {
        this.createMeteorStrike()
    }

    componentDidUpdate() {
        this.createMeteorStrike()
    }


    tooltipContent(data) {
        var properties = data.properties;
        var html = "";
        html += `<strong>${properties.name} / ${properties.recclass} / ${properties.fall}</strong><br/>`
        html += `<strong>Year:</strong> ${properties.year.substring(0,4)} <br/>`
        html += `<strong>Mass:</strong> ${properties.mass} <br/><br/>`
        html += `<strong>Coordinate</strong> <br/>`
        html += `lat: ${properties.reclat}<br/> long: ${properties.reclong}`
        return html;
    }

    createMeteorStrike() {

        let node = this.node; 
        let tooltip = this.tooltip; 
        
        //container of map & circles
        var g = d3.select(node).append("g");

        // tooltip
        let div = d3.select(tooltip).append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden");

        //projection type
        var proj = d3.geoEquirectangular();
        var path = d3.geoPath().projection(proj);

        // world map (path)
        g.selectAll("path")
        .data(worlddata.features)
        .enter()
        .append("path")
        .attr("d", (elm)=>path(elm))
        .attr("fill","white")
        
        
        // meteor (circle)
        
        let orderedByMass = this.props.data.features.sort((a,b)=>{
            let a_prop = a.properties
            let  b_prop = b.properties
            return b_prop.mass - a_prop.mass ;
        });

        g.selectAll("circle")
        .data(orderedByMass)
        .enter()
        .append("circle")
        .attr("class","meteor")
        .attr("cx", (elm,idx) => {
            let geometry = elm.geometry;
            if (!elm.geometry) return 0;
            let coordinates = proj([geometry.coordinates[0],geometry.coordinates[1]])
            return coordinates[0]
        })
        .attr("cy", (elm, idx) => {
            let geometry = elm.geometry;
            if (!elm.geometry) return 0;
            let coordinates = proj([geometry.coordinates[0], geometry.coordinates[1]])
            return coordinates[1]
        })
        .attr("r", (elm,idx) => {
            let properties = elm.properties
            let r = Math.pow(((21/88)*properties.mass)/200,1/3);
            return r;
        }).on("mouseover", elm => {
                div.style("visibility", "visible")
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .html(() => this.tooltipContent(elm));
            })
        .on("mouseout", () => {
            div.style("visibility", "hidden");
        })

        // zoom & drag listener
        d3.select(node)
        .attr("width", this.props.size[0])
        .attr("height", this.props.size[1])
        .call(d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", () => g.attr("transform", d3.event.transform)));

    }

    render() {
        return (
        <div >
           <h3>Meteor Strikes Earth</h3>
           <div ref={tooltip => this.tooltip = tooltip}>
            </div>
            <svg ref={node => this.node = node}
                width={this.props.size[0] + 5}
                height={this.props.size[1] + 5}
                className='meteor'>                      
            </svg>
        </div>
        );
    }
}


export default MeteorStrike