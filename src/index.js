import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import Maps from './components/Maps';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
/* ReactDOM.render(<Maps bootstrapURLKeys= { {key: "AIzaSyCjBWArCOL78mehh8Lbc1acXqCj-kCLSxo" } }
                    defaultCenter= { { lat: 1.2922997, lng: 103.8571885} }
                    defaultZoom= { 15 }
                    zoom= { 15 }
                    center = { { lat: 1.2922997, lng: 103.8571885} }
                    />, document.getElementById('root'));
 */

registerServiceWorker();
