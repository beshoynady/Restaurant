import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { dataContext } from "../../../../App";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import "./Orders.css";
import InvoiceComponent from "../invoice/invoice";

const Orders = () => {
  const {
    restaurantData,
    permissionsList,
    setStartDate,
    setEndDate,
    filterByDateRange,
    filterByTime,
    employeeLoginInfo,
    formatDate,
    formatDateTime,
    setIsLoading,
    EditPagination,
    startPagination,
    endPagination,
    setStartPagination,
    setEndPagination,
    handleGetTokenAndConfig,
    apiUrl,
  } = useContext(dataContext);

  const [showModal, setShowModal] = useState(false);

  const [listOfOrders, setListOfOrders] = useState([]);

  // Fetch orders from API
  const getOrders = async () => {
    // Check if the user is authenticated
    const config = await handleGetTokenAndConfig();

    try {
      const response = await axios.get(`${apiUrl}/api/order`, config); // Construct API URL

      // Check if there are orders in the response
      const ordersData = response.data;
      if (ordersData && ordersData.length > 0) {
        setListOfOrders(ordersData.reverse()); // Update state with fetched orders
      } else {
        setListOfOrders([]); // Clear the list if no orders are found
        toast.info("لا توجد طلبات متاحة حالياً."); // Inform the user
      }
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching orders:", error);
      setListOfOrders([]);
      // Handle specific error scenarios
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error("غير مصرح. يرجى تسجيل الدخول مرة أخرى.");
        } else {
          toast.error(data?.message || "حدث خطأ أثناء تحميل الطلبات.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("فشل الاتصال بالخادم. يرجى التحقق من الشبكة.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const [listProductsOrder, setlistProductsOrder] = useState([]);
  const [orderData, setorderData] = useState("");
  const [ivocedate, setivocedate] = useState(new Date());

  // Fetch orders from API
  const getOrderDataBySerial = async (serial) => {
    const config = await handleGetTokenAndConfig();
    try {
      const res = await axios.get(apiUrl + "/api/order", config);
      const order = res.data.find((order) => order.serial === serial);
      if (order) {
        setorderData(order);
        setlistProductsOrder(order.products);
      }
    } catch (error) {
      // Display toast or handle error
    }
  };

  const printContainer = useRef();

  const Print = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: "printpage",
  });
  const handlePrint = (e) => {
    e.preventDefault();
    Print();
  };

  // State to manage order deletion
  const [orderId, setOrderId] = useState("");

  // Delete order
  const handleDeleteOrder = async (event) => {
    event.preventDefault();

    // Check if the user is authenticated
    const config = await handleGetTokenAndConfig();

    try {
      const orderIdToDelete = orderId; // Use a clear and descriptive variable name
      const deleteUrl = `${apiUrl}/api/order/${orderIdToDelete}`; // Construct the API URL

      // Send a DELETE request to the server
      await axios.delete(deleteUrl, config);

      // Refresh the orders list after deletion
      await getOrders();

      // Show a success message
      toast.success("تم حذف الطلب بنجاح.");
    } catch (error) {
      // Handle specific error scenarios based on status code
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        const { status, data } = error.response;
        if (status === 401) {
          toast.error("غير مصرح. يرجى تسجيل الدخول مرة أخرى.");
        } else if (status === 404) {
          await getOrders();
          toast.error("الطلب غير موجود. قد يكون تم حذفه مسبقًا.");
        } else {
          await getOrders();
          toast.error(data?.message || "حدث خطأ غير متوقع.");
        }
      } else if (error.request) {
        await getOrders();
        // Request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("فشل الاتصال بالخادم. يرجى التحقق من الشبكة.");
      } else {
        await getOrders();
        // Something else went wrong during the request setup
        console.error("Request setup error:", error.message);
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      await getOrders();
    }
  };

  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = (e) => {
    const Id = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedIds([...selectedIds, Id]);
    } else {
      const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
      setSelectedIds(updatedSelectedIds);
    }
  };

  const deleteSelectedIds = async (e) => {
    e.preventDefault();

    const config = await handleGetTokenAndConfig();
    try {
      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, config);
      }
      getOrders();
      toast.success("Selected orders deleted successfully");
      setSelectedIds([]);
    } catch (error) {
      toast.error("Failed to delete selected orders");
    }
  };

  // Filter orders by serial number
  const searchBySerial = (serial) => {
    if (serial) {
      const orders = listOfOrders.filter((order) =>
        order.serial.toString().startsWith(serial)
      );
      setListOfOrders(orders);
    } else {
      getOrders();
    }
  };

  // Filter orders by order type
  const getOrdersByType = (type) => {
    if (!type) {
      getOrders();
    } else {
      const orders = listOfOrders.filter((order) => order.orderType === type);
      setListOfOrders(orders.reverse());
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container-fluid py-3">
      {/* ✅ زر تبديل الوضع */}
      <div className="d-flex justify-content-end mb-3">
        <button
          onClick={toggleTheme}
          className={`btn btn-${isDarkMode ? "light" : "dark"} btn-sm`}
        >
          {isDarkMode ? "الوضع النهاري ☀️" : "الوضع الليلي 🌙"}
        </button>
      </div>

      {/* ✅ العنوان */}
      <div className="table-title mb-4">
        <h2 className="text-primary text-end">
          إدارة <b>الأوردرات</b>
        </h2>
      </div>

      {/* ✅ الفلاتر */}
      <div className="table-filter bg-body-tertiary p-3 rounded-3 shadow-sm mb-4">
        <div className="row g-3 align-items-end">
          {/* عدد العرض */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">عرض</label>
            <select
              className="form-select border-primary"
              onChange={(e) => {
                setStartPagination(0);
                setEndPagination(e.target.value);
              }}
            >
              {[...Array(19)].map((_, i) => {
                const val = (i + 1) * 5;
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
          </div>

          {/* رقم الفاتورة */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">رقم الفاتورة</label>
            <input
              type="text"
              className="form-control border-primary"
              placeholder="ابحث..."
              onChange={(e) => searchBySerial(e.target.value)}
            />
          </div>

          {/* نوع الأوردر */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">نوع الأوردر</label>
            <select
              className="form-select border-primary"
              onChange={(e) => getOrdersByType(e.target.value)}
            >
              <option value="">الكل</option>
              <option value="Internal">Internal</option>
              <option value="Delivery">Delivery</option>
              <option value="Takeaway">Takeaway</option>
            </select>
          </div>

          {/* فلترة حسب الوقت */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">فلترة حسب الوقت</label>
            <select
              className="form-select border-primary"
              onChange={(e) =>
                setListOfOrders(filterByTime(e.target.value, listOfOrders))
              }
            >
              <option value="">اختر</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذه السنة</option>
            </select>
          </div>

          {/* التاريخ من */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">من</label>
            <input
              type="date"
              className="form-control border-primary"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* التاريخ إلى */}
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label fw-semibold">إلى</label>
            <input
              type="date"
              className="form-control border-primary"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* أزرار البحث والاستعادة */}
          <div className="col-12 col-md-3 col-lg-2 d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary w-50"
              onClick={() => setListOfOrders(filterByDateRange(listOfOrders))}
            >
              <i className="fa fa-search"></i>
            </button>
            <button
              type="button"
              className="btn btn-warning w-50"
              onClick={getOrders}
            >
              استعادة
            </button>
          </div>
        </div>
      </div>

      <InvoiceComponent
        ModalId="invoiceOrderModal"
        orderData={orderData}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <div id="deleteOrderModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={handleDeleteOrder}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">Delete Order</h4>
                <button
                  type="button"
                  className="close m-0 p-1"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body text-center">
                <p className="text-right text-dark fs-3 fw-800 mb-2">
                  هل أنت متأكد من حذف هذا السجل؟
                </p>
                <p className="text-warning text-center mt-3">
                  <small>لا يمكن الرجوع في هذا الإجراء.</small>
                </p>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-warning  col-6 h-100 px-2 py-3 m-0"
                  value="حذف"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-toggle="modal"
                  data-dismiss="modal"
                  value="الغاء"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
