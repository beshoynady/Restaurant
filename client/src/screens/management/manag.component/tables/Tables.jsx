import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const Tables = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const { permissionsList, restaurantData, setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination,
    startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const [tableid, settableid] = useState("")
  const [qrimage, setqrimage] = useState("")
  const [listoftable, setlistoftable] = useState([]);
  const [listoftabledescription, setlistoftabledescription] = useState([]);
  const [tableNumber, settableNumber] = useState(0);
  const [chairs, setchairs] = useState(0);
  const [sectionNumber, setsectionNumber] = useState();
  const [tabledesc, settabledesc] = useState("");
  const [isValid, setisValid] = useState();


  // Function to create a new table
  const createTable = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
      }
      // Ensure token exists
      if (!token) {
        throw new Error("must login");
      }

      // Prepare table data
      const tableData = {
        description: tabledesc,
        tableNumber,
        chairs,
        sectionNumber,
        isValid
      };

      // Send request to create table
      const response = await axios.post(`${apiUrl}/api/table/`, tableData, config);

      // Check response status
      if (response.status === 200) {
        // Log success message
        console.log("Table created successfully:", response.data);

        // Update table list
        getAllTable();

        // Show success toast
        toast.success("تم إنشاء الطاولة بنجاح.");
      } else {
        // Handle unexpected response
        throw new Error("Unexpected response while creating table.");
      }
    } catch (error) {
      // Log and show error message
      console.error("Error creating table:", error);
      toast.error("حدث خطأ أثناء إنشاء الطاولة. الرجاء المحاولة مرة أخرى.");
    }
  }


  // Function to edit an existing table
  const editTable = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
      }
      const response = await axios.put(`${apiUrl}/api/table/${tableid}`, { "description": tabledesc, tableNumber, chairs, sectionNumber, isValid }, config);
      console.log(response.data);
      getAllTable();
    } catch (error) {
      console.error("Error editing table:", error);
    }
  }
  // Function to create QR code for the table URL
  const createQR = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {

      const URL = `https://${window.location.hostname}/${tableid}`;
      const qr = await axios.post(apiUrl + '/api/table/qr', { URL }, config);
      setqrimage(qr.data);
      toast.success('تم إنشاء رمز QR بنجاح!');
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء رمز QR:", error);
      toast.error('حدث خطأ أثناء إنشاء رمز QR!');
    }
  }

  // Function to create web QR code
  const createwebQR = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {

      const URL = `https://${window.location.hostname}/`;
      const qr = await axios.post(apiUrl + '/api/table/qr', { URL }, config);
      setqrimage(qr.data);
      toast.success('تم إنشاء رمز QR بنجاح!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000
      });
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء رمز QR للويب:", error);
      // عرض رسالة خطأ باستخدام toast
      toast.error('حدث خطأ أثناء إنشاء رمز QR للويب!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
    }
  }

  // Function to get all tables
  const getAllTable = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/table');
      const tables = response.data;
      setlistoftable(tables);
      const descriptions = tables.map(table => table.description);
      setlistoftabledescription(prevDescription => [...prevDescription, ...descriptions]);
    } catch (error) {
      console.error("Error getting all tables:", error);
    }
  };



  // Function to delete a table
  const deleteTable = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.delete(`${apiUrl}/api/table/${tableid}`, config);
      console.log(response.data);
      settableid(null);
      getAllTable();
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  }


  const searchByNum = (num) => {
    if (!num) {
      getAllTable()
      return
    }
    const tables = listoftable.filter((table) => table.tableNumber.toString().startsWith(num) === true)
    setlistoftable(tables)
  }
  const filterByStatus = (Status) => {
    if (!Status) {
      getAllTable()
      return
    }
    const filter = listoftable.filter(table => table.isValid === Status)
    setlistoftable(filter)
  }

  const printtableqr = useRef()
  const handlePrinttableqr = useReactToPrint({
    content: () => printtableqr.current,
    copyStyles: true,
    removeAfterPrint: true,
  });
  const printwepqr = useRef()
  const handlePrintwepqr = useReactToPrint({
    content: () => printwepqr.current,
    copyStyles: true,
    removeAfterPrint: true,
  });

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
        await axios.delete(`${apiUrl}/api/table/${Id}`, config);
      }
      getAllTable()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };




  useEffect(() => {
    getAllTable()
  }, [])

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-12 col-md-4">
                <h2>ادارة <b>الطاولات</b></h2>
              </div>
              <div className="col-12 col-md-8 d-flex flex-wrap align-items-center justify-content-between">
                <a href="#qrwebModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-info"
                  data-toggle="modal"><span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                  <span>انشاء qr للسايت</span></a>
                <a href="#addTableModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-success"
                  data-toggle="modal"> <span>اضافه طاولة جديدة</span></a>
                <a href="#deleteListTableModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-danger"
                  data-toggle="modal"> <span>حذف</span></a>
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-between p-0 m-0">
              <div className="show-entries d-flex flex-wrap align-items-center justify-content-evenly col-2 p-0 m-0">
                <span>عرض</span>
                <select className="form-select border-primary col-6 px-1 py-2 m-0" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={35}>35</option>
                  <option value={40}>40</option>
                  <option value={45}>45</option>
                  <option value={50}>50</option>
                </select>

              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByNum(e.target.value)} />
              </div>

              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الحالة</label>
                <select className="form-control border-primary m-0 p-2 h-auto" name="Status" id="Status" form="carform"
                  onChange={(e) => filterByStatus(e.target.value)}>
                  <option value="">اختر</option>
                  <option value={true} >متاح</option>
                  <option value={false} >غير متاح</option>
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
                <th>رقم الطاولة</th>
                <th>الوصف</th>
                <th>عدد المقاعد</th>
                <th>السكشن</th>
                <th>متاح</th>
                {/* <th>الحجز</th> */}
                <th>QR</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listoftable.map((table, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>
                        <span className="custom-checkbox">
                          <input
                            type="checkbox"
                            id={`checkbox${i}`}
                            name="options[]"
                            value={table._id}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`checkbox${i}`}></label>
                        </span>
                      </td>
                      <td>{i + 1}</td>
                      <td>{table.tableNumber}</td>
                      <td>{table.description}</td>
                      <td>{table.chairs}</td>
                      <td>{table.sectionNumber}</td>
                      <td>{table.isValid ? 'متاح' : 'غير متاح'}</td>

                      {/* <td>{table.reservation ? "Reserved" : "Unreserved"}</td> */}
                      <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setqrimage('') }}>
                        <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                      </a></td>
                      <td>
                        <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setchairs(table.chairs); settabledesc(table.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteTableModal" className="delete" data-toggle="modal" onClick={() => settableid(table._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{listoftable.length > endpagination ? endpagination : listoftable.length}</b> من <b>{listoftable.length}</b> عنصر</div>
            <ul className="pagination">
              <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 5 ? 'active' : ''}`}><a href="#" className="page-link">1</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 10 ? 'active' : ''}`}><a href="#" className="page-link">2</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 15 ? 'active' : ''}`}><a href="#" className="page-link">3</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 20 ? 'active' : ''}`}><a href="#" className="page-link">4</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 25 ? 'active' : ''}`}><a href="#" className="page-link">5</a></li>
              <li onClick={EditPagination} className={`page-item ${endpagination === 30 ? 'active' : ''}`}><a href="#" className="page-link">التالي</a></li>
            </ul>
          </div>
        </div>
      </div>


      <div id="addTableModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createTable}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه طاولة</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم السكشن</label>
                  <input type="Number" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setsectionNumber(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tableNumber : ""} className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => settableNumber(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد المقاعد</label>
                  <input type="Number" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setchairs(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                  <textarea className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className=" btn btn-success col-6 h-100 p-0 m-0" value="ضافه" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {tableid && <div id="editTableModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={editTable}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل طاولة</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6  ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم السكشن</label>
                  <input type="Number" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setsectionNumber(e.target.value)} />
                </div>
                <div className="form-group px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6  ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tableNumber : ""} className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => settableNumber(e.target.value)} />
                </div>
                <div className="form-group px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6  ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد المقاعد</label>
                  <input type="Number" defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id === tableid).chairs : ''} className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setchairs(e.target.value)} />
                </div>
                <div className="form-group px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6  ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                  <textarea defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id === tableid).description : ""} className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                </div>
                <div className="form-group px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6  ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">متاح</label>
                  <select className="form-control border-primary m-0 p-2 h-auto" name="category" id="category" form="carform" onChange={(e) => setisValid(e.target.value)}>
                    <option value="">اختر</option>
                    <option value={true} >متاح</option>
                    <option value={false} >غير متاح</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                <input type="submit" className=" btn btn-info col-6 h-100 p-0 m-0" value="حفظ" />
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>}


      <div id="qrTableModal" className="modal fade">
        <div className="modal-dialog col-10 col-md-5 h-75">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createQR}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">استخراج QR</h4>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div ref={printtableqr} className="form-group qrprint w-100 h-auto p-3 d-flex align-items-center justify-content-center">
                  <div className="w-100 text-center">
                    <p className="mb-3 text-nowrap text-center" style={{ fontSize: '26px', fontFamily: 'Noto Nastaliq Urdu , serif' }}>طاولة رقم {tableNumber}</p>
                    {qrimage && (
                      <a href={qrimage} download>
                        <img src={qrimage} className="img-fluid  w-100 h-75" alt="QR Code" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                {qrimage ? (
                  <button type="button" className="col-6 btn p-3 m-0 btn-info" onClick={handlePrinttableqr}>طباعة</button>
                ) : (
                  <input type="submit" className="col-6 btn p-3 m-0 btn-success" value="استخراج" />
                )}
                <button type="button" className="col-6 btn p-3 m-0 btn-danger" data-dismiss="modal" >اغلاق</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="qrwebModal" className="modal fade">
        <div className="modal-dialog col-10 col-md-5 h-75">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createwebQR}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">استخراج QR</h4>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div ref={printwepqr} className="form-group qrprint w-100 h-auto p-3 d-flex align-items-center justify-content-center">
                  <div className="w-100 text-center">
                    <p className="mb-3" style={{ fontSize: '26px', fontFamily: 'Noto Nastaliq Urdu , serif' }}>{restaurantData && restaurantData.name}</p>
                    {qrimage && (
                      <a href={qrimage} download>
                        <img src={qrimage} className="img-fluid  w-100 h-75" alt="QR Code" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                {qrimage ? (
                  <button type="button" className="col-6 btn p-3 m-0 btn-info" onClick={handlePrintwepqr}>طباعة</button>
                ) : (
                  <input type="submit" className="col-6 btn p-3 m-0 btn-success" value="استخراج" />
                )}
                <button type="button" className="col-6 btn p-3 m-0 btn-danger" data-dismiss="modal">اغلاق</button>
              </div>
            </form>
          </div>
        </div>
      </div>



      <div id="deleteTableModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteTable}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف طاولة</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <p>هل انت متاكد من حذف هذا السجل؟?</p>
                <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                <input type="submit" className=" btn btn-warning col-6 h-100 p-0 m-0" value="حذف" />
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="deleteListTableModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteSelectedIds}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف طاولة</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <p>هل انت متاكد من حذف هذا السجل؟?</p>
                <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
              </div>
              <div className="modal-footer p-0 m-0 d-flex flex-nowrap align-items-center justify-content-between">
                <input type="submit" className=" btn btn-warning col-6 h-100 p-0 m-0" value="حذف" />
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tables