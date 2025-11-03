/**
 * SalesReportPage Component
 * 
 * This component allows users to generate a sales report based on a given start 
 * and end date & time. It fetches the report data from the backend API, displays
 * the results in a table format, and provides error handling for invalid inputs 
 * or failed API calls. The component also handles localization for the displayed text.
 * 
 * Features:
 * - Input fields for start and end date/time to specify the report period.
 * - Generates a report by fetching data from the backend based on user input.
 * - Displays the report in a table format with item count and total revenue.
 * - Handles errors related to invalid input or API failure.
 * - Supports translation for UI labels to adapt to different languages.
 * 
 * API Endpoints:
 * - `/api/doSalesReportQuery` - Fetches the sales report data based on the start and end times.
 * 
 * @component
 * @example
 * // Usage Example:
 * <SalesReportPage />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Adjust the import path as needed
import styles from '../styles/AllManager.module.css';

const API_URL = '/api';

/**
 * Function to fetch the sales report data from the backend.
 * 
 * @param {string} startTime - The start date & time for the report.
 * @param {string} endTime - The end date & time for the report.
 * @returns {Object} - The sales report data or an error message if the fetch fails.
 */
async function doSalesReportQuery(startTime, endTime) {
  try {
    const response = await fetch(`${API_URL}/doSalesReportQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime, endTime }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales report.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

/**
 * The main component that displays the sales report form, handles report generation,
 * and displays the report data or error messages.
 * 
 * @component
 */
const SalesReportPage = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const { translate } = useTranslate();
  const navigate = useNavigate();

  const [labels, setLabels] = useState({
    startDateTime: 'Start Date & Time',
    endDateTime: 'End Date & Time',
    generateReport: 'Generate Report',
    item: 'Item',
    count: 'Count',
    totalRevenue: 'Total Revenue',
    back: 'Back',
    errorFetching: 'Failed to fetch sales report.',
    errorInvalidDates: 'Please enter valid start and end times.',
  });

  /**
   * Loads the translated labels for the UI elements when the component mounts.
   */
  useEffect(() => {
    const loadTranslations = async () => {
      const translatedLabels = {
        startDateTime: await translate('Start Date & Time'),
        endDateTime: await translate('End Date & Time'),
        generateReport: await translate('Generate Report'),
        item: await translate('Item'),
        count: await translate('Count'),
        totalRevenue: await translate('Total Revenue'),
        back: await translate('Back'),
        errorFetching: await translate('Failed to fetch sales report.'),
        errorInvalidDates: await translate('Please enter valid start and end times.'),
      };
      setLabels(translatedLabels);
    };

    loadTranslations();
  }, [translate]);

  /**
   * Navigates to the manager selection page when the back button is clicked.
   */
  const navigateToManagerSelection = () => {
    navigate('/managerselection');
  };

  /**
   * Handles the report generation when the "Generate Report" button is clicked.
   */
  const handleGenerateReport = async () => {
    if (!startTime || !endTime) {
      alert(labels.errorInvalidDates);
      return;
    }

    const result = await doSalesReportQuery(startTime, endTime);
    if (result.error) {
      setError(labels.errorFetching);
    } else {
      setReportData(result);
      setError(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          {labels.startDateTime}:
          <input
            className={styles.inputField}
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className={styles.inputLabel}>
          {labels.endDateTime}:
          <input
            className={styles.inputField}
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button className={styles.button} onClick={handleGenerateReport}>
          {labels.generateReport}
        </button>
      </div>

      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{labels.item}</th>
            <th>{labels.count}</th>
            <th>{labels.totalRevenue}</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td>{row.item}</td>
              <td>{row.count}</td>
              <td>{row.total_revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.button} onClick={navigateToManagerSelection}>
        {labels.back}
      </button>
    </div>
  );
};

export default SalesReportPage;
