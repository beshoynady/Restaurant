import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { detacontext } from "../../../../App";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import "./Orders.css";
import InvoiceComponent from "../invoice/invoice";

const Orders = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token_e"); // Retrieve the token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
    setisLoadiog,
    EditPagination,
    startpagination,
    endpagination,
    setstartpagination,
    setendpagination,
  } = useContext(detacontext);

  const [showModal, setShowModal] = useState(false);

  const [listOfOrders, setlistOfOrders] = useState([]);
  // Fetch orders from API
  const getOrders = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error("رجاء تسجيل الدخول مره اخري");
      return;
    }
    try {
      const res = await axios.get(apiUrl + "/api/order", config);
      const ordersData = res.data.reverse();
      setlistOfOrders(ordersData);
      console.log({ ordersData });
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };
  const [listProductsOrder, setlistProductsOrder] = useState([]);
  const [orderData, setorderData] = useState("");
  const [ivocedate, setivocedate] = useState(new Date());

  // Fetch orders from API
  const getOrderDataBySerial = async (serial) => {
    if (!token) {
      // Handle case where token is not available
      toast.error("رجاء تسجيل الدخول مره اخري");
      return;
    }
    try {
      const res = await axios.get(apiUrl + "/api/order", config);
      const order = res.data.find((order) => order.serial === serial);
      if (order) {
        setorderData(order);
        setlistProductsOrder(order.products);
      }
    } catch (error) {
      console.log(error);
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
  const deleteOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error("رجاء تسجيل الدخول مره اخري");
      return;
    }
    try {
      const id = orderId;
      await axios.delete(`${apiUrl}/api/order/${id}`, config);
      getOrders();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
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
    console.log(selectedIds);
    if (!token) {
      // Handle case where token is not available
      toast.error("رجاء تسجيل الدخول مره اخري");
      return;
    }
    try {
      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, config);
      }
      getOrders();
      toast.success("Selected orders deleted successfully");
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete selected orders");
    }
  };

  // Filter orders by serial number
  const searchBySerial = (serial) => {
    if (serial) {
      const orders = listOfOrders.filter((order) =>
        order.serial.toString().startsWith(serial)
      );
      setlistOfOrders(orders);
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
      setlistOfOrders(orders.reverse());
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>
                  ادارة <b>الاوردرات</b>
                </h2>
              </div>
              {/* <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                        <a href="#addOrderModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal"> <span>اضافة اوردر جديد</span></a>
                        <a href="#deleteListOrderModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal" > <span>حذف</span></a>
                      </div> */}
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                  عرض
                </label>
                <select
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) => {
                    setstartpagination(0);
                    setendpagination(e.target.value);
                  }}
                >
                  {(() => {
                    const options = [];
                    for (let i = 5; i < 100; i += 5) {
                      options.push(
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </div>

              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                  رقم الفاتورة
                </label>
                <input
                  type="text"
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) => searchBySerial(e.target.value)}
                />
              </div>

              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                  نوع الاوردر
                </label>
                <select
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) => getOrdersByType(e.target.value)}
                >
                  <option value={""}>الكل</option>
                  <option value="Internal">Internal</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Takeaway">Takeaway</option>
                </select>
                {/* <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">Status</label>
                  <select className="form-control border-primary m-0 p-2 h-auto">
                    <option>Any</option>
                    <option>Delivered</option>
                    <option>Shipped</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <span className="filter-icon"><i className="fa fa-filter"></i></span> */}
              </div>

              <div className="col-12 d-flex align-items-center justify-content-between">
                <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    فلتر حسب الوقت
                  </label>
                  <select
                    className="form-control border-primary m-0 p-2 h-auto"
                    onChange={(e) =>
                      setlistOfOrders(
                        filterByTime(e.target.value, listOfOrders)
                      )
                    }
                  >
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="month">هذه السنه</option>
                  </select>
                </div>

                <div className="d-flex align-items-stretch justify-content-between flex-nowrap p-0 m-0 px-1">
                  <label className="form-label text-nowrap">
                    <strong>مدة محددة:</strong>
                  </label>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                      من
                    </label>
                    <input
                      type="date"
                      className="form-control border-primary m-0 p-2 h-auto"
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="اختر التاريخ"
                    />
                  </div>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                      إلى
                    </label>
                    <input
                      type="date"
                      className="form-control border-primary m-0 p-2 h-auto"
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="اختر التاريخ"
                    />
                  </div>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <button
                      type="button"
                      className="btn btn-primary h-100 p-2 "
                      onClick={() =>
                        setlistOfOrders(filterByDateRange(listOfOrders))
                      }
                    >
                      <i className="fa fa-search"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning h-100 p-2" onClick={getOrders}
                    >
                      استعادة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {/* <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" className="form-check-input form-check-input-lg" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th> */}
                <th>م</th>
                <th>رقم الفاتورة</th>
                <th>رقم الاوردر</th>
                <th>العميل</th>
                <th>المكان</th>
                <th>الاجمالي</th>
                <th>حالة الطلب</th>
                <th>الكاشير</th>
                <th>حالة الدفع</th>
                <th>تاريخ الدفع</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listOfOrders &&
                listOfOrders.map((order, i) => {
                  if ((i >= startpagination) & (i < endpagination)) {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <a
                            data-toggle="modal"
                            data-target="#invoiceOrderModal"
                            onClick={() => {
                              getOrderDataBySerial(order.serial);
                              setShowModal(!showModal);
                            }}
                          >
                            {order.serial}{" "}
                          </a>
                        </td>

                        <td>{order.orderNum ? order.orderNum : "--"}</td>
                        <td>
                          {order.table != null
                            ? order.table.tableNumber
                            : order.user
                            ? order.user?.username
                            : order.createdBy
                            ? order.createdBy?.fullname
                            : "--"}
                        </td>

                        <td>{order.orderType}</td>
                        <td>{order.total}</td>
                        <td>{order.status}</td>
                        <td>{order.cashier && order.cashier.fullname}</td>
                        <td>{order.payment_status}</td>
                        <td>
                          {formatDateTime(order.payment_date)}
                        </td>

                        <td>
                          {/* <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> */}
                          <a
                            href="#deleteOrderModal"
                            className="delete"
                            data-toggle="modal"
                            onClick={() => setOrderId(order._id)}
                          >
                            <i
                              className="material-icons"
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              &#xE872;
                            </i>
                          </a>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">
              عرض{" "}
              <b>
                {listOfOrders.length > endpagination
                  ? endpagination
                  : listOfOrders.length}
              </b>{" "}
              من <b>{listOfOrders.length}</b> عنصر
            </div>
            <ul className="pagination">
              <li onClick={EditPagination} className="page-item disabled">
                <a href="#">السابق</a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 5 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  1
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 10 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  2
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 15 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  3
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 20 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  4
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 25 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  5
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endpagination === 30 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  التالي
                </a>
              </li>
            </ul>
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
            <form onSubmit={deleteOrder}>
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
