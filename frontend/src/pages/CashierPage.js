/**
 * CashierPage Component
 * 
 * This component provides the interface for the cashier to process orders.
 * It includes sections for selecting meals, sides, entrees, drinks, and appetizers.
 * The selected items are added to the order, and the total price is calculated dynamically.
 * 
 * Features:
 * - Fetches menu items (meals, sides, entrees, drinks, appetizers) from the backend.
 * - Allows selecting and customizing meals with sides and entrees.
 * - Displays the current order and total price.
 * - Includes functionality to adjust item quantities and reset the order.
 * - Supports navigating back to the previous page.
 * 
 * API Endpoints:
 * - `fetchMenuItems` - Retrieves menu items by type (meal, side, entree, etc.).
 * 
 * @component
 * @returns {JSX.Element} The rendered CashierPage component.
 */

import React, { useState, useEffect } from 'react';
import MealButton from '../components/MealButton';
import SideButton from '../components/SideButton';
import EntreeButton from '../components/EntreeButton';
import DrinkAndAppetizerButton from '../components/DrinkAndAppetizerButton';
import CashierLabel from '../components/CashierLabel';
import OrderDisplay from '../components/OrderDisplay';
import CheckoutButton from '../components/CheckoutButton';
import { fetchMenuItems } from '../services/CashierPageAPI';
import styles from '../styles/CashierPage.module.css';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

/**
 * The main component for the cashier interface.
 */
const CashierPage = () => {
  const { translate } = useFasterTranslate();
  const [translatedText, setTranslatedText] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  // State variables for menu items
  const [meals, setMeals] = useState([]);
  const [sides, setSides] = useState([]);
  const [entrees, setEntrees] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [appetizers, setAppetizers] = useState([]);

  // State variables for selection
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedEntrees, setSelectedEntrees] = useState([]);
  const [maxEntreesAllowed, setMaxEntreesAllowed] = useState(0);

  // State variables for the order
  const [orderList, setOrderList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);

  /**
   * Fetches translations for all labels used in the component.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Meals',
          'Sides',
          'Entrees',
          'Drinks',
          'Appetizers',
          'Complete Meal',
          'Back',
          'Total',
          'Please select a meal first.',
          'Please complete your meal selection.',
          'You can only select',
        ]);
        setTranslatedText({
          mealsLabel: translations[0],
          sidesLabel: translations[1],
          entreesLabel: translations[2],
          drinksLabel: translations[3],
          appetizersLabel: translations[4],
          completeMealButton: translations[5],
          backButton: translations[6],
          totalLabel: translations[7],
          selectMealFirstAlert: translations[8],
          completeMealSelectionAlert: translations[9],
          maxEntreesAlert: translations[10],
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
   * Fetches menu items on component mount.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const fetchData = async () => {
      const mealsData = await fetchMenuItems('meal');
      setMeals(mealsData);
      setSides(await fetchMenuItems('side'));
      setEntrees(await fetchMenuItems('entree'));
      setDrinks(await fetchMenuItems('drink'));
      setAppetizers(await fetchMenuItems('appetizer'));
    };

    fetchData();
  }, []);

  /**
   * Handles the selection of a meal and updates the related state.
   * 
   * @param {Object} meal - The selected meal object.
   * @returns {void}
   */
  const handleMealSelection = (meal) => {
    if (selectedMeal && selectedMeal.menu_id === meal.menu_id) {
      setSelectedMeal(null);
      setSelectedSide(null);
      setMaxEntreesAllowed(0);
      setSelectedEntrees([]);
    } else {
      setSelectedMeal(meal);
      setSelectedSide(null);
      setSelectedEntrees([]);
      switch (meal.name) {
        case 'Bowl':
          setMaxEntreesAllowed(1);
          break;
        case 'Plate':
          setMaxEntreesAllowed(2);
          break;
        case 'Bigger Plate':
          setMaxEntreesAllowed(3);
          break;
        default:
          setMaxEntreesAllowed(0);
      }
    }
  };

  /**
   * Handles the selection of a side dish.
   * 
   * @param {Object} side - The selected side dish object.
   * @returns {void}
   */
  const handleSideSelection = (side) => {
    if (!selectedMeal) {
      alert(translatedText.selectMealFirstAlert);
      return;
    }
    if (selectedSide && selectedSide.menu_id === side.menu_id) {
      setSelectedSide(null);
    } else {
      setSelectedSide(side);
    }
  };

  /**
   * Handles the selection or deselection of an entree.
   * 
   * @param {Object} entree - The selected entree object.
   * @returns {void}
   */
  const handleEntreeSelection = (entree) => {
    const existingEntree = selectedEntrees.find((e) => e.menu_id === entree.menu_id);
    const totalEntrees = selectedEntrees.reduce((sum, e) => sum + e.count, 0);

    if (existingEntree) {
      if (existingEntree.count < maxEntreesAllowed && totalEntrees < maxEntreesAllowed) {
        setSelectedEntrees(
          selectedEntrees.map((e) =>
            e.menu_id === entree.menu_id ? { ...e, count: e.count + 1 } : e
          )
        );
      } else if (existingEntree.count > 1) {
        setSelectedEntrees(
          selectedEntrees.map((e) =>
            e.menu_id === entree.menu_id ? { ...e, count: e.count - 1 } : e
          )
        );
      } else {
        setSelectedEntrees(selectedEntrees.filter((e) => e.menu_id !== entree.menu_id));
      }
    } else if (totalEntrees < maxEntreesAllowed) {
      setSelectedEntrees([...selectedEntrees, { ...entree, count: 1 }]);
    } else {
      alert(`${translatedText.maxEntreesAlert} ${maxEntreesAllowed} entrees.`);
    }
  };

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className={styles['cashier-page']}>
      <div className={styles['menu-section']}>
        <CashierLabel text={translatedText.mealsLabel} />
        <div className='button-grid'>
          {meals.map((meal) => (
            <MealButton
              key={meal.menu_id}
              meal={meal}
              isSelected={selectedMeal && selectedMeal.menu_id === meal.menu_id}
              onClick={handleMealSelection}
            />
          ))}
        </div>

        <CashierLabel text={translatedText.sidesLabel} />
        <div className='button-grid'>
          {sides.map((side) => (
            <SideButton
              key={side.menu_id}
              side={side}
              isSelected={selectedSide && selectedSide.menu_id === side.menu_id}
              onClick={handleSideSelection}
            />
          ))}
        </div>

        <CashierLabel text={`${translatedText.entreesLabel} (Select ${maxEntreesAllowed})`} />
        <div className='button-grid'>
          {entrees.map((entree) => (
            <EntreeButton
              key={entree.menu_id}
              entree={entree}
              isSelected={selectedEntrees.find((e) => e.menu_id === entree.menu_id)}
              count={selectedEntrees.find((e) => e.menu_id === entree.menu_id)?.count || 0}
              onClick={handleEntreeSelection}
            />
          ))}
        </div>

        <div className='button-grid'>
          <button className={styles['button']}>
            {translatedText.completeMealButton}
          </button>
        </div>

        <CashierLabel text={translatedText.drinksLabel} />
        <div className='button-grid'>
          {drinks.map((drink) => (
            <DrinkAndAppetizerButton key={drink.menu_id} item={drink} />
          ))}
        </div>

        <CashierLabel text={translatedText.appetizersLabel} />
        <div className='button-grid'>
          {appetizers.map((appetizer) => (
            <DrinkAndAppetizerButton key={appetizer.menu_id} item={appetizer} />
          ))}
        </div>

        <div className='button-grid'>
          <button className={styles['button']} onClick={() => window.history.back()}>
            {translatedText.backButton}
          </button>
        </div>
      </div>

      <div className={styles['order-section']}>
        <OrderDisplay orderList={orderList} />
        <div className={styles['checkout-container']}>
          <span className={styles['total-price']}>
            {translatedText.totalLabel}: ${totalPrice.toFixed(2)}
          </span>
          <CheckoutButton orderList={orderList} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
};

export default CashierPage;
