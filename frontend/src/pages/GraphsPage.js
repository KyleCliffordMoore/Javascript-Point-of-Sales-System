/**
 * GraphsPage.js
 *
 * This component provides a graphical representation of sales and ingredient usage data.
 * It enables managers to query the database based on a date range and view the results
 * in a histogram format. The results include items sold and their associated ingredients.
 *
 * Dependencies:
 * - React
 * - React Router for navigation
 * - TranslationContext for dynamic language support
 * - QueryDatabase (custom component for executing SQL queries)
 * - Histogram (custom component for rendering bar charts)
 * - CSS Module for styling
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';
import QueryDatabase from '../components/QueryDatabase';
import Histogram from '../components/Histogram';
import styles from '../styles/AllManager.module.css';

const API_URL = '/api'; // Base URL for the backend

/**
 * Component: GraphsPage
 * 
 * Displays a form for querying sales data by date range, processes the results,
 * and visualizes ingredient usage through a histogram.
 *
 * @returns {JSX.Element} The rendered GraphsPage component.
 */
function GraphsPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [query, setQuery] = useState(null);
    const [combinedResults, setCombinedResults] = useState({}); // Combined results for items
    const [ingredientResults, setIngredientResults] = useState({}); // Combined results for ingredients
    const [translatedLabels, setTranslatedLabels] = useState([]);
    const [translatedAmounts, setTranslatedAmounts] = useState([]);
    const [translatedStartDateLabel, setTranslatedStartDateLabel] = useState('');
    const [translatedEndDateLabel, setTranslatedEndDateLabel] = useState('');
    const [translatedLookupButton, setTranslatedLookupButton] = useState('');
    const [translatedBackButton, setTranslatedBackButton] = useState('');

    const { translate } = useTranslate();
    const navigate = useNavigate();

    /**
     * Load translations for static UI labels.
     */
    useEffect(() => {
        const translateStaticTexts = async () => {
            setTranslatedStartDateLabel(await translate('Start Date:'));
            setTranslatedEndDateLabel(await translate('End Date:'));
            setTranslatedLookupButton(await translate('Lookup'));
            setTranslatedBackButton(await translate('Back'));
        };

        translateStaticTexts();
    }, [translate]);

    /**
     * Navigate back to the manager selection page.
     */
    const navigateToManagerSelection = () => {
        navigate('/managerselection');
    };

    const handleLookup = () => {
        const combinedQuery = `
SELECT di.name AS item_name, COUNT(*) as amount
FROM appetizer_item di
JOIN line_item li ON di.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND di.name IS NOT NULL AND di.name <> ''
GROUP BY di.name

UNION ALL

SELECT di.name AS item_name, COUNT(*) as amount
FROM drink_item di
JOIN line_item li ON di.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND di.name IS NOT NULL AND di.name <> ''
GROUP BY di.name

UNION ALL

SELECT mi.meat1 AS item_name, COUNT(*) as amount
FROM meal_item mi
JOIN line_item li ON mi.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND mi.meat1 IS NOT NULL AND mi.meat1 <> ''
GROUP BY mi.meat1

UNION ALL

SELECT mi.meat2 AS item_name, COUNT(*) as amount
FROM meal_item mi
JOIN line_item li ON mi.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND mi.meat2 IS NOT NULL AND mi.meat2 <> ''
GROUP BY mi.meat2

UNION ALL

SELECT mi.meat3 AS item_name, COUNT(*) as amount
FROM meal_item mi
JOIN line_item li ON mi.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND mi.meat3 IS NOT NULL AND mi.meat3 <> ''
GROUP BY mi.meat3

UNION ALL

SELECT mi.side AS item_name, COUNT(*) as amount
FROM meal_item mi
JOIN line_item li ON mi.line_item_id = li.line_item_id
JOIN receipt r ON li.receipt_id = r.receipt_id
WHERE r.date BETWEEN '${startDate}' AND '${endDate}' AND mi.side IS NOT NULL AND mi.side <> ''
GROUP BY mi.side;
        `;

        setQuery(combinedQuery);
    };

    /**
     * Handle the results of the database query by processing item data.
     *
     * @param {Array} result - Array of query result objects with item names and amounts.
     */
    const handleQueryResult = async (result) => {
        if (result && result.length > 0) {
            const combinedMap = {};
            result.forEach(item => {
                const itemName = item.item_name;
                const amount = item.amount;
                combinedMap[itemName] = amount;
            });

            setCombinedResults(combinedMap);
            fetchIngredients(combinedMap);
        } else {
            alert(await translate("No results found!"));
        }
        setQuery(null);
    };



    /**
     * Fetch ingredient usage data for items and translate the results.
     *
     * @param {Object} items - Map of item names to their sold amounts.
     */
    const fetchIngredients = async (items) => {
        const ingredientMap = {};
        const itemNames = Object.keys(items).map(item => item.replace(/'/g, ""))
            .map(item => `'${item}'`).join(", ");
        const ingredientQuery = `
SELECT i.name AS ingredient_name, i.quantity, r.name AS item_name
FROM ingredient i
JOIN recipe_ingredient ri ON i.ingredient_id = ri.ingredient_id
JOIN menu r ON ri.recipe_id = r.menu_id
WHERE r.name IN (${itemNames});
        `;

        try {
            const response = await fetch(`${API_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: ingredientQuery }),
            });

            const data = await response.json();

            data.forEach(ingredient => {
                const ingredientName = ingredient.ingredient_name;
                const ingredientQuantity = parseFloat(ingredient.quantity);
                const itemAmount = items[ingredient.item_name] || 0;
                ingredientMap[ingredientName] = (ingredientMap[ingredientName] || 0) + (itemAmount * ingredientQuantity);
            });

            const translatedIngredientMap = {};
            for (const [key, value] of Object.entries(ingredientMap)) {
                translatedIngredientMap[await translate(key)] = value;
            }

            setIngredientResults(translatedIngredientMap);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const labels = Object.keys(ingredientResults);
    const amounts = Object.values(ingredientResults);

    /**
     * Translate histogram labels and prepare data for rendering.
     */
    useEffect(() => {
        const translateHistogramLabels = async () => {
            const translated = await Promise.all(labels.map(label => translate(label)));
            setTranslatedLabels(translated);
            setTranslatedAmounts(amounts);
        };

        if (labels.length > 0) {
            translateHistogramLabels();
        }
    }, [labels, amounts, translate]);

    return (
        <div className={styles.container}>
            <h4 className={styles.header}>Graph Page</h4>
    
            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    {translatedStartDateLabel}
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    {translatedEndDateLabel}
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className={styles.input}
                    />
                </label>
            </div>
    
            <div className={styles.buttonGroup}>
                <button onClick={handleLookup} className={styles.button}>
                    {translatedLookupButton}
                </button>
                <button onClick={navigateToManagerSelection} className={styles.button}>
                    {translatedBackButton}
                </button>
            </div>
    
            {query && <QueryDatabase query={query} onResult={handleQueryResult} />}
    
            {translatedLabels.length > 0 && translatedAmounts.length > 0 && (
                <div className={styles.histogramContainer}>
                    <Histogram labels={translatedLabels} amounts={translatedAmounts} />
                </div>
            )}
        </div>
    );
}    

export default GraphsPage;
