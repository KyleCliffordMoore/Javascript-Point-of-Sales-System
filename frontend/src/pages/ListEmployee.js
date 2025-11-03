/**
 * ListEmployee Component
 * 
 * This component manages the employee list, displaying the details of employees,
 * and providing functionality to add, edit, and fire employees. The component also
 * handles translation for static texts and allows navigation to other views like
 * adding an employee or selecting a manager.
 * 
 * Features:
 * - Display list of employees with details (name, email, position, hours, pay).
 * - Edit and fire employees.
 * - Translate static text labels.
 * - Handle fetch and removal of employee data from the backend API.
 * 
 * API Endpoints:
 * - `/api/doListEmployee` - Fetches the list of employees.
 * - `/api/fireEmployee` - Removes an employee from the list.
 * 
 * @example Usage Example:
 * <ListEmployee />
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';
import styles from '../styles/AllManager.module.css'; // Import the CSS module

const API_URL = '/api'; // Base URL for the backend

const ListEmployee = () => {
	const navigate = useNavigate();
	const { translate } = useFasterTranslate(); // Access faster translate function from context
	const [employees, setEmployees] = useState([]);
	const [translatedStrings, setTranslatedStrings] = useState({});
	const [loadingTranslations, setLoadingTranslations] = useState(true);

	/**
	 * Fetch translations for the static text used in the component.
	 */
	useEffect(() => {
		const translateStrings = async () => {
			try {
				const translations = await translate([
					'Employee List',
					'Add Employee',
					'Back',
					'Edit Employee',
					'Fire Employee',
					'Are you sure you want to fire this employee?',
					'No employees found.',
					'Name:',
					'Email:',
					'Position:',
					'Hours:',
					'Pay:',
				]);

				setTranslatedStrings({
					title: translations[0],
					addEmployeeButton: translations[1],
					backButton: translations[2],
					editButton: translations[3],
					fireButton: translations[4],
					confirmFire: translations[5],
					noEmployees: translations[6],
					nameLabel: translations[7],
					emailLabel: translations[8],
					positionLabel: translations[9],
					hoursLabel: translations[10],
					payLabel: translations[11],
				});
			} catch (error) {
				console.error('Error fetching translations:', error);
			} finally {
				setLoadingTranslations(false);
			}
		};

		translateStrings();
	}, [translate]);

	/**
	 * Fetches the list of employees from the backend API.
	 */
	useEffect(() => {
		fetchEmployees();
	}, []);

	/**
	 * Makes an API call to fetch employees from the backend.
	 * Updates the component state with the employee list.
	 */
	const fetchEmployees = async () => {
		try {
			const response = await fetch(`${API_URL}/doListEmployee`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			setEmployees(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching employees:", error);
			setEmployees([]);
		}
	};

	/**
	 * Removes an employee by making an API call to fire them.
	 * Upon successful removal, updates the employee list state to reflect the change.
	 *
	 * @param {number} employeeId - The ID of the employee to remove.
	 */
	const removeEmployee = async (employeeId) => {
		try {
			const response = await fetch(`${API_URL}/fireEmployee`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ employeeId }),
			});

			if (response.ok) {
				setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
			} else {
				console.error("Failed to remove employee");
			}
		} catch (error) {
			console.error("Error removing employee:", error);
		}
	};

	if (loadingTranslations) {
		return <div>Loading translations...</div>;
	}

	return (
		<div className={styles.container}>
			<h2>{translatedStrings.title}</h2>

			<div className={styles.buttonGroup}>
				<button 
					className={styles.button} 
					onClick={() => navigate("/addemployee")}
				>
					{translatedStrings.addEmployeeButton}
				</button>
				<button 
					className={styles.button} 
					onClick={() => navigate("/managerselection")}
				>
					{translatedStrings.backButton}
				</button>
			</div>

			<div 
				className="scrollable-container"
				style={{
					maxHeight: '400px',
					overflowY: 'auto',
					border: '1px solid #ccc',
					borderRadius: '8px',
				}}
			>
				{employees.length > 0 ? (
					employees.map((employee) => (
						<div
							key={employee.employee_id}
							className={styles['inventory-item']}
						>
							<div>
								<p><strong>{translatedStrings.nameLabel}</strong> {employee.name}</p>
								<p><strong>{translatedStrings.emailLabel}</strong> {employee.email}</p>
							</div>
							<div>
								<p><strong>{translatedStrings.positionLabel}</strong> {employee.position}</p>
								<p><strong>{translatedStrings.hoursLabel}</strong> {employee.hours}</p>
							</div>
							<div>
								<p><strong>{translatedStrings.payLabel}</strong> ${employee.pay}</p>
							</div>
							<div className={styles.buttonGroup}>
								<button
									className={styles.button}
									onClick={() =>
										navigate("/editemployee", {
											state: { employee }, // Pass employee data to the edit page
										})
									}
								>
									{translatedStrings.editButton}
								</button>
							</div>
							<div className={styles.buttonGroup}>
								<button
									className={styles.button}
									onClick={() => {
										if (window.confirm(translatedStrings.confirmFire)) {
											removeEmployee(employee.employee_id);
										}
									}}
								>
									{translatedStrings.fireButton}
								</button>
							</div>
						</div>
					))
				) : (
					<p>{translatedStrings.noEmployees}</p>
				)}
			</div>
		</div>
	);
};

export default ListEmployee;
