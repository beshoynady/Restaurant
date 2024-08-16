import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'





const CashRegister = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const [cashRegisters, setCashRegisters] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [name, setname] = useState('');
  const [balance, setbalance] = useState('');
  const [employee, setemployee] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [cashID, setcashID] = useState('');

  // Fetch employees
  const getEmployees = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {

      const response = await axios.get(`${apiUrl}/api/employee`, config);
      const data = response.data;
      setallEmployee(data);
    } catch (error) {
      if (error.response) {
        // يتم استخدام هذا الجزء إذا تم استرداد استجابة من الخادم برمز الحالة خاطئ
        console.error('Server responded with status code:', error.response.status);
        console.error('Error message:', error.response.data);
        toast.error('An error occurred while fetching employees. Please try again later.');
      } else if (error.request) {
        // يتم استخدام هذا الجزء إذا تم إرسال الطلب ولكن لم يتم الرد عليه بأي شكل
        console.error('No response received from server.');
        toast.error('No response received from server. Please check your internet connection.');
      } else {
        // يتم استخدام هذا الجزء لأي أخطاء أخرى تم التقاطها
        console.error('An unexpected error occurred:', error.message);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };


  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/cashregister', config);
      setCashRegisters(response.data.reverse());
    } catch (err) {
      console.error('Error fetching cash registers:', err);
      toast.error('An error occurred while fetching cash registers. Please try again later.');
    }
  };

  // Fetch a cash register by ID
  const getCashRegisterById = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(`${apiUrl}/api/cashregister/${cashID}`, config);
      // Handle response (e.g., display details, update state)
    } catch (err) {
      toast.error('Cash register not found');
    }
  };

  // Create a new cash register
  const createCashRegister = async (e) => {
    e.preventDefault()
    const newCashRegister = { name, balance, employee };
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.post(apiUrl + '/api/cashregister', newCashRegister, config);
      console.log(response);
      toast.success('Cash register created successfully');
      getAllCashRegisters()
    } catch (err) {
      console.log(err);
      toast.error('Failed to create cash register');
    }
  };

  // Update a cash register
  const updateCashRegister = async (e) => {
    e.preventDefault()
    const updatedCashRegister = { name, balance, employee };
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.put(`${apiUrl}/api/cashregister/${cashID}`, updatedCashRegister, config);
      toast.success('Cash register updated successfully');
      getAllCashRegisters()
    } catch (err) {
      toast.error('Failed to update cash register');
    }
  };

  // Delete a cash register
  const deleteCashRegister = async (e) => {
    e.preventDefault()
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.delete(`${apiUrl}/api/cashregister/${cashID}`, config);
      toast.success('Cash register deleted successfully');
    } catch (err) {
      toast.error('Failed to delete cash register');
    }
  };

  // Filter cash registers by employee ID
  const filterCashRegistersByEmployee = (employeeid) => {
    if (!employeeid) {
      getAllCashRegisters()
      return
    }
    const filteredRegisters = cashRegisters.filter(register => register.employee._id === employeeid);
    setCashRegisters(filteredRegisters);
  };

  // Filter cash registers by name (startsWith comparison)
  const filterCashRegistersByName = (cashName) => {
    if (!cashName) {
      getAllCashRegisters()
      return
    }
    const filteredRegisters = cashRegisters.filter(register => register.name.startsWith(cashName));
    setCashRegisters(filteredRegisters);
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
    console.log(selectedIds)
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, config);
      }
      getAllCashRegisters()
      getEmployees()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };

  useEffect(() => {
    // Fetch initial data on component mount
    getAllCashRegisters()
    getEmployees()
  }, [])

  return (
    <detacontext.Consumer>
      {({ setisLoadiog, EditPagination,  startpagination, endpagination, setstartpagination, setendpagination }) => {
        return (
          <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
            <div className="table-responsive">
              <div className="table-wrapper p-3 mw-100">
                <div className="table-title">
                  <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="text-right">
                      <h2>ادارة <b>الخزينه</b></h2>
                    </div>
                    <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                      <a href="#addCashRegisterModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal"> <span>اضافه خزنه</span></a>
                      <a href="#deleteListCashRegisterModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal"> <span>حذف</span></a>
                    </div>
                  </div>
                </div>
                <div class="table-filter print-hide">
                  <div className="row text-dark d-flex flex-wrap align-items-center justify-content-between p-0 m-0">
                    <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                      <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عرض</label>
                      <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={30}>30</option>
                      </select>
                    </div>

                    <div className="filter-group d-flex align-items-center justify-content-evenly col-md-3 mb-1">
                      <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم الخزينة</label>
                      <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => filterCashRegistersByName(e.target.value)} />
                    </div>

                    <div className="filter-group d-flex align-items-center justify-content-evenly col-md-3 mb-1">
                      <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المسؤول</label>
                      <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => filterCashRegistersByEmployee(e.target.value)}>
                        <option value="">اختر</option>
                        {allEmployee && allEmployee.map((Employee, i) => (
                          <option value={Employee._id} key={i}>{Employee.username}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>
                        <span className="custom-checkbox">
                          <input type="checkbox" className="form-check-input form-check-input-lg" id="selectAll" />
                          <label htmlFor="selectAll"></label>
                        </span>
                      </th>
                      <th>م</th>
                      <th>الخزينة</th>
                      <th>المسؤل</th>
                      <th>الرصيد</th>
                      <th>اجراءات</th>
                    </tr>

                  </thead>
                  <tbody>
                    {cashRegisters.length > 0 ? cashRegisters.map((cashRegister, i) => {
                      if (i >= startpagination & i < endpagination) {
                        return (
                          <tr key={i}>
                            <td>
                              <span className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  id={`checkbox${i}`}
                                  name="options[]"
                                  value={cashRegister._id}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`checkbox${i}`}></label>
                              </span>
                            </td>
                            <td>{i + 1}</td>
                            <td>{cashRegister.name}</td>
                            <td>{cashRegister.employee?.fullname}</td>
                            <td>{cashRegister.balance}</td>
                            <td>
                              <a href="#editCashRegisterModal" className="edit" data-toggle="modal" onClick={() => {
                                setcashID(cashRegister._id);
                                setname(cashRegister.name);
                                setemployee(cashRegister.employee._id);
                                setemployeeName(cashRegister.employee?.fullname);
                                setbalance(cashRegister.balance)
                              }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                              <a href="#deleteCashRegisterModal" className="delete" data-toggle="modal" onClick={() => setcashID(cashRegister._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            </td>
                          </tr>
                        )
                      }
                    })
                      : ''}

                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text text-dark">عرض <b>{cashRegisters.length > endpagination ? endpagination : cashRegisters.length}</b> من <b>{cashRegisters.length}</b> عنصر</div>
                  <ul className="pagination">
                    <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div id="addCashRegisterModal" className="modal fade">
              <div className="modal-dialog modal-lg">
                <div className="modal-content shadow-lg border-0 rounded ">
                  <form onSubmit={createCashRegister}>
                    <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                      <h4 className="modal-title">اضافه خزينه</h4>
                      <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                        <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                        <input type="text" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setname(e.target.value)} />
                      </div>
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                        <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المسؤل</label>
                        <select className="form-control border-primary m-0 p-2 h-auto" name="Employee" id="Employee" form="carform" onChange={(e) => setemployee(e.target.value)}>
                          <option>احتر الموظف</option>
                          {allEmployee.map((Employee, i) => {
                            return <option value={Employee._id} key={i} >{Employee.username}</option>
                          })
                          }
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                      <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="اضافه" />
                      <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="editCashRegisterModal" className="modal fade">
              <div className="modal-dialog modal-lg">
                <div className="modal-content shadow-lg border-0 rounded ">
                  <form onSubmit={updateCashRegister}>
                    <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                      <h4 className="modal-title">تعديل التصنيف</h4>
                      <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12">
                        <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                        <input type="text" className="form-control border-primary m-0 p-2 h-auto" required defaultValue={name} onChange={(e) => setname(e.target.value)} />
                      </div>
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12">
                        <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المسؤل</label>
                        <select className="form-control border-primary m-0 p-2 h-auto" name="category" id="category" form="carform" defaultValue={employee} onChange={(e) => setemployee(e.target.value)}>
                          <option value={employee}>{employeeName}</option>
                          {allEmployee.length > 0 ? allEmployee.map((Employee, i) => {
                            return <option value={Employee._id} key={i} >{Employee.username}</option>
                          })
                            : ""}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                      <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="حفظ" />
                      <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="deleteCashRegisterModal" className="modal fade">
              <div className="modal-dialog modal-lg">
                <div className="modal-content shadow-lg border-0 rounded ">
                  <form onSubmit={deleteCashRegister}>
                    <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                      <h4 className="modal-title">حذف تصنيف</h4>
                      <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body text-center">
                      <p className="text-right text-dark fs-3 fw-800 mb-2">هل أنت متأكد من حذف هذا السجل؟</p>
                      <p className="text-warning text-center mt-3"><small>لا يمكن الرجوع في هذا الإجراء.</small></p>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                      <input type="submit" className="btn btn-warning col-6 h-100 px-2 py-3 m-0" value="حذف" />
                      <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="deleteListCashRegisterModal" className="modal fade">
              <div className="modal-dialog modal-lg">
                <div className="modal-content shadow-lg border-0 rounded ">
                  <form onSubmit={deleteSelectedIds}>
                    <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                      <h4 className="modal-title">حذف الخزن المحدده</h4>
                      <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body text-center">
                      <p className="text-right text-dark fs-3 fw-800 mb-2">هل أنت متأكد من حذف هذا السجل؟</p>
                      <p className="text-warning text-center mt-3"><small>لا يمكن الرجوع في هذا الإجراء.</small></p>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                      <input type="submit" className="btn btn-warning col-6 h-100 px-2 py-3 m-0" value="حذف" />
                      <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      }
      }
    </detacontext.Consumer>
  )


}

export default CashRegister