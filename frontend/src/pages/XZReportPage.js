/**
 * XZReportPage Component
 * 
 * @file XZReportPage.js
 * @description This component is the page for X and Z Reports in our POS. It gathers and displays sales information since
 * the last Z Report was made, and updates the Z Report time in the database if a Z Report is created.
 * 
 * @example <XZReportPage/>
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gatherReportData, getLastZReportDate } from '../services/XZReportPageAPI';
import { useTranslate } from '../contexts/TranslationContext';
import styles from '../styles/AllManager.module.css';

const API_URL = '/api';

/**
 * XZReport Page Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered XZ Report page.
 */
function XZReportPage() {
    const navigate = useNavigate();
    const { translate } = useTranslate();

    const [queried, setQuery] = useState(false);
    const [timeUpdated, setTimeUpdated] = useState(false);
    const [reportData, setReportData] = useState({});
    const [lastZReportDate, setLastZReportDate] = useState('');
    const [translatedTexts, setTranslatedTexts] = useState({});

    /**
     * Loads translations for static labels on component mount.
     * 
     * @returns {void}
     */
    const performTranslations = async () => {
        const translations = await Promise.all([
            translate('X & Z Reports Page'),
            translate('X Report'),
            translate('Z Report'),
            translate('From'),
            translate('to now:'),
            translate('Item'),
            translate('Amount sold'),
            translate('Total Revenue'),
            translate('You have updated the Z Report date to now.'),
            translate('Back'),
        ]);

        setTranslatedTexts({
            pageTitle: translations[0],
            xReport: translations[1],
            zReport: translations[2],
            fromText: translations[3],
            toNowText: translations[4],
            itemText: translations[5],
            amountSoldText: translations[6],
            totalRevenueText: translations[7],
            zReportUpdatedText: translations[8],
            backText: translations[9],
        });
    };

    useEffect(() => {
        performTranslations();
    }, []);

    /**
     * Navigates to the manager selection page (a back button).
     * @returns {void}
     */
    const navigateToManagerSelection = () => {
        navigate('/managerselection');
    };

    /**
     * Fetches sales information from the last Z Report time in the database.
     * @param {*} isZReport Boolean for if the Z Report button was used. If so, the last Z Report time in the database is updated.
     */
    const fetchData = async (isZReport) => {
        setReportData(await gatherReportData(isZReport));
        setQuery(true);
        setTimeUpdated(isZReport);
        setLastZReportDate((await getLastZReportDate()).rows[0].date);
    };

    return (
        <div className={styles.container}>
            <h3>{translatedTexts.pageTitle}</h3>
            <div>
                <button
                    className={styles.button}
                    onClick={() => fetchData(false)}
                >
                    {translatedTexts.xReport}
                </button>
                <button
                    className={styles.button}
                    onClick={() => fetchData(true)}
                >
                    {translatedTexts.zReport}
                </button>
            </div>

            {queried && (
                <div className={styles.reportContainer}>
                    <div className={styles.reportHeader}>
                        {translatedTexts.fromText} {lastZReportDate} {translatedTexts.toNowText}
                    </div>

                    <div>
                        {reportData.rows.map((item, index) => (
                            <div key={index} className={styles.reportRow}>
                                <div className={styles.reportCell}>
                                    {translatedTexts.itemText}: {item.size}
                                </div>
                                <div className={styles.reportCell}>
                                    {translatedTexts.amountSoldText}: {item.count}
                                </div>
                                <div className={styles.reportCell}>
                                    {translatedTexts.totalRevenueText}: ${item.total_revenue}
                                </div>
                            </div>
                        ))}
                    </div>

                    {timeUpdated && (
                        <div className={styles.timeUpdatedMessage}>
                            {translatedTexts.zReportUpdatedText}
                        </div>
                    )}
                </div>
            )}

            <button className={styles.button} onClick={navigateToManagerSelection}>
                {translatedTexts.backText}
            </button>
        </div>
    );
}

export default XZReportPage;
