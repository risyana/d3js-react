import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';

class ScatterPlot extends Component {
    constructor(props) {
        super(props)
        this.createScatterPlot = this.createScatterPlot.bind(this);
        this.getMinuteSeconds = this.getMinuteSeconds.bind(this);
    }

    componentDidMount() {
        this.createScatterPlot()
    }

    componentDidUpdate() {
        this.createScatterPlot()
    }

    getMinuteSeconds(elm){
        var minutes = Math.floor(elm / 60);
        var seconds = elm % 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    tooltipContent(data){
        var html = "";
        html += `${data.Name} : ${data.Nationality} <br/>` ;
        html += `Year: ${data.Year} - Time: ${this.getMinuteSeconds(data.Seconds)} <br/><br/>`;
        html += `${data.Doping}`
        return html;
    }

    createScatterPlot() {

        // Reference to SVG (node) and div (toolip)
        const node = this.node
        const tooltip = this.tooltip

        // tooltip
        let div = d3.select(tooltip).append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden");

        // define minimum and maximum value of each data set
        let yMax = d3.max(this.props.data.map((elm, idx) => elm.Place));
        let yMin = d3.min(this.props.data.map((elm, idx) => elm.Place));
        yMin = 0;
        let xMax = d3.max(this.props.data.map((elm, idx) => (elm.Seconds)));
        let xMin = d3.min(this.props.data.map((elm, idx) => (elm.Seconds)));


        // Scale and domain for y (ranks) and x (seconds)
        const yAxis = d3.scaleLinear()
            .domain([yMin, yMax + 2])
            .range([0, this.props.size[1]]);

        const xAxis = d3.scaleLinear()
            .domain([0, xMax - xMin + 3])
            .range([this.props.size[0], 0])

        // Draw circle into SVG (ref:node)
        d3.select(node)
            .selectAll('circle')
            .data(this.props.data)
            .enter()
            .append('circle')
            .attr('cx', elm => xAxis(elm.Seconds - xMin))
            .attr('cy', elm => yAxis(elm.Place))
            .style('fill', elm => elm.Doping ? 'red' : 'rgb(34,140,100)') 
            .style('stroke-width', '0.5px')
            .on("mouseover", elm => {
                div.style("visibility", "visible")
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .html(()=>this.tooltipContent(elm)); 
            })
            .on("mouseout", () => {
                div.style("visibility", "hidden"); 
            })
            .attr("r", 0)   //animation
            .transition()   //animation
            .duration(300)  //animation
            .delay((elm, idx) => idx * 100) //animation
            .attr("r", 4);  //animation

        // Draw texts into SVG (ref:node)
        d3.select(node)
            .selectAll('text')
            .data(this.props.data)
            .enter()
            .append('text')
            .attr('x', elm => xAxis(elm.Seconds - xMin) + 6)
            .attr('y', 0)   //animation
            .transition()   //animation
            .duration(300)  //animation
            .delay((elm, idx) => idx * 100) //animation
            .attr('y', elm => yAxis(elm.Place) + 3)
            .text(elm => elm.Name)
            .attr("text-anchor", "left")
            .style("font-size", "10px")

        // Draw left axis into SVG (ref:node) based on y (GPD)
        d3.select(node)
            .append("g")
            .call(d3.axisLeft(yAxis));

        // Draw bottom axis into SVG (ref:node) based on x(date)
        d3.select(node)
            .append("g")
            .call(d3.axisBottom(xAxis).tickFormat((elm) => this.getMinuteSeconds(elm)))
            .attr("transform", "translate(0," + this.props.size[1] + ")")

        // Draw various text into SVG : Title, left axis title, bottom axis title
        d3.select(node)
            .append("text")
            .attr("x", (this.props.size[0] / 2))
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "none")
            .attr("class", "xxxxxx")
            .text("Doping in Professional Bicycle Racing");

        d3.select(node)
            .append("text")
            .attr("x", - this.props.size[1] / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("transform", "rotate(270deg")
            .style("font-size", "12px")
            .text("Ranks")

        d3.select(node)
            .append("text")
            .attr("x", this.props.size[0] / 2)
            .attr("y", this.props.size[1] + 40)
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Minutes Behind fastest Time");

    }

    render() {
        return (
            <div>
                <div ref={tooltip => this.tooltip = tooltip}>
                <svg ref={node => this.node = node}
                    width={this.props.size[0] + 5}
                    height={this.props.size[1] + 5}
                    className='d3'
                    style={{"paddingRight":"80px"}}>
                </svg>
                </div>
            </div>
        );
    }
}


export default ScatterPlot