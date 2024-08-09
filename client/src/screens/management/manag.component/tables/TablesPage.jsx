import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

const TablesPage = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // State for tables, active orders, products in active orders, and consumption in active orders
  const [activeTable, setactiveTable] = useState([]);
  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [productsOrderActive, setproductsOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders

  // Fetches orders from the API
  const getOrdersFromAPI = async () => {
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // Fetch orders data from the API endpoint
      const orders = await axios.get(apiUrl + '/api/order');
      // Set all orders fetched from the API
      setAllOrders(orders.data);

      // Filter active orders from all orders
      const activeOrders = orders.data.filter((order) => order.isActive === true);
      console.log({ activeOrders });
      // Set active orders
      setOrderActive(activeOrders);

      // Extract table IDs from active orders
      const getactiveTable = activeOrders.filter((activeOrder) => activeOrder.table != null);

      console.log({ getactiveTable });
      // Set table IDs
      setactiveTable(getactiveTable);
    } catch (error) {
      console.log(error);
    }
  };


  const [listoftable, setlistoftable] = useState([]);

  const getAllTable = async () => {
    try{
      const response = await axios.get(apiUrl + '/api/table');
      const tables = response.data;
      console.log({ tables: tables })
      setlistoftable(tables);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getAllTable()
    getOrdersFromAPI()
  }, [])


  return (
    <div className="container-xl" style={{height: "calc(100% - 60px)"}}>
      <h1>صفحة الطاولات</h1>
      <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
        {listoftable.map(table => (
          <div key={table.id} className="col-lg-2 col-md-4 col-sm-6 mb-4" style={{ border: '2px solid var(--light)' }}>
            <div className="text-center">
              <span style={{ fontSize: '60px', color: activeTable.find(active => active.table === table._id) ? 'green' : 'red' }} className="material-symbols-outlined">
                table_restaurant
              </span>
              <p style={{ fontSize: '30px', color: 'black' }}>{table.tableNumber}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TablesPage;
