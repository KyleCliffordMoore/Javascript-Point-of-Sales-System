/**
 * ItemCountPage Component
 * 
 * This component allows users to generate a report of item counts between a given 
 * start and end date & time. It fetches the item count data from the backend API, 
 * displays the results in a table format, and handles errors or invalid input.
 * 
 * Features:
 * - Input fields for start and end date/time to specify the report period.
 * - Fetches item counts by querying the backend based on user input.
 * - Displays the counts and their percentages in a table format.
 * - Handles errors related to invalid input or API failure.
 * - Supports translation for UI labels to adapt to different languages.
 * 
 * API Endpoints:
 * - `/api/getItemCounts` - Fetches the count of items sold within the specified period.
 * 
 * @component
 * @example
 * // Usage Example:
 * <ItemCountPage />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Adjust the import path as needed
import styles from '../styles/AllManager.module.css';

const API_URL = '/api';

/**
 * Function to fetch the item counts from the backend.
 * 
 * @param {string} startTime - The start date & time for the report.
 * @param {string} endTime - The end date & time for the report.
 * @returns {Object} - The item count data or an error message if the fetch fails.
 */
async function getItemCounts(startTime, endTime) {
	try {
		const response = await fetch(`${API_URL}/getSoldItemCount`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ startTime, endTime }),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch item counts.');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}

/**
 * The main component that displays the item count form, handles fetching, and 
 * displays the data or error messages.
 * 
 * @component
 */
const ItemCountPage = () => {
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [itemCounts, setItemCounts] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState(null);
	const { translate } = useTranslate();
	const navigate = useNavigate();

	const [labels, setLabels] = useState({
		startDateTime: 'Start Date & Time',
		endDateTime: 'End Date & Time',
		generateReport: 'Generate Report',
		item: 'Item',
		count: 'Count',
		percentage: 'Percentage (%)',
		back: 'Back',
		errorFetching: 'Failed to fetch item counts.',
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
				percentage: await translate('Percentage (%)'),
				back: await translate('Back'),
				errorFetching: await translate('Failed to fetch item counts.'),
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
	 * Handles fetching item counts when the "Generate Report" button is clicked.
	 */
	const handleGenerateReport = async () => {
		if (!startTime || !endTime) {
		  alert(labels.errorInvalidDates);
		  return;
		}
	  
		const result = await getItemCounts(startTime, endTime);
	  
		if (result.error) {
		  setError(labels.errorFetching);
		} else {
		  // Check the structure of the fetched result
		  console.log("Fetched result:", result);  // Debugging
	  
		  // Calculate total count
		  const total = result.reduce((sum, item) => sum + Number(item.count), 0);
		  console.log("Total count:", total);  // Debugging
	  
		  // Add percentage to each item
		  const updatedItemCounts = result.map((item) => {
			const count = Number(item.count); // Ensure `count` is a number
			const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;
			console.log(`Item: ${item.item}, Count: ${count}, Percentage: ${percentage}%`); // Debugging
			return { ...item, percentage };
		  });
	  
		  setItemCounts(updatedItemCounts);
		  setTotalCount(total);
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
						<th>{labels.percentage}</th>
					</tr>
				</thead>
				<tbody>
					{itemCounts.map((row, index) => (
						<tr key={index}>
							<td>{row.item}</td>
							<td>{row.count}</td>
							<td>{row.percentage}%</td>
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

export default ItemCountPage;
