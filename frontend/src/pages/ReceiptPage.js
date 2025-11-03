/**
 * ReceiptPage Component
 * 
 * This component handles the display of all receipts, including searching for specific receipts by ID.
 * It fetches the list of receipts from the backend and displays them in a list. Each receipt can be viewed, edited, or deleted.
 * The page supports pagination for the receipt list and includes a search bar to filter by receipt ID.
 * 
 * Features:
 * - Fetches and displays all receipts with pagination.
 * - Allows searching for receipts by ID.
 * - Displays the receipt details including ID, date, total amount, and status.
 * - Provides options to view, edit, or delete a receipt.
 * - Displays appropriate success/error messages when deleting a receipt.
 * - Uses a translation context to handle multilingual support.
 * 
 * API Endpoints:
 * - `GET /api/receipts?page={page}&limit={limit}` - Fetches a list of receipts with pagination.
 * - `GET /api/receipts/{receipt_id}` - Fetches a specific receipt by its ID.
 * - `DELETE /api/receipts/{receipt_id}` - Deletes a specific receipt by its ID.
 * 
 * @component
 * @example
 * // Example usage
 * <ReceiptPage />
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFasterTranslate } from '../contexts/FasterTranslationContext'; // Import the translation context

const API_URL = '/api'; // Base URL for the backend

/**
 * The ReceiptPage component displays all receipts, allows searching for receipts by ID,
 * and provides actions to view, edit, or delete a receipt.
 * 
 * @returns {JSX.Element} - The rendered ReceiptPage component.
 */
function ReceiptPage() {
  const [receipts, setReceipts] = useState([]); // State to store the list of receipts
  const [searchId, setSearchId] = useState(''); // State to store the search query
  const navigate = useNavigate(); // Hook for navigation
  const { translate } = useFasterTranslate(); // Use the translate function from context

  const [translatedText, setTranslatedText] = useState({}); // State for translated strings
  const [loadingTranslations, setLoadingTranslations] = useState(true); // State for loading translations

  /**
   * Loads translations for the UI elements on the page.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Back',
          'Receipt Management',
          'Search by Receipt ID',
          'Search',
          'No receipts found.',
          'Receipt ID:',
          'Date:',
          'Total Amount:',
          'Status:',
          'View',
          'Edit',
          'Delete',
          'Are you sure you want to delete this receipt?',
          'Receipt deleted successfully!',
          'Failed to delete receipt',
        ]);

        setTranslatedText({
          backButton: translations[0],
          receiptManagementTitle: translations[1],
          searchPlaceholder: translations[2],
          searchButton: translations[3],
          noReceiptsMessage: translations[4],
          receiptIDLabel: translations[5],
          dateLabel: translations[6],
          totalAmountLabel: translations[7],
          statusLabel: translations[8],
          viewButton: translations[9],
          editButton: translations[10],
          deleteButton: translations[11],
          deleteConfirmMessage: translations[12],
          deleteSuccessMessage: translations[13],
          deleteFailureMessage: translations[14],
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
   * Fetches receipts from the backend API with pagination.
   * 
   * @param {number} page - The current page number for pagination.
   * @param {number} limit - The number of items to display per page.
   * @returns {void}
   */
  const fetchReceipts = async (page = 1, limit = 50) => {
    try {
      const response = await axios.get(`${API_URL}/receipts?page=${page}&limit=${limit}`);
      setReceipts(response.data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  /**
   * Handles the search functionality by receipt ID.
   * 
   * @param {React.FormEvent} e - The form submission event.
   * @returns {void}
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      fetchReceipts();
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/receipts/${searchId}`);
      setReceipts(response.data ? [response.data] : []);
    } catch (error) {
      console.error('Error searching for receipt:', error);
      setReceipts([]);
    }
  };

  /**
   * Navigates back to the Manager Selection page.
   * 
   * @returns {void}
   */
  const navigateBack = () => {
    navigate('/managerselection');
  };

  // If translations are still loading, show a loading message
  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
      <div>
        <button style={{ width: '100%' }} onClick={navigateBack}>
          {translatedText.backButton}
        </button>
      </div>
      <h2>{translatedText.receiptManagementTitle}</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder={translatedText.searchPlaceholder}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', width: '18%', marginLeft: '2%' }}>
          {translatedText.searchButton}
        </button>
      </form>
      {receipts.length > 0 ? (
        receipts.map((receipt) => (
          <ReceiptSlice
            key={receipt.receipt_id}
            receipt={receipt}
            fetchReceipts={fetchReceipts}
            translatedText={translatedText} // Pass translations as props
          />
        ))
      ) : (
        <p>{translatedText.noReceiptsMessage}</p>
      )}
    </div>
  );
}

/**
 * ReceiptSlice Component
 * 
 * This component is used to display a single receipt's details in the ReceiptPage. 
 * It provides actions to view, edit, and delete the receipt.
 * 
 * Features:
 * - Displays receipt information such as ID, date, total amount, and status.
 * - Provides options to view, edit, or delete a receipt.
 * 
 * @component
 * @example
 * // Example usage
 * <ReceiptSlice receipt={receipt} fetchReceipts={fetchReceipts} translatedText={translatedText} />
 * 
 * @param {Object} receipt - The receipt data to display.
 * @param {Function} fetchReceipts - The function to refresh the list of receipts after deletion.
 * @param {Object} translatedText - The translations for various UI elements.
 */
function ReceiptSlice({ receipt, fetchReceipts, translatedText }) {
  const navigate = useNavigate();

  const navigateToView = () => {
    navigate('/receiptview', { state: { receipt_id: receipt.receipt_id } });
  };

  const navigateToEdit = () => {
    navigate('/receiptedit', { state: { receipt_id: receipt.receipt_id } });
  };

  /**
   * Handles receipt deletion. Confirms with the user before making the deletion request.
   * 
   * @returns {void}
   */
  const handleDelete = async () => {
    if (!window.confirm(translatedText.deleteConfirmMessage)) return;

    try {
      const response = await axios.delete(`${API_URL}/receipts/${receipt.receipt_id}`);
      if (response.data.success) {
        alert(translatedText.deleteSuccessMessage);
        fetchReceipts();
      } else {
        alert(translatedText.deleteFailureMessage);
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert(translatedText.deleteFailureMessage);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'whitesmoke',
        padding: '10px',
        border: '1px solid black',
        marginTop: '10px',
      }}
    >
      <div>
        <strong>{translatedText.receiptIDLabel}</strong> {receipt.receipt_id}
      </div>
      <div>
        <strong>{translatedText.dateLabel}</strong>{' '}
        {new Date(receipt.date).toLocaleString()}
      </div>
      <div>
        <strong>{translatedText.totalAmountLabel}</strong> $
        {parseFloat(receipt.totalamount).toFixed(2)}
      </div>
      <div>
        <strong>{translatedText.statusLabel}</strong> {receipt.status}
      </div>
      <button onClick={navigateToView}>
        {translatedText.viewButton}
      </button>
      <button onClick={navigateToEdit}>
        {translatedText.editButton}
      </button>
      <button
        onClick={handleDelete}
        style={{ backgroundColor: '#d32f2f', color: 'white' }}
      >
        {translatedText.deleteButton}
      </button>
    </div>
  );
}

export default ReceiptPage;
