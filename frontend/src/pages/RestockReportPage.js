/**
 * RestockReportPage.js
 * 
 * This file contains the `RestockReportPage` component 
 * `InventoryItemSlice`. It displays inventory data fetched from the server, highlighting 
 * restock severity levels for each item. 
 * 
 * Dependencies:
 * - React
 * - Axios 
 * - React Router
 * - FasterTranslationContext 
 * - CSS Module: `RestockReport.module.css`
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';
import styles from '../styles/RestockReport.module.css';

const API_URL = '/api';

/**
 * Component: RestockReportPage
 * Fetches and displays restock inventory data with severity labels for each item.
 * Allows navigation back to the manager selection page.
 * 
 * @returns {JSX.Element} The restock report page UI.
 */
function RestockReportPage() {
  const [inventoryData, setInventoryData] = useState([]);
  const navigate = useNavigate();
  const { translate } = useFasterTranslate();

  const [labels, setLabels] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Fetch inventory data and translations.
   * @async
   * @function fetchRestockData
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchRestockData = async () => {
      try {
        const response = await axios.post(`${API_URL}/doRestockQuery`);
        setInventoryData(response.data);
      } catch (error) {
        console.error('Error fetching restock data:', error);
      }
    };

    const loadTranslations = async () => {
      try {
        const translations = await translate(['Back']);
        setLabels({
          back: translations[0],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    fetchRestockData();
    loadTranslations();
  }, [translate]);

  /**
   * Navigate to the manager selection page.
   */
  const navigateToManagerSelection = () => {
    navigate('/managerselection');
  };

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className={styles.restockContainer}>
      {inventoryData.map((item, index) => (
        <InventoryItemSlice key={index} item={item} translate={translate} />
      ))}
      <button className={styles.backButton} onClick={navigateToManagerSelection}>
        {labels.back}
      </button>
    </div>
  );
}

/**
 * Component: InventoryItemSlice
 * Displays details for a single inventory item, including restock severity.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The inventory item data.
 * @param {string} props.item.name - The name of the item.
 * @param {number} props.item.quantity - The current quantity of the item.
 * @param {number} props.item.restock_level - The restock severity level.
 * @param {string} props.item.quantity_type - The unit of measurement for the item.
 * @param {Function} props.translate - The translation function from context.
 * @returns {JSX.Element} The inventory item UI.
 */
function InventoryItemSlice({ item, translate }) {
  const { name, quantity, restock_level, quantity_type } = item;

  const [translatedLabels, setTranslatedLabels] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Load translations for inventory item labels.
   * @async
   * @function loadTranslations
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Item',
          'Quantity',
          'Size',
          'Restock Severity',
          'CRITICAL!',
          'Medium',
          'Low',
        ]);

        setTranslatedLabels({
          item: translations[0],
          quantity: translations[1],
          size: translations[2],
          restockSeverity: translations[3],
          critical: translations[4],
          medium: translations[5],
          low: translations[6],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  const restockSeverity =
    restock_level === 0
      ? styles.restockCritical
      : restock_level === 1
      ? styles.restockMedium
      : styles.restockLow;

  if (loadingTranslations) {
    return <div>Loading item translations...</div>;
  }

  return (
    <div className={styles.inventoryItem}>
      <div>
        <strong>{translatedLabels.item}: </strong>
        {name}
      </div>
      <div>
        <strong>{translatedLabels.quantity}: </strong>
        {quantity}
      </div>
      <div>
        <strong>{translatedLabels.size}: </strong>
        {quantity_type}
      </div>
      <div>
        <strong>{translatedLabels.restockSeverity}: </strong>
        <span className={restockSeverity}>
          {restock_level == 0
            ? translatedLabels.critical
            : restock_level == 1
            ? translatedLabels.medium
            : translatedLabels.low}
        </span>
      </div>
    </div>
  );
}

export default RestockReportPage;
