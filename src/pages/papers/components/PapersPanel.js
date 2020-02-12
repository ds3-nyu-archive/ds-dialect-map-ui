/* encoding: utf-8 */

import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Grid } from "semantic-ui-react";
import PapersSearch from "./PapersSearch";
import PapersSidebar from "./PapersSidebar";
import MapCanvas from "./tabs/Map";


class PapersPanel extends Component {


    constructor(props) {
        super(props);
        this.state = {
            chosenTab: "map",
            papers: [],
        };

        // Necessary binding in order to allow children actions
        this.getChosenTab = this.getChosenTab.bind(this);
        this.getPapers = this.getPapers.bind(this);
        this.setMapTab = this.setMapTab.bind(this);
        this.setPapers = this.setPapers.bind(this);
    }


    getChosenTab() {
        return this.state.chosenTab;
    }


    getPapers() {
        return this.state.papers;
    }


    setMapTab() {
        this.setState({chosenTab: "map"});
    }


    setPapers(papers) {
        this.setState({papers: papers});
    }


    renderTab() {
        switch (this.state.chosenTab) {
            case "map":
                return <MapCanvas getPapers={this.getPapers}/>;
            default:
                return <MapCanvas getPapers={this.getPapers}/>;
        }
    }


    render() {
        return (
            <Grid className="panel-layout">

                <Grid.Row stretched className="panel-header">
                    <Grid.Column width={16}>
                        <PapersSearch
                            setPapers={this.setPapers}
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row stretched className="panel-body">
                    <Grid.Column width={1} className="panel-body-sidebar">
                        <PapersSidebar
                            getChosenTab={this.getChosenTab}
                            setMapTab={this.setMapTab}
                        />
                    </Grid.Column>
                    <Grid.Column width={15} className="panel-body-main">
                        { this.renderTab() }
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        );
    }
}


export default withCookies(PapersPanel);
