import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
        this.formatter = this.formatter.bind(this)
    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    tooltipContent(data) {
        var html = "";
        html += data[0].substring(0, 4) + "/" + data[0].substring(5, 7) + "<br/>" ;;
        html += this.formatter().format(data[1]) + " Billion" 
        return html;
    }

    // ES6 currency format
    formatter(){
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        })
    }

    createBarChart() {
        
        // Reference to SVG (node) and div (toolip)
        const node = this.node
        const tooltip = this.tooltip

        // tooltip
        let div = d3.select(tooltip).append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden");

        // define minimum and maximum value of each data set
        let yMax = d3.max(this.props.data.map(elm => elm[1]));    
        let yMin = d3.min(this.props.data.map(elm => elm[1]));
        yMin = 0;
        let xMax = d3.max(this.props.data.map(elm => new Date(elm[0])));
        let xMin = d3.min(this.props.data.map(elm => new Date(elm[0])));
        let dataLength = this.props.data.length;
            
        // Scale and domain for y (GDP) and x (Date)
        const yAxis = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.props.size[1], 0]);
        
        const xAxis = d3.scaleTime()
            .domain([xMin, xMax])
            .rangeRound([0, this.props.size[0]]);

        // Draw rectangles into SVG (ref:node)
        d3.select(node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('id','barchart')
            .attr('x', (elm,idx) => (idx * this.props.size[0] / dataLength) )
            .attr('y', elm =>  yAxis(elm[1]))
            .on("mouseover", elm => {
                div.style("visibility", "visible")
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .html(()=>this.tooltipContent(elm))
            })
            .on("mouseout", () => {
                div.style("visibility", "hidden");
            })
            .attr('width', this.props.size[0] / dataLength)
            .attr('heigth', 0) //animation
            .transition() //animation
            .duration(30) //animation
            .delay((elm, idx) => idx * 10) //animation
            .attr('height', elm => this.props.size[1] - yAxis(elm[1]))

        // Draw left axis into SVG (ref:node) based on y (GPD)
        d3.select(node)
        .append("g")
        .call(d3.axisLeft(yAxis));
        
        // Draw bottom axis into SVG (ref:node) based on x(date)
        d3.select(node)
        .append("g")
        .call(d3.axisBottom(xAxis))
        .attr("transform", "translate(0," + this.props.size[1] + ")")
        
        // Draw various text into SVG : Title, left axis title, bottom axis title
        d3.select(node)
            .append("text")
            .attr("x", (this.props.size[0] / 2))
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "none")
            .text("USA Gross Domestic Product");

        d3.select(node)
            .append("text")
            .attr("x", - this.props.size[1] / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("transform", "rotate(270deg")
            .style("font-size", "12px")
            .text("GDP (billion USD) ")

        d3.select(node)
            .append("text")
            .attr("x", this.props.size[0] / 2)
            .attr("y", this.props.size[1] + 40)
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Year");   

    }

    render() {
        return( 
            <div>
                <div ref={tooltip => this.tooltip = tooltip}>
                <svg ref={node => this.node = node}
                    width={this.props.size[0]} 
                    height={this.props.size[1]}
                    className='d3'>
                </svg>
                </div>
            </div>
        );
    }
}


export default BarChart