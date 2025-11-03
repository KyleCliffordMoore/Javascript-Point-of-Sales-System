/**
 * ReceiptView Component
 * 
 * This component displays the details of a single receipt. It fetches the receipt data from the backend based on the `receipt_id` passed via the location state.
 * The receipt details include the receipt ID, date, total amount, status, and a list of line items.
 * It also provides an option to go back to the Receipt Page.
 * 
 * Features:
 * - Fetches and displays a specific receipt's details, including line items.
 * - Displays receipt information such as ID, date, total amount, and status.
 * - Provides a back button to navigate back to the Receipt Page.
 * - Generates a description for each line item based on its type (Meal, Appetizer, Drink).
 * 
 * API Endpoints:
 * - `GET /api/receipts/{receipt_id}` - Fetches a specific receipt by its ID.
 * 
 * @component
 * @example
 * // Example usage
 * <ReceiptView />
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = '/api';

/**
 * The ReceiptView component displays the details of a single receipt,
 * including receipt ID, date, total amount, status, and line items.
 * 
 * @returns {JSX.Element} - The rendered ReceiptView component with receipt details.
 */
function ReceiptView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receipt_id } = location.state || {};
  const [receipt, setReceipt] = useState(null);

  /**
   * Fetches receipt data from the backend using the receipt ID.
   * Sets the receipt state with the fetched data.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(`${API_URL}/receipts/${receipt_id}`);
        setReceipt(response.data);
      } catch (error) {
        console.error('Error fetching receipt:', error);
      }
    };

    fetchReceipt();
  }, [receipt_id]);

  /**
   * Navigates back to the ReceiptPage.
   * 
   * @returns {void}
   */
  const navigateBack = () => {
    navigate('/receiptpage');
  };

  /**
   * Generates a description for an item in the receipt line items.
   * 
   * @param {Object} item - The line item object from the receipt.
   * @returns {string} - The generated description for the item.
   */
  const getItemDescription = (item) => {
    switch (item.type) {
      case 'Meal':
        return `Meal with ${item.meats.join(', ')} and ${item.side}`;
      case 'Appetizer':
        return `Appetizer: ${item.name}`;
      case 'Drink':
        return `${item.name}`;
      default:
        return `Unknown item (Line Item ID: ${item.line_item_id})`;
    }
  };

  if (!receipt) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: '20px',
        color: 'Black',
        backgroundColor: 'White',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
      }}
    >
      <button onClick={navigateBack}>Back</button>
      <h2 style={{ color: 'black', }}>Receipt Details</h2>
      <div>
        <strong>Receipt ID:</strong> {receipt.receipt_id}
      </div>
      <div>
        <strong>Date:</strong> {new Date(receipt.date).toLocaleString()}
      </div>
      <div>
        <strong>Total Amount:</strong> ${parseFloat(receipt.totalamount).toFixed(2)}
      </div>
      <div>
        <strong>Status:</strong> {receipt.status}
      </div>
      <h3>Line Items:</h3>
      {receipt.line_items && receipt.line_items.length > 0 ? (
        <ul>
          {receipt.line_items.map((item) => (
            <li key={item.line_item_id}>
              {getItemDescription(item)} - ${parseFloat(item.price).toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No line items found.</p>
      )}
    </div>
  );
}

export default ReceiptView;
