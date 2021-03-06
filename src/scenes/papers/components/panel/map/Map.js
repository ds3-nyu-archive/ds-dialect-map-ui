/* encoding: utf-8 */

import { Component } from "react";
import config from "../../../../../config";
import { JargonColors } from "../search/JargonSearch";
import MapLayerControl from "./MapLayerControl";
import MapSelectPaper from "./MapSelectPaper";
import { Circle, MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

export default class MapCanvas extends Component {
    /** Component containing all the map related information / rendering */

    constructor(props) {
        super(props);

        // Set up at render() time
        this.map = null;

        // Necessary binding in order to access parent functions
        this.calcJargonColor = this.calcJargonColor.bind(this);

        // Necessary binding in order to pass these functions to children
        this.getMap = this.getMap.bind(this);
        this.viewToWorld = this.viewToWorld.bind(this);
        this.worldToView = this.worldToView.bind(this);
    }

    getMap() {
        return this.map;
    }

    setMap(map) {
        if (this.map === null) {
            this.map = map;
        }
    }

    convertRadius(radius) {
        return radius * config.worldToViewScale;
    }

    convertRGBColor(color) {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    calcJargonColor(paperId) {
        let jargonExtras = this.props.getJargonExtras();
        let paperFreqs = jargonExtras.freqByPaper[paperId];

        let [freqA, freqB] = Object.values(paperFreqs);
        let [colorA, colorB] = JargonColors.map(c => c.rgb);

        if (freqA === 0) {
            return this.convertRGBColor(colorB);
        }
        if (freqB === 0) {
            return this.convertRGBColor(colorA);
        }

        let colorARatio = freqB > freqA ? freqA / freqB : 1 - freqB / freqA;
        let colorBRatio = freqA > freqB ? freqB / freqA : 1 - freqA / freqB;

        return this.convertRGBColor({
            r: colorARatio * colorA.r + colorBRatio * colorB.r,
            g: colorARatio * colorA.g + colorBRatio * colorB.g,
            b: colorARatio * colorA.b + colorBRatio * colorB.b,
        });
    }

    worldToView(world_X, world_Y) {
        // Leaflet considers [Y, X] not [X, Y]
        return [
            -1 * (world_Y - config.worldMinY) * config.worldToViewScale,
            +1 * (world_X - config.worldMinX) * config.worldToViewScale,
        ];
    }

    viewToWorld(view_X, view_Y) {
        // PaperScape considers [X, Y] not [Y, X]
        return [
            +1 * view_X * config.viewToWorldScale + config.worldMinX,
            -1 * view_Y * config.viewToWorldScale + config.worldMinY,
        ];
    }

    render() {
        const jargonPapers = this.props.getJargonPapers();
        const searchPapers = this.props.getSearchPapers();

        return (
            // In react-leaflet v2, "ref" is used to obtain the created map instance
            // In react-leaflet v3, "whenCreated" is used to obtain the created map instance
            <MapContainer
                className="map-component"
                center={config.mapInitialCenter}
                crs={CRS.Simple}
                maxBounds={config.mapBoundsCoords}
                maxBoundsViscosity={config.mapBoundsViscosity}
                zoom={config.mapInitialZoom}
                zoomControl={config.mapZoomControl}
                zoomDelta={config.mapZoomDelta}
                zoomSnap={config.mapZoomSnap}
                whenCreated={map => this.setMap(map)}
            >
                <MapLayerControl
                    getMap={this.getMap}
                    viewToWorld={this.viewToWorld}
                    worldToView={this.worldToView}
                />

                <MapSelectPaper
                    convertRadius={this.convertRadius}
                    viewToWorld={this.viewToWorld}
                    worldToView={this.worldToView}
                />

                {jargonPapers.map((paper, index) => (
                    <Circle
                        key={index}
                        center={this.worldToView(paper.x, paper.y)}
                        color={this.calcJargonColor(paper.id)}
                        radius={this.convertRadius(paper.r)}
                    />
                ))}

                {searchPapers.map((paper, index) => (
                    <Circle
                        key={index}
                        center={this.worldToView(paper.x, paper.y)}
                        color={"white"}
                        radius={this.convertRadius(paper.r)}
                    />
                ))}
            </MapContainer>
        );
    }
}
