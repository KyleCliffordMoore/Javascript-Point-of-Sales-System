/**
 * ManagerSelection Component
 * 
 * This component represents the manager selection page in the Panda Express POS system. 
 * It provides the manager with a variety of options to navigate to different sections, 
 * such as reports, inventory, employee lists, menu management, and more. The UI labels 
 * for buttons are dynamically translated based on the selected language.
 * 
 * Features:
 * - Displays buttons for navigating to various manager functionalities (graphs, inventory, reports, etc.).
 * - Supports dynamic translation of button labels and page titles based on the user's language.
 * - Navigates to different pages for managing items, viewing reports, and more.
 * 
 * API Endpoints:
 * - None directly in this component, but navigation occurs to other pages like `/graphspage`, `/inventorypage`, etc.
 * 
 * @example
 * <ManagerSelection />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManagerOrEmployee.css'; // Reuse the same CSS file for consistency
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

/**
 * ManagerSelection Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered manager selection page.
 */
function ManagerSelection() {
  const navigate = useNavigate();
  const { translate } = useFasterTranslate();

  // State to store translated text for UI elements
  const [translatedText, setTranslatedText] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  /**
   * Fetch translations for static text labels when the component mounts.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Manager Selection Page',
          'Graphs',
          'Inventory',
          'Sales Report',
          'X & Z Reports',
          'Restock Report',
          'List Employees',
          'Menu Items',
          'Menu',
          'Receipts',
          'Back',
          'Item Popularity',
          'Excess Report',
        ]);

        setTranslatedText({
          managerSelectionTitle: translations[0],
          graphsButton: translations[1],
          inventoryButton: translations[2],
          salesReportButton: translations[3],
          xorZReportButton: translations[4],
          restockReportButton: translations[5],
          listEmployeesButton: translations[6],
          ItemButton: translations[7],
          menuButton: translations[8],
          ReceiptButton: translations[9],
          backButton: translations[10],
          itemPopularityButton: translations[11],
          excessReportButton: translations[12],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  // Navigation functions
  const navigateToGraphsPage = () => navigate('/graphspage');
  const navigateToInventoryPage = () => navigate('/inventorypage');
  const navigateToSalesReportPage = () => navigate('/salesreportpage');
  const navigateToXorZReportPage = () => navigate('/xzreportpage');
  const navigateToRestockReportPage = () => navigate('/restockreportpage');
  const navigateToListEmployeePage = () => navigate('/listemployee');
  const navigateToEmployeeOrManagerPage = () =>
    navigate('/manageroremployee', { state: { position: 'Manager' } });
  const navigateToItemPage = () => navigate('/itempage');
  const navigateToReceiptPage = () => navigate('/receiptpage');
  const navigateToExcessReportPage = () => navigate('/excessreport');
  const navigateToItemPopularityPage = () => navigate('/itempopularity');

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="manager-employee-container">
      <div className="content-box">
        <h3>{translatedText.managerSelectionTitle}</h3>
        <button onClick={navigateToGraphsPage}>
          {translatedText.graphsButton}
        </button>
        <button onClick={navigateToInventoryPage}>
          {translatedText.inventoryButton}
        </button>
        <button onClick={navigateToSalesReportPage}>
          {translatedText.salesReportButton}
        </button>
        <button onClick={navigateToXorZReportPage}>
          {translatedText.xorZReportButton}
        </button>
        <button onClick={navigateToRestockReportPage}>
          {translatedText.restockReportButton}
        </button>
        <button onClick={navigateToListEmployeePage}>
          {translatedText.listEmployeesButton}
        </button>
        <button onClick={navigateToItemPage}>
          {translatedText.ItemButton}
        </button>
        <button onClick={navigateToReceiptPage}>
          {translatedText.ReceiptButton}
        </button>
        <button onClick={navigateToExcessReportPage}>
          {translatedText.excessReportButton}
        </button>
        <button onClick={navigateToItemPopularityPage}>
          {translatedText.itemPopularityButton}
        </button>
        <button onClick={navigateToEmployeeOrManagerPage}>
          {translatedText.backButton}
        </button>
      </div>
    </div>
  );
}

export default ManagerSelection;
