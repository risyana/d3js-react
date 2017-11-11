import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';

const MONTH = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


class HeatMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            baseTemperature : null,
        }
    }

    componentDidMount() {
        this.setState({baseTemperature:this.props.data.baseTemperature});
        this.createHeatMap()
    }

    componentDidUpdate() {
        this.createHeatMap()
    }

    tooltipContent(data) {
        var html = "";
        html += `${data.year} / ${MONTH[data.month - 1]} <br/><br/>`;
        html += `Temp: ${(this.state.baseTemperature + data.variance).toFixed(3)} <sup>o</sup>C <br/>`;
        html += `Variance: ${data.variance.toFixed(3)} <sup>o</sup>C <br/>`;
        return html;
    }

    createHeatMap() {

        // Reference to SVG (node) and div (toolip)
        const node = this.node
        const tooltip = this.tooltip

        // tooltip
        let div = d3.select(tooltip).append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden");

        // define minimum and maximum value of each data set
        let yMax = d3.max(this.props.data.monthlyVariance.map((elm, idx) => elm.month));
        let yMin = d3.min(this.props.data.monthlyVariance.map((elm, idx) => elm.month));
        
        let xMax = d3.max(this.props.data.monthlyVariance.map((elm, idx) => elm.year));
        let xMin = d3.min(this.props.data.monthlyVariance.map((elm, idx) => elm.year));

        // Scale and domain for y (GDP) and x (Date)
        let yScaleAdjust = 18
        const yAxis = d3.scaleLinear()
        .domain([yMin, yMax ])
        .range([0 + yScaleAdjust, this.props.size[1] - yScaleAdjust]);
        
        const xAxis = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0 , this.props.size[0]]);

        // Draw rectangles into SVG (ref:node)
        let rectWidht = this.props.size[0] / (xMax - xMin);
        let rectHeight = this.props.size[1] / MONTH.length;

         d3.select(node)
            .selectAll('rect')
            .data(this.props.data.monthlyVariance)
            .enter()
            .append('rect')
            .attr("fill",  elm => "rgb(121, " + (83 - Math.floor(elm.variance * 30)) + ", 65)")
            .attr('x', elm => (elm.year - xMin) * rectWidht)
            .attr('y', elm => (elm.month * rectHeight) - rectHeight)
            .on("mouseover", elm  => {
                div.style("visibility", "visible")
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .html(()=>this.tooltipContent(elm));
            })
            .on("mouseout", () => {
                div.style("visibility", "hidden");
            })
            .attr('width', 0)   //animation
            .attr('height', 0)  //animation
            .transition()   //animation
            .duration(20)   //animation
            .delay((elm, idx) => idx * 1) //animation
            .attr('width', rectWidht)
            .attr('height', rectHeight) 

        // Draw left axis into SVG (ref:node) based on y (GPD)
        d3.select(node)
            .append("g")
            .call(d3.axisLeft(yAxis).tickFormat(elm => MONTH[elm-1]));  

        // Draw bottom axis into SVG (ref:node) based on x(date)
        d3.select(node)
            .append("g")
            .call(d3.axisBottom(xAxis).tickFormat(elm => elm.toString()))
            .attr("transform", "translate(0," + this.props.size[1] + ")")

        // Draw various text into SVG : Title, left axis title, bottom axis title
        d3.select(node)
            .append("text")
            .attr("x", (this.props.size[0] / 2))
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "none")
            .text("Monthly Land Surface Temperature (1753 - 2015)");

        d3.select(node)
            .append("text")
            .attr("x", - this.props.size[1] / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("transform", "rotate(270deg")
            .style("font-size", "12px")
            .text("  ")

        d3.select(node)
            .append("text")
            .attr("x", this.props.size[0] / 2)
            .attr("y", this.props.size[1] + 40)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Year");

    }

    render() {
        return (
            <div>
                <div ref={tooltip => this.tooltip = tooltip}>
                    <svg ref={node => this.node = node}
                        width={this.props.size[0] + 5}
                        height={this.props.size[1]}
                        className='d3'>
                    </svg>
                </div>
            </div>
        );
    }
}


export default HeatMap