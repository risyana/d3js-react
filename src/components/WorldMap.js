import React, { Component } from 'react'
import '../App.css'
import worlddata from '../asset/world'
import { geoMercator, geoPath, geoEquirectangular } from 'd3-geo'


class WorldMap extends Component {
    render() {
        const projection = geoEquirectangular()
        const pathGenerator = geoPath().projection(projection)
        const countries = worlddata.features
            .map((d, i) => <path
                key={'path' + i}
                d={pathGenerator(d)}
                className='countries'
                fill = 'white'
            />)
        return <g>
            {countries}
            </g>
    }
}
export default WorldMap