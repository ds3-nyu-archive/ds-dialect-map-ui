/* encoding: utf-8 */

import config from "../../../../config";
import PaperPosition from "../../models/PaperPosition";

export default class PaperSearchPositionCtl {
    /** Controller defining the paper position search queries to the Paperscape API */

    static fetchPapersPos(paperIDs) {
        let url = config.papersDataURL;
        let params = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: this._buildRequestBody(paperIDs),
        };

        return fetch(url, params)
            .then(resp => resp.json())
            .then(json => this._handlePaperPosResp(json));
    }

    static _buildRequestBody(paperIDs) {
        // prettier-ignore
        paperIDs = paperIDs.map((id) => "&mp2l[]=" + id);
        paperIDs = paperIDs.join("");
        return "tbl=" + paperIDs;
    }

    static _handlePaperPosResp(json) {
        let paperPos = [];

        try {
            let data = json["r"];
            paperPos = data.map(paper => new PaperPosition(paper));
        } catch (error) {
            console.log(error);
        }

        return paperPos;
    }
}
