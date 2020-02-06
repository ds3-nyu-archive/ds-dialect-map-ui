/* encoding: utf-8 */

import React, { Component } from "react";
import config from "../../../../config";
import MapLayerControl from "./MapLayerControl";
import MapSelectedPaper  from "./MapSelected";
import { CircleMarker, Map } from "react-leaflet";
import { CRS } from "leaflet";
import "leaflet/dist/leaflet.css";


export default class MapCanvas extends Component {


    constructor(props) {
        super(props);

        // Set up at render() time
        this.map = null;

        // Necessary binding in order to pass these functions to children
        this.getMap = this.getMap.bind(this);
        this.viewToWorld = this.viewToWorld.bind(this);
        this.worldToView = this.worldToView.bind(this);
    }


    componentDidMount () {
        setTimeout(() => this.map.invalidateSize(), 200);
    }


    getMap() {
        return this.map;
    }


    setMap(ref) {
        if (this.map === null) {
            this.map = ref.leafletElement;
        }
    }


    worldToView(world_X, world_Y) {
        // Leaflet considers [Y, X] not [X, Y]
        return [
            (-1 * (world_Y - config.worldMinY) * config.worldToViewScale),
            (+1 * (world_X - config.worldMinX) * config.worldToViewScale),
        ];
    }


    viewToWorld(view_X, view_Y) {
        // PaperScape considers [X, Y] not [Y, X]
        return [
            (+1 * view_X * config.viewToWorldScale) + config.worldMinX,
            (-1 * view_Y * config.viewToWorldScale) + config.worldMinY,
        ];
    }


    render() {
        const { papersList } = this.props;

        return (
            // The "ref" prop is necessary to obtain the created instance
            <Map
                center={config.mapInitialCenter}
                crs={CRS.Simple}
                maxBounds={config.mapBounds}
                maxBoundsViscosity={config.mapBoundsViscosity}
                zoom={config.mapInitialZoom}
                zoomDelta={config.mapZoomDelta}
                zoomSnap={config.mapZoomSnap}
                ref={(ref) => this.setMap(ref)}
            >
                <MapLayerControl
                    getMap={this.getMap}
                    viewToWorld={this.viewToWorld}
                    worldToView={this.worldToView}
                />

                <MapSelectedPaper
                    getMap={this.getMap}
                    viewToWorld={this.viewToWorld}
                    worldToView={this.worldToView}
                />

                {papersList.map((paper, index) =>
                    <CircleMarker
                        key={index}
                        center={this.worldToView(paper.x, paper.y)}
                        color={"red"}
                        radius={4}>
                    </CircleMarker>
                )}
            </Map>
        );
    }
}
