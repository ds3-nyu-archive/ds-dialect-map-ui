/* encoding: utf-8 */

import { Component } from "react";
import { Icon, Menu } from "semantic-ui-react";
import { PanelTabs } from "./Panel";

export default class PapersSidebar extends Component {
    /** Component defining the main section sidebar to change between tabs */

    isSearchActive() {
        return this.props.getChosenTab() === PanelTabs.PAPER_SEARCH;
    }

    // isJargonActive() {
    //     return this.props.getChosenTab() === PanelTabs.JARGON_SEARCH;
    // }

    render() {
        const { setJargonTab, setSearchTab } = this.props;

        return (
            <Menu compact icon vertical>
                <Menu.Item
                    name="search"
                    active={this.isSearchActive()}
                    onClick={setSearchTab}
                >
                    <Icon circular inverted color="blue" name="search" />
                </Menu.Item>
                {/*<Menu.Item*/}
                {/*    name="jargon"*/}
                {/*    active={this.isJargonActive()}*/}
                {/*    onClick={setJargonTab}*/}
                {/*>*/}
                {/*    <Icon circular inverted color="blue" name="comment" />*/}
                {/*</Menu.Item>*/}
            </Menu>
        );
    }
}
