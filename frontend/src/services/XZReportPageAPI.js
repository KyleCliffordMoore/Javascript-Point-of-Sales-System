/**
 * @file XZReportPageAPI.js
 * @description Provides functions for API requests to fetch information necessary for X and Z Reports.
 */

const API_URL = '/api';

/**
 * Queries the API to gather all sales data since the last Z Report to create an X or Z Report.
 * Updates the last Z Report time in the database if a Z Report is being created.
 * 
 * @param {boolean} modifyDatabase Boolean to update last Z Report time in database or not
 * @returns {JSON} API Response with sales data
 */
export const gatherReportData = async (modifyDatabase) => {
    const XZReportResponse = await fetch(`${API_URL}/doXZReport`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modifyDatabase: modifyDatabase }),
    });
    if (!XZReportResponse.ok) {
        return;
    }

    return (await XZReportResponse.json()).results;
};

/**
 * Queries the API for the last time a Z Report was created.
 * 
 * @returns {JSON} API Response
 */
export const getLastZReportDate = async () => {
    const ZReportDateResponse = await fetch(`${API_URL}/getLastZReportDate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!ZReportDateResponse.ok) {
        return;
    }

    return (await ZReportDateResponse.json()).results;
};
