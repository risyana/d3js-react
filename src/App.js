import React, { Component } from 'react'
import './App.css'
import BarChart from './components/BarChart'
import ScatterPlot from './components/ScatterPlot'
import HeatMap from './components/HeatMap'
import WorldMap from './components/WorldMap'
import MeteorStrike from './components/MeteorStrike'

const URL_BARCHART = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const URL_SCATTERPLOT = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const URL_HEATMAP = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const URL_METEOR = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data_barchart : null,
      data_scatterplot : null,
      data_heatmap : null,
      data_meteor : null,
    }
  }

  /**
   * BARCHART
   */
  fetchDataBarchart(){
    fetch(URL_BARCHART)
    .then(response => response.json())
    .then(result => this.setDataBarchart(result))
  }

  setDataBarchart(result){
    this.setState({data_barchart:result.data});
  }

  /**
   * SCATTERPLOT
   */
  fetchDataScatterplot() {
    fetch(URL_SCATTERPLOT)
      .then(response => response.json())
      .then(result => this.setDataScatterplot(result))
  }

  setDataScatterplot(result) {
    this.setState({data_scatterplot: result });
  }

  /**
   * HEATMAP
   */
  fetchDataHeatMap() {
    fetch(URL_HEATMAP)
      .then(response => response.json())
      .then(result => this.setDataHeatMap(result))
  }

  setDataHeatMap(result) {
    this.setState({ data_heatmap: result });
  }

  /**
   * MAP METEOR
   */
  fetchDataMeteor(){
    fetch(URL_METEOR)
    .then(response => response.json())
    .then(result => this.setDataMeteor(result))
  }

  setDataMeteor(result){
    this.setState({data_meteor:result})
  }

  componentDidMount(){
    this.fetchDataBarchart();
    this.fetchDataScatterplot();
    this.fetchDataHeatMap();
    this.fetchDataMeteor();
  }

  render() {
    
    
    if (!this.state.data_scatterplot || !this.state.data_barchart 
      || !this.state.data_heatmap || !this.state.data_meteor) return null;
      
    return (
      <div className='container-fluid'>

        {/* METEOR STRIKE */}
        <div className='row'>
          <div>
            <h2>Meteor Strikes Earth</h2>
            <MeteorStrike
              data={this.state.data_meteor}
              size={[1000, 500]} />
          </div>
        </div>

        {/* HEAT MAP */}
        <div className='row'>
          <div>
            {<HeatMap 
              data={this.state.data_heatmap}
              size={[900,300]}/>}
          </div>  
        </div>

        {/* BARCHART & SCATTERPLOT */}
        <div className='row'>
          <div className='col col-md-6' id="left">
           {<BarChart 
              data={this.state.data_barchart} 
              size={[450, 300]} /> }
          </div> 
          <div className='col col-md-6' id="right">
           { <ScatterPlot
              data={this.state.data_scatterplot}
              size={[450, 300]} />}
          </div>
        </div> 


      </div>
    )
  }
}
export default App