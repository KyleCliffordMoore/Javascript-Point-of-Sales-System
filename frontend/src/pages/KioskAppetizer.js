/**
 * KioskAppetizer Component
 * 
 * This component represents the appetizers page on the kiosk. It fetches a list of appetizers 
 * from the backend and displays them with their names, prices, and images. Users can click on 
 * an appetizer to add it to their order. The order is displayed in a sidebar component.
 * 
 * Features:
 * - Fetches a list of appetizers from the backend.
 * - Displays appetizers with name, image, and price.
 * - Allows users to add appetizers to their order by clicking on them.
 * - Displays the current order in a sidebar.
 * 
 * API Endpoints:
 * - `/api/getAppetizers` - Fetches a list of appetizers from the backend.
 * 
 * @example
 * <KioskAppetizer />
 */

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchAppetizers } from '../services/KioskAppetizerAPI';
import '../styles/Kiosk.css';

/**
 * KioskAppetizer Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered page showing appetizers and the order sidebar.
 */
function KioskAppetizer() {
  // State for storing the list of fetched appetizers
  /**
   * The state for storing the list of appetizers fetched from the backend.
   * @type {Array<Object>}
   */
  const [items, setItems] = useState([]);

  // State for storing the current order
  /**
   * The state for storing the current order, which is an array of items.
   * @type {Array<Object>}
   */
  const [order, setOrder] = useState([]);

  /**
   * Fetches the appetizers when the component mounts and updates the `items` state.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const fetchData = async () => {
      const appetizers = await fetchAppetizers();
      setItems(appetizers);
    };
    fetchData();
  }, []);

  /**
   * Adds an appetizer item to the current order.
   * 
   * @param {Object} item - The appetizer item to add to the order.
   * @returns {void} - Updates the `order` state by adding the new item.
   */
  const addToOrder = (item) => {
    setOrder([...order, item]);
  };

  return (
    <div className="page-container">
      <div className="items-container">
        {items.map((item) => (
          <div key={item.id} className="item-card" onClick={() => addToOrder(item)}>
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <Sidebar order={order} />
    </div>
  );
}

export default KioskAppetizer;
