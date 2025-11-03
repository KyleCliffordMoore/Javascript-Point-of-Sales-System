/**
 * App Component
 * 
 * The main entry point of the application, which defines the routing configuration and renders different pages 
 * based on the current URL. It uses React Router to navigate between different pages of the app, such as 
 * Home, Menu, Order pages, and more. 
 * 
 * Features:
 * - Provides routing for various pages within the application.
 * - Each route corresponds to a different page
 * 
 * @example Usage Example:
 * <App />
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import React from 'react';
import './styles/Global.css';
import './styles/TimeBar.css';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import ManagerOrEmployee from './pages/ManagerOrEmployee';
import ManagerSelection from './pages/ManagerSelection';
import GraphsPage from './pages/GraphsPage';
import XZReportPage from './pages/XZReportPage';
import CashierPage from './pages/CashierPage';
import InventoryPage from './pages/InventoryPage';
import InventoryAdd from './pages/InventoryAdd';
import InventoryEdit from './pages/InventoryEdit';
import RestockReportPage from './pages/RestockReportPage';
import SalesReportPage from './pages/SalesReportPage';
import AddEmployee from './pages/AddEmpployee';
import ListEmployee from './pages/ListEmployee';
import EditEmployee from './pages/EditEmployee';
import OrderPage from './pages/OrderPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import SelectEntreePage1 from './pages/SelectEntreePage1';
import SelectEntreePage2 from './pages/SelectEntreePage2';
import SelectEntreePage3 from './pages/SelectEntreePage3';
import SelectSidePage from './pages/SelectSidePage';
import CompletedOrderPage from './pages/CompletedOrderPage';
import KitchenView from './pages/KitchenView';
import EmailReceiptPage from './pages/EmailReceiptPage';
import ItemPage from './pages/ItemPage';
import ItemAdd from './pages/ItemAdd';
import ItemEdit from './pages/ItemEdit';
import IngredientAdd from './pages/IngredientAdd';
import IngredientEdit from './pages/IngredientEdit';
import ReceiptPage from './pages/ReceiptPage';
import ReceiptEdit from './pages/ReceiptEdit';
import ReceiptView from './pages/ReceiptView';
import ExcessReportPage from './pages/ExcessReportPage';
import ItemCountPage from './pages/ItemCountPage';


/**
 * Main App component that configures and renders the routes for the application.
 * 
 * It uses React Router to define the routes for different pages such as Home, Menu, OrderPage, 
 * and various other management pages like InventoryPage, Employee management pages, and reports.
 * 
 * @returns {JSX.Element} - The rendered component that sets up routing for the app.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manageroremployee" element={<ManagerOrEmployee />} />
        <Route path="/managerselection" element={<ManagerSelection />} />
        <Route path="/graphspage" element={<GraphsPage />} />
        <Route path="/xzreportpage" element={<XZReportPage />} />
        <Route path="/cashierpage" element={<CashierPage />} />
        <Route path="/restockreportpage" element={<RestockReportPage />} />
        <Route path="/inventorypage" element={<InventoryPage />} />
        <Route path="/inventoryadd" element={<InventoryAdd />} />
        <Route path="/inventoryedit" element={<InventoryEdit />} />
        <Route path="/salesreportpage" element={<SalesReportPage />} />
        <Route path="/listemployee" element={<ListEmployee />} />
        <Route path="/addemployee" element={<AddEmployee />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/selectEntree1" element={<SelectEntreePage1 />} />
        <Route path="/selectEntree2" element={<SelectEntreePage2 />} />
        <Route path="/selectEntree3" element={<SelectEntreePage3 />} />
        <Route path="/selectside" element={<SelectSidePage />} />
        <Route path="/editemployee" element={<EditEmployee />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/shoppingcart" element={<ShoppingCartPage />} />
        <Route path="/completedorderpage" element={<CompletedOrderPage />} />
        <Route path="/kitchen" element={<KitchenView />} />
        <Route path="/emailreceiptpage" element={<EmailReceiptPage />} />
        <Route path="/itempage" element={<ItemPage />} />
        <Route path="/itemadd" element={<ItemAdd />} />
        <Route path="/itemedit" element={<ItemEdit />} />
        <Route path="/ingredientadd" element={<IngredientAdd />} />
        <Route path="/ingredientedit" element={<IngredientEdit />} />
        <Route path="/receiptpage" element={<ReceiptPage />} /> 
        <Route path="/receiptedit" element={<ReceiptEdit />} />
        <Route path="/receiptview" element={<ReceiptView />} /> 
        <Route path="/excessreport" element={<ExcessReportPage />} /> 
        <Route path="/itempopularity" element={<ItemCountPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
