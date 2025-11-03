/**
 * @file index.js
 * @description File that holds all the routes for our backend API
 * 
 * @requires jwt-decode Library to decode Google sign-in authentication keys
 * @requires express - Web framework for building the backend server.
 * @requires nodemailer Library to send emails to users through javascript
 * @requires axios HTTP client for NodeJS used to access Google's Translation API
 * @requires pg Library used to access and query a PostgreSQL database server
 */

const express = require("express");
const { jwtDecode } = require('jwt-decode');
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const axios = require('axios');

const router = express.Router();

//zkcs zxlc awef tima

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT || 5432,
});


/**
 * Helper function to run queries on the PostgreSQL database server.
 * 
 * @param {String} queryText The query to be run as a string
 * @param {Array=} queryParams String interpolation parameters to be input into the query string, given as an array
 * @returns {Object} Boolean for if the query was successful and if so the result of the query, otherwise an error message
 */
async function runQuery(queryText, queryParams = []) {
	try {
		const result = await pool.query(queryText, queryParams);
		return { success: true, rows: result.rows, rowCount: result.rowCount };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

/**
 * Handles POST requests to fetch all side items on the menu from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doQuerySide", async (req, res) => {
	const query = "SELECT * FROM menu WHERE item_type = 'side';";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});


/**
 * Handles POST requests to fetch all entree items on the menu from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doQueryEntree", async (req, res) => {
	const query = "SELECT * FROM menu WHERE item_type = 'entree';";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});


/**
 * Handles POST requests to fetch all ingredients that need to be restocked from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doRestockQuery", async (req, res) => {
	const query = "SELECT * FROM inventory WHERE restock_level = 0;";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});


/**
 * Handles POST requests to fetch all meal items on the menu from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doQueryMealItems", async (req, res) => {
	const query = "SELECT * FROM menu WHERE item_type = 'meal';";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});


/**
 * Handles POST requests to fetch all appetizer items on the menu from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doQueryAppItems", async (req, res) => {
	const query = "SELECT * FROM menu WHERE item_type = 'appetizer';";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});

/**
 * Handles POST requests to fetch all drink sizes on the menu from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query
 */
router.post("/doQueryDrinkItems", async (req, res) => {
	const query = "SELECT * FROM menu WHERE item_type = 'drink';";
	const result = await runQuery(query);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});

/**
 * Handles POST requests to modify an existing employee's information in the database and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} employeeId ID of employee intended to be updated
 * @param {String} name The employee's new name
 * @param {String} email The employee's new email
 * @param {String} position The employee's new position
 * @param {Number} hours The employee's new weekly hours
 * @param {String} password The employee's new password
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/doEditEmployee", async (req, res) => {
	const { employeeId, name, email, position, hours, pay, password } = req.body;

	// console.log(req.body);

	// Construct the update query
	const updateQuery = `
		UPDATE employee
		SET name = $1, email = $2, position = $3, hours = $4, pay = $5, password = $6
		WHERE employee_id = $7;
	`;

	const result = await runQuery(updateQuery, [name, email, position, hours, pay, password, employeeId]);

	if (result.success) {
		res.json({ success: true, message: "Employee updated successfully!" });
	} else {
		res.status(500).json({ success: false, error: result.error || "Failed to update employee" });
	}
});

/**
 * Handles POST requests to fetch employee information from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Result of the query.
 */
router.post("/doListEmployee", async (req, res) => {

	const employeeLQuery = `SELECT * FROM employee WHERE position != 'Fired';`;
	const result = await runQuery(employeeLQuery);

	// console.log("Query Result:", result);

	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}

});

/**
 * Handles POST requests to add a new employee's information in the database and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number=} id ID of employee intended to be added, if unincluded will be autogenerated
 * @param {String} name The employee's new name
 * @param {String} email The employee's new email
 * @param {String} position The employee's new position
 * @param {Number} hours The employee's new weekly hours
 * @param {String} password The employee's new password
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/doAddEmployee", async (req, res) => {
	const { id, name, email, position, hours, pay, password } = req.body;

	const employeeId = id || (await runQuery("SELECT MAX(employee_id) FROM employee;")).rows[0].max + 1;

	const insertQuery = `
		INSERT INTO employee (employee_id, name, position, hours, pay, password, email)
		VALUES ($1, $2, $3, $4, $5, $6, $7);
	`;

	const result = await runQuery(insertQuery, [employeeId, name, position, hours, pay, password, email]);

	if (result.success)
		res.json({ success: true, message: "Employee added successfully!" });
	else
		res.status(500).json({ success: false, error: "Failed to add employee" });
});


/**
 * Handles POST requests to fire an employee and sends the results as a JSON Response.
 * Firing an employee will make their information non-visible in the frontend.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number=} employeeId ID of employee intended to be fired
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/fireEmployee", async (req, res) => {
	const { employeeId } = req.body;
	const query = `UPDATE employee SET position = 'Fired' WHERE employee_id = $1;`;
	const result = await runQuery(query, [employeeId]);

	if (result.success) {
		res.json({ success: true, message: "Employee marked as fired." });
	} else {
		res.status(400).json({ error: result.error });
	}
});

/**
 * Handles POST requests to fetch all inventory information from the database and sends the results as a JSON Response.

 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/doInventoryLoad", async (req, res) => {
	const query = "SELECT inventory_id, name, quantity, quantity_type FROM inventory;";
	const result = await runQuery(query);


	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});

/**
 * Handles POST requests to add a new item to the inventory and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {String} name Name of the inventory item to be added
 * @param {Number} quantity How much of the new item to be added to the inventory
 * @param {String} quantity_type Quantity type, such as lbs or cups etc.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/addInventoryItem", async (req, res) => {
	const { name, quantity, quantity_type } = req.body;

	const inventory_id = (await runQuery("SELECT MAX(inventory_id) FROM inventory;")).rows[0].max + 1;

	const insertQuery = `
      INSERT INTO inventory (inventory_id, name, quantity, quantity_type)
      VALUES (${inventory_id}, '${name}', ${quantity}, '${quantity_type}');
  `;

	const result = await runQuery(insertQuery);

	if (result.success)
		res.json({ success: true, message: "Item added successfully!" });
	else
		res.status(500).json({ success: false, error: "Failed to add item" });
})

/**
 * Handles POST requests to delete an inventory item and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} inventory_id ID of the inventory item to be deleted
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/removeInventoryItem", async (req, res) => {
	const { inventory_id } = req.body;

	const removeQuery = `DELETE FROM inventory WHERE inventory_id = ${inventory_id};`

	const result = await runQuery(removeQuery);

	if (result.success)
		res.json({ success: true, message: "Item deleted successfully!" });
	else
		res.status(500).json({ success: false, error: "Failed to delete item" });
});

/**
 * Handles POST requests to modify an existing item in the inventory and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} inventory_id ID of the inventory item to be deleted
 * @param {String} name New name of the inventory item
 * @param {Number} quantity How much of the item to be added to the inventory
 * @param {String} quantity_type Quantity type, such as lbs or cups etc.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/editInventoryItem", async (req, res) => {
	const { inventory_id, name, quantity, quantity_type } = req.body;

	const updateQuery = `UPDATE inventory SET name = '${name}', quantity = ${quantity}, quantity_type = '${quantity_type}' WHERE inventory_id = ${inventory_id};`;

	const result = await runQuery(updateQuery);

	if (result.success)
		res.json({ success: true, message: "Item updated successfully!" });
	else
		res.status(500).json({ success: false, error: "Failed to update item" });
});

/**
 * Handles POST requests to fetch all ingredient information for a recipe from the database and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} recipe_id ID of the recipe to gather ingerdients for
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/doIngredientLoad", async (req, res) => {
	const { recipe_id } = req.body;
	const query = `SELECT recipe_ing_id, name, ingredient_id FROM recipe_ingredient WHERE recipe_id = ${recipe_id};`;
	const result = await runQuery(query);


	if (result.success) {
		res.json(result.rows);
	} else {
		res.status(400).json({ error: result.error });
	}
});

/**
 * Handles POST requests to remove an inrgedient from a recipe in the database and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} recipe_ing_id ID of the recipe ingredient to delete
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/removeIngredient", async (req, res) => {
	const { recipe_ing_id } = req.body;

	const removeQuery = `DELETE FROM recipe_ingredient WHERE recipe_ing_id = ${recipe_ing_id};`

	const result = await runQuery(removeQuery);

	if (result.success)
		res.json({ success: true, message: "Item deleted successfully!" });
	else
		res.status(500).json({ success: false, error: "Failed to delete item" });
});

/**
 * Handles POST requests to add an ingredient to a recipe and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} recipe_id ID of the recipe the ingredient belongs to
 * @param {Number} inventory_id ID of the inventory item to be added
 * @param {String} Name of the ingredient
 * @param {Number} quantity How much of the ingredient to be added to the inventory
 * @param {String} quantity_type Quantity type, such as lbs or cups etc.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/addIngredient", async (req, res) => {
  const { recipe_id, inventory_id, name, quantity, quantity_type } = req.body;

  try {
    // Fetch the next available ingredient_id
    const ingredient_id = (await runQuery("SELECT MAX(ingredient_id) FROM ingredient;")).rows[0].max + 1;
		

		const recipe_ing_id = (await runQuery("SELECT MAX(recipe_ing_id) FROM recipe_ingredient;")).rows[0].max + 1;
		

    // Insert the new ingredient and the recipe_ingredient entry
    const insertIngredientQuery = `
      INSERT INTO ingredient (ingredient_id, inventory_id, name, quantity, quantity_type)
      VALUES (${ingredient_id}, ${inventory_id}, '${name}', ${quantity}, '${quantity_type}');
    `;
		

    const insertRecipeIngredientQuery = `
      INSERT INTO recipe_ingredient (recipe_ing_id, recipe_id, name, ingredient_id)
      VALUES (${recipe_ing_id}, ${recipe_id}, '${name}', ${ingredient_id});
    `;

    // Execute both queries
    const ingredientResult = await runQuery(insertIngredientQuery);
    if (!ingredientResult.success) {
      return res.status(500).json({ success: false, error: "Failed to add ingredient." });
    }

    const recipeIngredientResult = await runQuery(insertRecipeIngredientQuery);
    if (!recipeIngredientResult.success) {
      return res.status(500).json({ success: false, error: "Failed to add recipe ingredient." });
    }

    // Success response
    res.json({ success: true, message: "Ingredient added successfully!" });
  } catch (error) {
    console.error("Error adding ingredient:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * Handles POST requests to modify an existing ingredient in the database and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} recipe_id ID of the recipe the ingredient belongs to
 * @param {Number} inventory_id ID of the inventory item to be modified
 * @param {String} Name of the ingredient
 * @param {Number} quantity How much of the ingredient to be added to the inventory
 * @param {String} quantity_type Quantity type, such as lbs or cups etc.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/editIngredient", async (req, res) => {
  const { recipe_ing_id, recipe_id, inventory_id, name, quantity, quantity_type } = req.body;

  try {
    // Fetch the next available ingredient_id
    const ingredient_id = (await runQuery("SELECT MAX(ingredient_id) FROM ingredient;")).rows[0].max + 1;

    // Insert the new ingredient into the ingredient table
    const insertIngredientQuery = `
      INSERT INTO ingredient (ingredient_id, inventory_id, name, quantity, quantity_type)
      VALUES (${ingredient_id}, ${inventory_id}, '${name}', ${quantity}, '${quantity_type}');
    `;

    const insertIngredientResult = await runQuery(insertIngredientQuery);
    if (!insertIngredientResult.success) {
      return res.status(500).json({ success: false, error: "Failed to add new ingredient." });
    }

    // Update the recipe_ingredient table with the new ingredient
    const updateRecipeIngredientQuery = `
      UPDATE recipe_ingredient
      SET recipe_id = ${recipe_id}, ingredient_id = ${ingredient_id}, name = '${name}'
      WHERE recipe_ing_id = ${recipe_ing_id};
    `;

    const updateRecipeIngredientResult = await runQuery(updateRecipeIngredientQuery);
    if (!updateRecipeIngredientResult.success) {
      return res.status(500).json({ success: false, error: "Failed to update recipe ingredient." });
    }

    // Success response
    res.json({ success: true, message: "Ingredient updated successfully!" });
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


/**
 * Handles POST requests to fetch ingredient information for a specific ingredient from the database and sends the results as a JSON Response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} recipe_ing_id ID of the recipe ingredient
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/getIngredientDetails", async (req, res) => {
  const { recipe_ing_id } = req.body;

  try {
    // Fetch recipe_id and ingredient_id from recipe_ingredient table
    const recipeIngredientQuery = `
      SELECT recipe_id, ingredient_id
      FROM recipe_ingredient
      WHERE recipe_ing_id = ${recipe_ing_id};
    `;

    const recipeIngredientResult = await runQuery(recipeIngredientQuery);
    if (!recipeIngredientResult.success || recipeIngredientResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "No data found for the given recipe_ing_id." });
    }

    const { recipe_id, ingredient_id } = recipeIngredientResult.rows[0];

    // Fetch ingredient details from the ingredient table
    const ingredientQuery = `
      SELECT inventory_id, name, quantity, quantity_type
      FROM ingredient
      WHERE ingredient_id = ${ingredient_id};
    `;

    const ingredientResult = await runQuery(ingredientQuery);
    if (!ingredientResult.success || ingredientResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "No ingredient details found for the given ingredient_id." });
    }

    const ingredientDetails = ingredientResult.rows[0];

    // Combine results and send success response
    res.json({ success: true, recipe_id, ...ingredientDetails });
  } catch (error) {
    console.error("Error fetching ingredient details:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * Handles POST requests to fetch all inventory information from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/getInventory", async (req, res) => {
  const query = `SELECT inventory_id, name FROM inventory;`;  // Modify query to fetch inventory items

  try {
    const result = await runQuery(query);  // Run the query using your database function

    if (result.success) {
      res.json(result.rows);  // Return the inventory items as a response
    } else {
      res.status(400).json({ error: result.error });  // Return an error if the query fails
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the inventory.' });  // Handle errors
  }
});

/**
 * Handles POST requests to package sales report information from the database and sends the results as a JSON Response.
 * This finds all relevant sales information between specified times and calculates the amount of revenue made on those sales.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} startTime Start time for the sales report
 * @param {Number} endTime End time for the sales report
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the sales report
 */
router.post("/doSalesReportQuery", async (req, res) => {
	const { startTime, endTime } = req.body;

	// console.log(startTime);
	// console.log(endTime);

	const query = `
          SELECT meat AS item, COUNT(*) AS count, SUM(price) AS total_revenue 
          FROM ( 
              SELECT mi.meat1 AS meat, mi.price 
              FROM meal_item mi 
              JOIN line_item li ON mi.line_item_id = li.line_item_id 
              JOIN receipt r ON li.receipt_id = r.receipt_id 
              WHERE r.date BETWEEN $1 AND $2
                AND mi.meat1 <> '' 
              UNION ALL 
              SELECT mi.meat2, mi.price 
              FROM meal_item mi 
              JOIN line_item li ON mi.line_item_id = li.line_item_id 
              JOIN receipt r ON li.receipt_id = r.receipt_id 
              WHERE r.date BETWEEN $1 AND $2
                AND mi.meat2 <> '' 
              UNION ALL 
              SELECT mi.meat3, mi.price 
              FROM meal_item mi 
              JOIN line_item li ON mi.line_item_id = li.line_item_id 
              JOIN receipt r ON li.receipt_id = r.receipt_id 
              WHERE r.date BETWEEN $1 AND $2
                AND mi.meat3 <> '' 
              UNION ALL 
              SELECT mi.side, mi.price 
              FROM meal_item mi 
              JOIN line_item li ON mi.line_item_id = li.line_item_id 
              JOIN receipt r ON li.receipt_id = r.receipt_id 
              WHERE r.date BETWEEN $1 AND $2
                AND mi.side <> '' 
          ) AS combined_items 
          GROUP BY item 
          UNION ALL 
          SELECT di.name AS item, COUNT(*) AS count, SUM(di.price) AS total_revenue 
          FROM drink_item di 
          JOIN line_item li ON di.line_item_id = li.line_item_id 
          JOIN receipt r ON li.receipt_id = r.receipt_id 
          WHERE r.date BETWEEN $1 AND $2
          GROUP BY di.name 
          UNION ALL 
          SELECT ai.name AS item, COUNT(*) AS count, SUM(ai.price) AS total_revenue 
          FROM appetizer_item ai 
          JOIN line_item li ON ai.line_item_id = li.line_item_id 
          JOIN receipt r ON li.receipt_id = r.receipt_id 
          WHERE r.date BETWEEN $1 AND $2
          GROUP BY ai.name;
      `;
	//query = `SELECT * FROM employee;`;

	try {
		const result = await pool.query(query, [startTime, endTime]); //, [startTime, endTime]
		// console.log(result.rows);
		res.json(result.rows);
	} catch (error) {
		console.error('Error executing query:', error);
		res.status(500).json({ error: error.message });
	}
});


/**
 * Handles POST requests to fetch the count of items sold, ordered from most popular to least popular.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Number} startTime Start time for the sales report
 * @param {Number} endTime End time for the sales report
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} List of items with their counts
 */
router.post("/getSoldItemCount", async (req, res) => {
    const { startTime, endTime } = req.body;

    const query = `
        SELECT item, COUNT(*) AS count 
        FROM ( 
            SELECT mi.meat1 AS item 
            FROM meal_item mi 
            JOIN line_item li ON mi.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
              AND mi.meat1 <> '' 
            UNION ALL 
            SELECT mi.meat2 AS item 
            FROM meal_item mi 
            JOIN line_item li ON mi.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
              AND mi.meat2 <> '' 
            UNION ALL 
            SELECT mi.meat3 AS item 
            FROM meal_item mi 
            JOIN line_item li ON mi.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
              AND mi.meat3 <> '' 
            UNION ALL 
            SELECT mi.side AS item 
            FROM meal_item mi 
            JOIN line_item li ON mi.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
              AND mi.side <> '' 
            UNION ALL 
            SELECT di.name AS item 
            FROM drink_item di 
            JOIN line_item li ON di.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
            UNION ALL 
            SELECT ai.name AS item 
            FROM appetizer_item ai 
            JOIN line_item li ON ai.line_item_id = li.line_item_id 
            JOIN receipt r ON li.receipt_id = r.receipt_id 
            WHERE r.date BETWEEN $1 AND $2
        ) AS combined_items 
        GROUP BY item 
        ORDER BY count DESC;
    `;

    try {
        const result = await pool.query(query, [startTime, endTime]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: error.message });
    }
});



/**
 * Handles POST requests to package X/Z Report information from the database and sends the results as a JSON Response.
 * This finds all relevant sales information since the last Z Report and returns revenue per item.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Boolean} modifyDatabase Boolean for if the report was a Z Report, if so then time in database is modified
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the sales report
 */
router.post("/doXZReport", async (req, res) => {
	const modifyDatabase = req.body.modifyDatabase;
	const ZReportDateQuery = "select * from z_report";
	const ZReportDateResult = await runQuery(ZReportDateQuery);
	if (!ZReportDateResult.success) {
		res.status(400).json({ error: ZReportDateResult.error });
		return;
	}

	const reportQuery = `
      WITH meal_data AS (
          SELECT 
              mi.size, 
              COUNT(*) AS count, 
              SUM(mi.price) AS total_revenue 
          FROM 
              meal_item mi 
          JOIN 
              line_item li ON mi.line_item_id = li.line_item_id 
          JOIN 
              receipt r ON li.receipt_id = r.receipt_id 
          WHERE 
              r.date BETWEEN (SELECT date FROM z_report LIMIT 1) AND CURRENT_TIMESTAMP 
          GROUP BY 
              mi.size
      ), 
      drink_data AS (
          SELECT 
              di.name, 
              COUNT(*) AS count, 
              SUM(di.price) AS total_revenue 
          FROM 
              drink_item di 
          JOIN 
              line_item li ON di.line_item_id = li.line_item_id 
          JOIN 
              receipt r ON li.receipt_id = r.receipt_id 
          WHERE 
              r.date BETWEEN (SELECT date FROM z_report LIMIT 1) AND CURRENT_TIMESTAMP 
          GROUP BY 
              di.name
      ), 
      appetizer_data AS (
          SELECT 
              ai.name, 
              COUNT(*) AS count, 
              SUM(ai.price) AS total_revenue 
          FROM 
              appetizer_item ai 
          JOIN 
              line_item li ON ai.line_item_id = li.line_item_id 
          JOIN 
              receipt r ON li.receipt_id = r.receipt_id 
          WHERE 
              r.date BETWEEN (SELECT date FROM z_report LIMIT 1) AND CURRENT_TIMESTAMP 
          GROUP BY 
              ai.name
      ) 
      SELECT * FROM meal_data
      UNION 
      SELECT * FROM drink_data
      UNION 
      SELECT * FROM appetizer_data;
    `;

	const reportResult = await runQuery(reportQuery);
	if (!reportResult.success) {
		res.status(400).json({ error: reportResult.error });
		return;
	}

	if (modifyDatabase) {
		const updateQuery = `UPDATE z_report SET date = CURRENT_TIMESTAMP;`;
		updateResult = await runQuery(updateQuery);
		if (!updateResult.success) {
			res.status(400).json({ error: updateResult.error });
			return;
		}
	}

	res.json({ results: reportResult });
})

/**
 * Handles POST requests to fetch the last Z Report date from the database and sends the results as a JSON Response.
 *
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/getLastZReportDate", async (req, res) => {
	const ZReportDateQuery = "select * from z_report";
	const ZReportDateResult = await runQuery(ZReportDateQuery);
	if (!ZReportDateResult.success) {
		res.status(400).json({ error: ZReportDateResult.error });
		return;
	}

	res.json({ results: ZReportDateResult });
});

/**
 * Handles POST requests to verify a user's Google SSO credentials (email specifically) and sends the results as a JSON Response.
 * This function decodes the credential object passed by the user, then queries their email in the database and returns their role permission in the JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} CredentialResponse CredentialResponse object created by Google's SSO API
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/doGoogleLogin", async (req, res) => {
	const credential = req.body.credentialResponse.credential;
	const decodedCredential = jwtDecode(credential);

	const positionQuery = `select position from employee where email = '${decodedCredential.email}'`;
	const positionResult = await runQuery(positionQuery);
	if (!positionResult.success) {
		res.status(400).json({ error: positionResult.error });
		return;
	}
	if (positionResult.rowCount != 1) {
		res.status(401).json({ error: "Zero or more than one related accounts" })
		// console.log("Zero or more than one related accounts");
		return;
	}

	const epochTime = Math.floor((new Date()).getTime() / 1000);
	if (decodedCredential.exp < epochTime) {
		//your code is expired, try again
		res.status(401).json({ error: "Expired auth token, try again" })
		// console.log("Expired auth token, try again");
		return;
	}

	res.status(200).json(positionResult);
});

/**
 * Handles POST requests to send an email containing the user's receipt number and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {String} email The user's email
 * @param {Number} receiptId ID of the user's receipt
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the email
 */
router.post("/doSendEmailReceipt", async (req, res) => {
	const { email, receiptId } = req.body;
  
	if (!email || !receiptId) {
	  return res.status(400).json({ message: "Email and Receipt ID are required." });
	}

	const addEmailQuery = `INSERT INTO order_emails (receipt_id, email) VALUES (` + receiptId + `, '` + email + `');`
	const addEmailResult = await runQuery(addEmailQuery);
	if (!addEmailResult.success) {
		res.status(400).json({ error: addEmailResult.error });
		return;
	}

	const EMAIL_USER = process.env.EMAIL_USER;
	const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS;
  
	try {
	  const transporter = nodemailer.createTransport({
		service: "gmail", // Or your email provider
		auth: {
		  user: EMAIL_USER,
		  pass: EMAIL_APP_PASS,
		},
	  });
  
	  const mailOptions = {
		from: EMAIL_USER,
		to: email,
		subject: "Your Receipt Details",
		text: `Thank you for your purchase! Your receipt ID is ${receiptId}.`,
	  };
  
	  await transporter.sendMail(mailOptions);
  
	  res.status(200).json({ message: "Email sent successfully!" });
	} catch (error) {
	  console.error("Error sending email:", error);
	  res.status(500).json({ message: "Failed to send email." });
	}
});

/**
 * Handles POST requests to translate text and sends the results as a JSON Response.
 * This is done using Google's Translation API through Axios.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {String} text Text to be translated
 * @param {String} targetLanguage Language to translate the text to
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the translation
 */
router.post("/doTranslate", async (req, res) => {
	//console.log("here-2");
	const { text, targetLanguage } = req.body;
	//console.log("here-1");
	const TRANSLATION_API_KEY = process.env.GOOGLE_TRANSLATION_API_KEY; // replace with your actual API key
  
	// console.log("here0");
	// console.log(text);
	// console.log(targetLanguage);
	if (!text || !targetLanguage) {
	  return res.status(400).json({ message: "Text and target language are required." });
	}
    // console.log("here1");
	try {
	  // Google Translate API endpoint
	  const url = `https://translation.googleapis.com/language/translate/v2`;
  
	  // Make the request to Google Translation API using params instead of JSON body
	  const response = await axios.post(url, null, {
		params: {
		  key: TRANSLATION_API_KEY,
		  q: text,
		  target: targetLanguage,
		},
	  });
	//   console.log("here2");
  
	  // Extract the translated text from the API response
	  const translatedText = response.data.data.translations[0].translatedText;
  
	//   console.log("here3");

	  res.status(200).json({ translatedText });
	} catch (error) {
	  console.error("Error with Google Translation API:", error.response?.data || error.message);
	  res.status(500).json({ message: "Failed to translate text.", error: error.message });
	}
});

/**
 * Handles POST requests to translate multiple texts and sends the results as a JSON Response.
 * This is done using Google's Translation API through Axios.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Array} texts Multiple texts to be translated
 * @param {String} targetLanguage Language to translate the text to
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the translation
 */
router.post('/doTranslateBatch', async (req, res) => {
    const { texts, targetLanguage } = req.body;

    // Input validation
    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLanguage) {
        return res.status(400).json({ error: 'Texts and target language are required.' });
    }

    try {
        // Make a request to the Google Translate API
        const response = await axios.request({
            method: 'POST',
            url: 'https://translation.googleapis.com/language/translate/v2',
            params: {
                key: process.env.GOOGLE_TRANSLATION_API_KEY,
                q: texts, // Pass the array of texts directly
                target: targetLanguage,
            },
            paramsSerializer: params => {
                // Custom params serializer to handle arrays properly
                return Object.entries(params).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
                    }
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                }).join('&');
            },
        });

        // Extract translations
        const translations = response.data.data.translations.map((t) => t.translatedText);

        res.status(200).json({ translations });
    } catch (error) {
        console.error('Error with Google Translation API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch translations.', details: error.message });
    }
});

// DO NOT USE THESE ANYMORE -- CREATE YOUR OWN ENDPOINTS -- THESE ARE OLD


/**
 * (Deprecated) Handles POST requests to query the PostgreSQL database and sends the results as a JSON Response.
 * Note, this is recommended to be commented out otherwise users can query anything they want to the database.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {String} query The query to be sent to the database server
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/query", async (req, res) => {
	const { query } = req.body;
	// console.log(query);
	const result = await runQuery(query, []);

	if (result.success) {
		res.json(result.rows);
	} else {
		console.log("Router /query error!");
		res.status(400).json({ error: result.error });
	}
});

/*
// Route to execute a custom update query
router.post("/update", async (req, res) => {
	const { query } = req.body;
	const result = await runQuery(query);

	if (result.success) {
		res.json({ success: true, rowCount: result.rowCount });
	} else {
		res.status(400).json({ error: result.error });
	}
});

// Route to execute a custom insert query
router.post("/insert", async (req, res) => {
	const { query } = req.body;
	const result = await runQuery(query);

	if (result.success) {
		res.json({ success: true, rowCount: result.rowCount });
	} else {
		res.status(400).json({ error: result.error });
	}
}); */


/**
 * Handles POST requests to process an order and sends the results as a JSON Response.
 * This creates a receipt and adds all individual items as line items corresponding to the receipt in the database.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Array} orderList List of items in the order
 * @param {Number} totalPrice Total price of the order
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the order
 * @returns {Number} Receipt ID of the order that was processed
 */
router.post('/processOrder', async (req, res) => {
	const { orderList, totalPrice } = req.body;
  
	try {
	  await pool.query('BEGIN');
  
	  // Insert into receipt table
	  const receiptResult = await pool.query(
		'INSERT INTO receipt (date, totalamount, order_time) VALUES (CURRENT_TIMESTAMP, $1, CURRENT_TIME) RETURNING receipt_id;',
		[totalPrice]
	  );
  
	  const receiptId = receiptResult.rows[0].receipt_id;
  
	  // Process each order item
	  for (const orderItem of orderList) {
		const quantity = orderItem.quantity || 1; // Default to 1 if quantity is missing
  
		// Insert line items and specific items according to quantity
		for (let q = 0; q < quantity; q++) {
		  // Insert into line_item
		  const lineItemResult = await pool.query(
			'INSERT INTO line_item (receipt_id, price) VALUES ($1, $2) RETURNING line_item_id;',
			[receiptId, orderItem.price] // Ensure price is a number
		  );
  
		  const lineItemId = lineItemResult.rows[0].line_item_id;
  
		  // Insert into specific item table
		  switch (orderItem.type) {
			case 'Meal':
			  await pool.query(
				`INSERT INTO meal_item (line_item_id, size, price, meat1, meat2, meat3, side)
				 VALUES ($1, $2, $3, $4, $5, $6, $7);`,
				[
				  lineItemId,
				  orderItem.size,
				  orderItem.price,
				  orderItem.entrees[0] || null,
				  orderItem.entrees[1] || null,
				  orderItem.entrees[2] || null,
				  orderItem.side,
				]
			  );
			  break;
  
			case 'drink':
			case 'Drink':
			  await pool.query(
				`INSERT INTO drink_item (line_item_id, name, price, size)
				 VALUES ($1, $2, $3, $4);`,
				[lineItemId, orderItem.name, orderItem.price, 'Regular']
			  );
			  break;
  
			case 'appetizer':
			  await pool.query(
				`INSERT INTO appetizer_item (line_item_id, name, price)
				 VALUES ($1, $2, $3);`,
				[lineItemId, orderItem.name, orderItem.price]
			  );
			  break;
  
			// Add cases for other item types if necessary
		  }
		}
  
		/* Update Inventory from used ingredients in orderItem */
		// Fetch the list of ingredients and quantities needed
		let ingredientList;
		if (orderItem.type === 'Meal') {
		  ingredientList = await pool.query(
			`SELECT inv.inventory_id, i.quantity
			 FROM menu m
			 JOIN recipe_ingredient ri ON m.menu_id = ri.recipe_id
			 JOIN ingredient i ON ri.ingredient_id = i.ingredient_id
			 JOIN inventory inv ON i.inventory_id = inv.inventory_id
			 WHERE m.name IN ($1, $2, $3, $4);`,
			[
			  orderItem.entrees[0] || null,
			  orderItem.entrees[1] || null,
			  orderItem.entrees[2] || null,
			  orderItem.side,
			]
		  );
		} else {
		  ingredientList = await pool.query(
			`SELECT inv.inventory_id, i.quantity
			 FROM menu m
			 JOIN recipe_ingredient ri ON m.menu_id = ri.recipe_id
			 JOIN ingredient i ON ri.ingredient_id = i.ingredient_id
			 JOIN inventory inv ON i.inventory_id = inv.inventory_id
			 WHERE m.name = $1;`,
			[orderItem.name]
		  );
		}
  
		// Update inventory quantities based on total quantity needed
		for (const row of ingredientList.rows) {
		  const totalQuantityNeeded = row.quantity * quantity; // Multiply by the item's quantity
		  await pool.query(
			`UPDATE inventory 
			 SET quantity = quantity - $1
			 WHERE inventory_id = $2;`,
			[totalQuantityNeeded, row.inventory_id]
		  );
		}
	  }
  
	  await pool.query('COMMIT');
	  res.json({ result: receiptId, success: true });
	} catch (error) {
	  await pool.query('ROLLBACK');
	  console.error('Error processing order:', error);
	  res.status(500).json({ error: error.message });
	}
  });
  

/**
 * Handles POST requests to fetch all pending orders in the database sends the results as a JSON Response.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.get('/pendingOrders', async (req, res) => {
	try {
	  // Fetch up to 6 orders with status 'Pending'
	  const receiptsQuery = `
		SELECT r.receipt_id, r.date, r.order_time, r.totalamount
		FROM receipt r
		WHERE r.status = 'Pending'
		ORDER BY r.date ASC, r.order_time ASC
		LIMIT 6;
	  `;
	  const receiptsResult = await pool.query(receiptsQuery);
	  const receipts = receiptsResult.rows;
  
	  // Prepare orders with items
	  const orders = [];
	  for (const receipt of receipts) {
		const receipt_id = receipt.receipt_id;
  
		// Fetch line items for the receipt
		const lineItemsQuery = `
		  SELECT li.line_item_id, li.price
		  FROM line_item li
		  WHERE li.receipt_id = $1;
		`;
		const lineItemsResult = await pool.query(lineItemsQuery, [receipt_id]);
		const lineItems = lineItemsResult.rows;
  
		const items = [];
  
		// Fetch item details
		for (const li of lineItems) {
		  const line_item_id = li.line_item_id;
  
		  // Check for meal items
		  const mealItemQuery = `
			SELECT mi.size, mi.meat1, mi.meat2, mi.meat3, mi.side
			FROM meal_item mi
			WHERE mi.line_item_id = $1;
		  `;
		  const mealItemResult = await pool.query(mealItemQuery, [line_item_id]);
		  if (mealItemResult.rows.length > 0) {
			const mi = mealItemResult.rows[0];
			items.push({
			  type: 'Meal',
			  size: mi.size,
			  meats: [mi.meat1, mi.meat2, mi.meat3].filter(Boolean),
			  side: mi.side,
			});
			continue;
		  }
  
		  // Check for appetizer items
		  const appetizerItemQuery = `
			SELECT ai.name
			FROM appetizer_item ai
			WHERE ai.line_item_id = $1;
		  `;
		  const appetizerItemResult = await pool.query(appetizerItemQuery, [line_item_id]);
		  if (appetizerItemResult.rows.length > 0) {
			const ai = appetizerItemResult.rows[0];
			items.push({
			  type: 'Appetizer',
			  name: ai.name,
			});
			continue;
		  }
  
		  // Check for drink items
		  const drinkItemQuery = `
			SELECT di.name, di.size
			FROM drink_item di
			WHERE di.line_item_id = $1;
		  `;
		  const drinkItemResult = await pool.query(drinkItemQuery, [line_item_id]);
		  if (drinkItemResult.rows.length > 0) {
			const di = drinkItemResult.rows[0];
			items.push({
			  type: 'Drink',
			  name: di.name,
			  size: di.size,
			});
			continue;
		  }
  
		  // Unknown item type
		  items.push({
			type: 'Unknown',
			line_item_id: line_item_id,
		  });
		}
  
		// Finding email corresponding with the receipt
		let foundEmail = null;
		try {
		  const emailQuery = `SELECT email FROM order_emails WHERE receipt_id = $1;`;
		  const emailResult = await pool.query(emailQuery, [receipt_id]);
		  if (emailResult.rows.length > 0) {
			foundEmail = emailResult.rows[0].email;
		  }
		} catch (error) {
		  console.error('Error fetching email for receipt_id', receipt_id, error);
		  // Optionally handle the error or proceed without the email
		}
  
		orders.push({
		  receipt_id: receipt.receipt_id,
		  date: receipt.date,
		  order_time: receipt.order_time,
		  email: foundEmail,
		  totalamount: receipt.totalamount,
		  items: items,
		});
	  }
  
	  res.json(orders);
	} catch (error) {
	  console.error('Error fetching pending orders:', error);
	  res.status(500).json({ error: error.message });
	}
  });
  

/**
 * Handles POST requests to mark a pending order as complete and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} receipt_id ID of the receipt to mark complete
 * @param {String=} email User's email to notify them that their order is complete
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post('/completeOrder', async (req, res) => {
	const { receipt_id, email } = req.body;
	try {
	  // Update the receipt's status to 'Fulfilled'
	  const updateStatusQuery = `
		UPDATE receipt
		SET status = 'Fulfilled'
		WHERE receipt_id = $1;
	  `;
	  await pool.query(updateStatusQuery, [receipt_id]);
  
	  // Send email to notify user if they provided an email
	  if (email) {
		const EMAIL_USER = process.env.EMAIL_USER;
		const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS;
		const transporter = nodemailer.createTransport({
		  service: "gmail", // Or your email provider
		  auth: {
			user: EMAIL_USER,
			pass: EMAIL_APP_PASS,
		  },
		});
  
		const mailOptions = {
		  from: EMAIL_USER,
		  to: email,
		  subject: "Your Order is Ready!",
		  text: `Thank you again for your purchase! Your order with receipt ID ${receipt_id} is ready.`,
		};
  
		await transporter.sendMail(mailOptions);
	  }
  
	  res.json({ success: true });
	} catch (error) {
	  console.error('Error completing order:', error);
	  res.status(500).json({ error: error.message });
	}
  });
  
/**
 * Handles POST requests to fetch all items from the menu and sends the results as a JSON Response.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.post("/doItemLoad", async (req, res) => {
    const query = "SELECT * FROM menu;";
    const result = await runQuery(query);
    if (result.success) {
        res.json(result.rows);
    } else {
        res.status(400).json({ error: result.error });
    }
});

/**
 * Handles POST requests to add an item to the menu and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {String} name Name of the item
 * @param {String} item_type Type of item, either drink appetizer or meal
 * @param {Number} price Price of the item 
 * @param {Number} calories How many calories the item is
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/addItem", async (req, res) => {
    const { name, item_type, price, calories } = req.body;
    const menu_id = (await runQuery("SELECT MAX(menu_id) FROM menu;")).rows[0].max + 1;

    const query = `
        INSERT INTO menu (menu_id, name, item_type, price, calories)
        VALUES ($1, $2, $3, $4, $5);
    `;
    const result = await runQuery(query, [menu_id, name, item_type, price, calories]);

    if (result.success) res.json({ success: true, message: "Menu item added successfully!" });
    else res.status(500).json({ success: false, error: "Failed to add menu item" });
});

/**
 * Handles POST requests to modify an existing item in the menu and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {String} name New name of the item
 * @param {String} item_type Type of item, either drink appetizer or meal
 * @param {Number} price Price of the item 
 * @param {Number} calories How many calories the item is
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/editItem", async (req, res) => {
    const { menu_id, name, item_type, price, calories } = req.body;

    const query = `
        UPDATE menu
        SET name = $1, item_type = $2, price = $3, calories = $4
        WHERE menu_id = $5;
    `;
    const result = await runQuery(query, [name, item_type, price, calories, menu_id]);

    if (result.success) res.json({ success: true, message: "Menu item updated successfully!" });
    else res.status(500).json({ success: false, error: "Failed to update menu item" });
});

/**
 * Handles POST requests to delete an existing item from the menu and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} menu_id ID of the menu item
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.post("/removeItem", async (req, res) => {
	const { menu_id } = req.body;

	// SQL queries
	const deleteRecipeIngredientsQuery = "DELETE FROM recipe_ingredient WHERE recipe_id = $1;";
	const deleteMenuQuery = "DELETE FROM menu WHERE menu_id = $1;";

	try {
			// First, delete from recipe_ingredient where recipe_id matches
			const recipeResult = await runQuery(deleteRecipeIngredientsQuery, [menu_id]);

			// Then, delete the menu item
			const menuResult = await runQuery(deleteMenuQuery, [menu_id]);

			if (recipeResult.success && menuResult.success) {
					res.json({ success: true, message: "Menu item and associated recipe ingredients removed successfully!" });
			} else {
					res.status(500).json({ success: false, error: "Failed to remove menu item or associated recipe ingredients." });
			}
	} catch (error) {
			console.error("Error removing item:", error);
			res.status(500).json({ success: false, error: "An unexpected error occurred." });
	}
});


/**
 * Handles POST requests to fetch all receipt information and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number=} page Where to start at the list of receipts
 * @param {Number=} limit How many receipts to return
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.get("/receipts", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    try {
        const receiptsQuery = `
            SELECT receipt_id, date, totalamount, status
            FROM receipt
            ORDER BY date DESC
            LIMIT $1 OFFSET $2;
        `;
        const receiptsResult = await pool.query(receiptsQuery, [limit, offset]);
        res.json(receiptsResult.rows);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Handles POST requests to fetch receipt information for a single receipt and sends the results as a JSON Response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} receipt_id ID of the receipt
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Results of the query
 */
router.get("/receipts/:receipt_id", async (req, res) => {
	const { receipt_id } = req.params;
	try {
	  // Fetch receipt details
	  const receiptQuery = `
		SELECT receipt_id, date, totalamount, status
		FROM receipt
		WHERE receipt_id = $1;
	  `;
	  const receiptResult = await pool.query(receiptQuery, [receipt_id]);
  
	  if (receiptResult.rows.length === 0) {
		return res.status(404).json({ error: "Receipt not found" });
	  }
  
	  const receipt = receiptResult.rows[0];
  
	  // Fetch line items
	  const lineItemsQuery = `
		SELECT li.line_item_id, li.price
		FROM line_item li
		WHERE li.receipt_id = $1;
	  `;
	  const lineItemsResult = await pool.query(lineItemsQuery, [receipt_id]);
	  const lineItems = lineItemsResult.rows;
  
	  const items = [];
  
	  // Fetch item details
	  for (const li of lineItems) {
		const line_item_id = li.line_item_id;
  
		// Check for meal items
		const mealItemQuery = `
		  SELECT mi.size, mi.meat1, mi.meat2, mi.meat3, mi.side
		  FROM meal_item mi
		  WHERE mi.line_item_id = $1;
		`;
		const mealItemResult = await pool.query(mealItemQuery, [line_item_id]);
		if (mealItemResult.rows.length > 0) {
		  const mi = mealItemResult.rows[0];
		  items.push({
			line_item_id: line_item_id,
			type: 'Meal',
			size: mi.size,
			meats: [mi.meat1, mi.meat2, mi.meat3].filter(Boolean),
			side: mi.side,
			price: li.price,
		  });
		  continue;
		}
  
		// Check for appetizer items
		const appetizerItemQuery = `
		  SELECT ai.name
		  FROM appetizer_item ai
		  WHERE ai.line_item_id = $1;
		`;
		const appetizerItemResult = await pool.query(appetizerItemQuery, [line_item_id]);
		if (appetizerItemResult.rows.length > 0) {
		  const ai = appetizerItemResult.rows[0];
		  items.push({
			line_item_id: line_item_id,
			type: 'Appetizer',
			name: ai.name,
			price: li.price,
		  });
		  continue;
		}
  
		// Check for drink items
		const drinkItemQuery = `
		  SELECT di.name, di.size
		  FROM drink_item di
		  WHERE di.line_item_id = $1;
		`;
		const drinkItemResult = await pool.query(drinkItemQuery, [line_item_id]);
		if (drinkItemResult.rows.length > 0) {
		  const di = drinkItemResult.rows[0];
		  items.push({
			line_item_id: line_item_id,
			type: 'Drink',
			name: di.name,
			size: di.size,
			price: li.price,
		  });
		  continue;
		}
  
		// Unknown item type
		items.push({
		  line_item_id: line_item_id,
		  type: 'Unknown',
		  price: li.price,
		});
	  }
  
	  // Combine receipt details with items
	  res.json({
		...receipt,
		line_items: items,
	  });
	} catch (error) {
	  console.error("Error fetching receipt:", error);
	  res.status(500).json({ error: error.message });
	}
  });
  
  
/**
 * Handles POST requests to modify an existing receipt and sends the results as a JSON Response.
 * Note that the line_items specified will override previous line_items for this receipt.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} receipt_id ID of the receipt to be modified
 * @param {String} status New status of the receipt
 * @param {Array} line_items Line items to be added to the receipt
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.put("/receipts/:receipt_id", async (req, res) => {
	const { receipt_id } = req.params;
	const { status, line_items } = req.body;
  
	try {
	  await pool.query('BEGIN');
  
	  // Update receipt status
	  const updateStatusQuery = `
		UPDATE receipt
		SET status = $1
		WHERE receipt_id = $2;
	  `;
	  await pool.query(updateStatusQuery, [status, receipt_id]);
  
	  // Optionally update line items
	  if (Array.isArray(line_items)) {
		// First, delete existing line items and associated entries
		const lineItemIdsQuery = `
		  SELECT line_item_id FROM line_item WHERE receipt_id = $1;
		`;
		const lineItemIdsResult = await pool.query(lineItemIdsQuery, [receipt_id]);
		const lineItemIds = lineItemIdsResult.rows.map(row => row.line_item_id);
  
		// Delete from specific item tables
		await pool.query(`DELETE FROM meal_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
		await pool.query(`DELETE FROM drink_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
		await pool.query(`DELETE FROM appetizer_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
  
		// Delete from line_item
		await pool.query(`DELETE FROM line_item WHERE receipt_id = $1;`, [receipt_id]);
  
		// Insert new line items
		for (const item of line_items) {
		  const lineItemResult = await pool.query(
			`INSERT INTO line_item (receipt_id, price) VALUES ($1, $2) RETURNING line_item_id;`,
			[receipt_id, item.price]
		  );
		  const line_item_id = lineItemResult.rows[0].line_item_id;
  
		  // Insert into specific item table
		  switch (item.type) {
			case 'Meal':
			  await pool.query(
				`INSERT INTO meal_item (line_item_id, size, price, meat1, meat2, meat3, side)
				 VALUES ($1, $2, $3, $4, $5, $6, $7);`,
				[
				  line_item_id,
				  item.size,
				  item.price,
				  item.meats[0] || null,
				  item.meats[1] || null,
				  item.meats[2] || null,
				  item.side,
				]
			  );
			  break;
  
			case 'Drink':
			  await pool.query(
				`INSERT INTO drink_item (line_item_id, name, price, size)
				 VALUES ($1, $2, $3, $4);`,
				[line_item_id, item.name, item.price, item.size || 'Regular']
			  );
			  break;
  
			case 'Appetizer':
			  await pool.query(
				`INSERT INTO appetizer_item (line_item_id, name, price)
				 VALUES ($1, $2, $3);`,
				[line_item_id, item.name, item.price]
			  );
			  break;
  
			// Add cases for other item types if necessary
		  }
		}
	  }
  
	  await pool.query('COMMIT');
	  res.json({ success: true, message: 'Receipt updated successfully!' });
	} catch (error) {
	  await pool.query('ROLLBACK');
	  console.error('Error updating receipt:', error);
	  res.status(500).json({ error: error.message });
	}
  });
  

/**
 * Handles POST requests to delete an existing receipt and sends the results as a JSON Response.
 * This also deletes all corresponding line items for the receipt.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Number} receipt_id ID of the receipt to be deleted
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Success of the query
 */
router.delete("/receipts/:receipt_id", async (req, res) => {
	const { receipt_id } = req.params;
  
	try {
	  await pool.query('BEGIN');
  
	  // Fetch line item IDs
	  const lineItemIdsResult = await pool.query(
		`SELECT line_item_id FROM line_item WHERE receipt_id = $1;`,
		[receipt_id]
	  );
	  const lineItemIds = lineItemIdsResult.rows.map(row => row.line_item_id);
  
	  // Delete from specific item tables
	  if (lineItemIds.length > 0) {
		await pool.query(`DELETE FROM meal_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
		await pool.query(`DELETE FROM drink_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
		await pool.query(`DELETE FROM appetizer_item WHERE line_item_id = ANY($1::int[]);`, [lineItemIds]);
	  }
  
	  // Delete from line_item
	  await pool.query(`DELETE FROM line_item WHERE receipt_id = $1;`, [receipt_id]);
  
	  // Delete from receipt
	  await pool.query(`DELETE FROM receipt WHERE receipt_id = $1;`, [receipt_id]);
  
	  await pool.query('COMMIT');
	  res.json({ success: true, message: 'Receipt deleted successfully!' });
	} catch (error) {
	  await pool.query('ROLLBACK');
	  console.error('Error deleting receipt:', error);
	  res.status(500).json({ error: error.message });
	}
  });
  

module.exports = router;
