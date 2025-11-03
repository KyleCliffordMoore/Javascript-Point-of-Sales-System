/**
 * InventoryPage Component
 * 
 * This component renders the inventory management interface for managers. It displays a list 
 * of inventory items retrieved from the backend and provides options to add, edit, or remove 
 * inventory items.
 * 
 * Features:
 * - Displays a list of inventory items with their details (name, quantity, size).
 * - Allows navigation to add new items or edit existing items.
 * - Supports removing items from the inventory.
 * - Dynamically translates labels and messages based on the selected language.
 * 
 * API Endpoints:
 * - `/api/doInventoryLoad` - Fetches all inventory items.
 * - `/api/removeInventoryItem` - Removes an inventory item by ID.
 * 
 * @example
 * <InventoryPage />
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';
import styles from '../styles/AllManager.module.css';
import '../styles/Inventory.css';

const API_URL = '/api'; // Base URL for the backend

/**
 * InventoryPage Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered inventory management page.
 */
function InventoryPage() {
  const [InventoryData, setInventoryData] = useState([]);
  const navigate = useNavigate();
  const { translate } = useFasterTranslate();

  /**
   * State for translated labels.
   * @type {Object}
   */
  const [labels, setLabels] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Fetches translations for labels and updates the state.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Back',
          'Add New Inventory Item',
        ]);

        setLabels({
          back: translations[0],
          addNewItem: translations[1],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  /**
   * Navigates to the ManagerSelection page.
   * 
   * @returns {void}
   */
  const navigateToManagerSelection = () => {
    navigate('/managerselection');
  };

  /**
   * Navigates to the InventoryAdd page.
   * 
   * @returns {void}
   */
  const navigateToAdd = () => {
    navigate('/inventoryadd');
  };

  /**
   * Fetches inventory data from the backend API.
   * 
   * @returns {void}
   */
  const fetchInventoryData = async () => {
    try {
      const response = await axios.post(`${API_URL}/doInventoryLoad`);
      setInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className={`${styles.container}`}>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={navigateToManagerSelection}>
          {labels.back}
        </button>
        <button className={styles.button} onClick={navigateToAdd}>
          {labels.addNewItem}
        </button>
      </div>
      <div className={'inventory'}>
        {InventoryData.map((item, index) => (
          <InventoryItemSlice key={index} item={item} fetchInventoryData={fetchInventoryData} />
        ))}
      </div>
    </div>
  );
}

/**
 * InventoryItemSlice Component
 * 
 * This component represents an individual inventory item and provides options to 
 * edit or remove the item.
 * 
 * @component
 * @param {Object} props - The props for the component.
 * @param {Object} props.item - The inventory item details.
 * @param {Function} props.fetchInventoryData - The function to refresh inventory data.
 * @returns {JSX.Element} - The rendered inventory item slice.
 */
function InventoryItemSlice({ item, fetchInventoryData }) {
  const { inventory_id, name, quantity, quantity_type } = item;
  const navigate = useNavigate();
  const { translate } = useFasterTranslate();

  /**
   * State for translated labels.
   * @type {Object}
   */
  const [labels, setLabels] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Fetches translations for labels and updates the state.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Item',
          'Quantity',
          'Size',
          'Remove',
          'Edit',
          'Item removed successfully!',
          'Failed to remove item',
        ]);

        setLabels({
          item: translations[0],
          quantity: translations[1],
          size: translations[2],
          remove: translations[3],
          edit: translations[4],
          success: translations[5],
          failure: translations[6],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  /**
   * Navigates to the InventoryEdit page with the current item's details.
   * 
   * @returns {void}
   */
  const navigateToEdit = () => {
    navigate('/inventoryedit', {
      state: {
        inventory_id,
        name,
        quantity,
        quantity_type,
      },
    });
  };

  /**
   * Handles removing an inventory item by sending a request to the backend API.
   * 
   * @param {string} inventoryId - The ID of the inventory item to remove.
   * @returns {void}
   */
  const handleRemove = async (inventoryId) => {
    try {
      const response = await axios.post(`${API_URL}/removeInventoryItem`, { inventory_id: inventoryId });
      if (response.data.success) {
        alert(labels.success);
        fetchInventoryData();
      } else {
        alert(labels.failure);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert(labels.failure);
    }
  };

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className={'slice'}>
      <div className={'item'}>
        <strong>{labels.item}: </strong>
        {name}
      </div>
      <div className={'item'}>
        <strong>{labels.quantity}: </strong>
        {quantity}
      </div>
      <div className={'item'}>
        <strong>{labels.size}: </strong>
        {quantity_type}
      </div>
      <div>
        <button className={'button'} onClick={() => handleRemove(inventory_id)}>
          {labels.remove}
        </button>
      </div>
      <div>
        <button className={'button'} onClick={navigateToEdit}>
          {labels.edit}
        </button>
      </div>
    </div>
  );
}

export default InventoryPage;
