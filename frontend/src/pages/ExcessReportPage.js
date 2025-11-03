/**
 * ExcessReportPage Component
 *
 * This component generates a report of items whose total revenue is less than a specified amount.
 * It fetches the report data from the backend API, filters it based on user input, and displays
 * the results in a table format. The component also handles localization for the displayed text.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../contexts/TranslationContext"; // Adjust the import path as needed
import styles from "../styles/AllManager.module.css";

const API_URL = "/api";

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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime, endTime }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sales report.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

/**
 * ExcessReportPage Component
 */
const ExcessReportPage = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priceThreshold, setPriceThreshold] = useState("");
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const { translate } = useTranslate();
  const navigate = useNavigate();

  const [labels, setLabels] = useState({
    startDateTime: "Start Date & Time",
    endDateTime: "End Date & Time",
    priceThreshold: "Price Threshold",
    generateReport: "Generate Report",
    item: "Item",
    count: "Count",
    totalRevenue: "Total Revenue",
    back: "Back",
    errorFetching: "Failed to fetch sales report.",
    errorInvalidInputs: "Please enter valid inputs.",
  });

  /**
   * Loads translated labels on component mount.
   */
  useEffect(() => {
    const loadTranslations = async () => {
      const translatedLabels = {
        startDateTime: await translate("Start Date & Time"),
        endDateTime: await translate("End Date & Time"),
        priceThreshold: await translate("Price Threshold"),
        generateReport: await translate("Generate Report"),
        item: await translate("Item"),
        count: await translate("Count"),
        totalRevenue: await translate("Total Revenue"),
        back: await translate("Back"),
        errorFetching: await translate("Failed to fetch sales report."),
        errorInvalidInputs: await translate("Please enter valid inputs."),
      };
      setLabels(translatedLabels);
    };

    loadTranslations();
  }, [translate]);

  /**
   * Navigates to the manager selection page.
   */
  const navigateToManagerSelection = () => {
    navigate("/managerselection");
  };

  /**
   * Handles report generation with filtering logic for price threshold.
   */
  const handleGenerateReport = async () => {
    if (!startTime || !endTime || !priceThreshold) {
      alert(labels.errorInvalidInputs);
      return;
    }

    const result = await doSalesReportQuery(startTime, endTime);
    if (result.error) {
      setError(labels.errorFetching);
    } else {
      // Filter items with total revenue below the specified price threshold
      const filteredData = result.filter((row) => row.total_revenue < parseFloat(priceThreshold));
      setReportData(filteredData);
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
        <label className={styles.inputLabel}>
          {labels.priceThreshold}:
          <input
            className={styles.inputField}
            type="number"
            value={priceThreshold}
            onChange={(e) => setPriceThreshold(e.target.value)}
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

export default ExcessReportPage;
