import express from "express";
import axios from "axios";
const app = express();
const port = 3002;

const composeQuery = (originalQuery) => {
    let query = originalQuery;

    if (originalQuery?.decompress) {
        query.ignoreReqHeaders = originalQuery?.decompress === "true";
    }

    if (originalQuery?.ignoreReqHeaders) {
        query.ignoreReqHeaders = originalQuery?.ignoreReqHeaders === "true";
    }

    if (originalQuery?.redirectWithProxy) {
        query.ignoreReqHeaders = originalQuery?.redirectWithProxy === "true";
    }

    if (originalQuery?.followRedirect) {
        query.followRedirect = originalQuery?.followRedirect === "true";
    }

    if (originalQuery?.appendReqHeaders) {
        const headers = parseHeaders(originalQuery.appendReqHeaders);

        query.appendReqHeaders = composeHeaders(headers);
    }

    if (originalQuery?.appendResHeaders) {
        const headers = parseHeaders(originalQuery.appendResHeaders);

        query.appendResHeaders = composeHeaders(headers);
    }

    if (originalQuery?.deleteReqHeaders) {
        const headers = parseHeaders(originalQuery.deleteReqHeaders);

        query.deleteReqHeaders = headers;
    }

    if (originalQuery?.deleteResHeaders) {
        const headers = parseHeaders(originalQuery.deleteResHeaders);

        query.deleteResHeaders = headers;
    }
    return query;
};

const handleProxy = async (req, res) => {
    const { url, src } = req.query;
    const options = {
        responseType: 'stream',
        headers: {
            referer: url,
        },
    }

    const response = await axios.get(src, options);

    response.data.pipe(res);

};
app.get("/proxy", handleProxy);


app.listen(port, () => {
    console.log(`running  on port ${port}!`);
});