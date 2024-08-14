import React, { useState, useEffect, useRef,useContext } from 'react'
import { detacontext } from '../../../../App';

import '../orders/Orders.css'


const ReservationTables = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const { setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination, createReservations, confirmReservation, updateReservation, getAllReservations, allReservations, setallReservations, getReservationById, deleteReservation, employeeLoginInfo, allusers, allTable, getAvailableTables, availableTableIds, setStartDate, setEndDate,
    formatDate, formatTime , filterByDateRange, filterByTime} = useContext(detacontext)

  const createdBy = employeeLoginInfo?.id;
  const [reservationId, setReservationId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reservationNote, setReservationNote] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [tableInfo, setTableInfo] = useState({});
  const [reservationDate, setReservationDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startTimeClicked, setStartTimeClicked] = useState(false);
  const [endTimeClicked, setEndTimeClicked] = useState(false);



  const [userId, setUserId] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  const clientByName = (allusers, name) => {
    setCustomerName(name);
    const client = allusers.filter(user => user.username.startsWith(name) === true);
    setFilteredClients(client)
    const userId = client._id
    setUserId(userId)
    console.log(client);
    console.log(name);
    console.log(userId);
  }


  const searchByNum = (num) => {
    if(!num){
      getAllReservations()
      return
    }
    const tables = allReservations.filter((reservation) => reservation.tableNumber.toString().startsWith(num) === true)
    setallReservations(tables)
  }

  // const filterByStatus = (Status) => {
  //   const filter = allReservations.filter(table => reservation.isValid === Status)
  //   settableFiltered(filter)
  // }

  // const [selectedIds, setSelectedIds] = useState([]);
  // const handleCheckboxChange = (e) => {
  //   const Id = e.target.value;
  //   const isChecked = e.target.checked;

  //   if (isChecked) {
  //     setSelectedIds([...selectedIds, Id]);
  //   } else {
  //     const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
  //     setSelectedIds(updatedSelectedIds);
  //   }
  // };

  // const deleteSelectedIds = async (e) => {
  //   e.preventDefault();
  //   console.log(selectedIds)
  //   try{
  // if (!token) {
  // Handle case where token is not available
  //   toast.error('رجاء تسجيل الدخول مره اخري');
  // }
  //     for (const Id of selectedIds) {
  //       await axios.delete(`${apiUrl}/api/order/${Id}`);
  //     }
  //     getAllTable()
  //     toast.success('Selected orders deleted successfully');
  //     setSelectedIds([]);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Failed to delete selected orders');
  //   }
  // };

  const translateStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return 'تم التأكيد';
      case 'awaiting confirmation':
        return 'في انتظار التأكيد';
      case 'canceled':
        return 'تم الإلغاء';
      case 'Missed reservation time':
        return 'تم التخلف عن الميعاد';
      default:
        return status;
    }
  };



  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>ادارة <b>حجز الطاولات</b></h2>
              </div>
              <div className="col-12 col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center  justify-content-evenly">
                <a href="#createreservationModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal"> <span>انشاء حجز جديد</span></a>
                <a href="#deleteListTableModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal"> <span>حذف</span></a>
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">
                <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عرض</label>
                  <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                   {
                    (() => {
                      const options = [];
                      for (let i = 5; i < 100; i += 5) {
                        options.push(<option key={i} value={i}>{i}</option>);
                      }
                      return options;
                    })()
                  }
                  </select>
                </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByNum(e.target.value)} />
              </div>

              <div className='col-12 d-flex align-items-center justify-content-between flex-wrap'>
                <div className="filter-group d-flex align-items-center justify-content-between col-md-4 col-sm-12 p-0 mb-2">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => setallReservations(filterByTime(e.target.value, allReservations))}>
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="year">هذه السنه</option>
                  </select>
                </div>

                <div className="filter-group d-flex flex-wrap align-items-center col-md-8 col-sm-12">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0"><strong>مدة محددة:</strong></label>

                  <div className="d-flex align-items-center me-2">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">من</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex align-items-center me-2">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">إلى</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-primary me-2 p-2" onClick={() => setallReservations(filterByDateRange(allReservations))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning p-2" onClick={getAllReservations}>استعادة</button>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>رقم الطاولة</th>
                <th>الاسم</th>
                <th>الموبايل</th>
                <th>عدد الضيوف</th>
                <th>التاريخ</th>
                <th>من</th>
                <th>الي</th>
                <th>تاكيد</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {
                allReservations.map((reservation, i) => {
                  if (i >= startpagination & i < endpagination) {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{reservation.tableNumber}</td>
                        <td>{reservation.customerName}</td>
                        <td>{reservation.customerPhone}</td>
                        <td>{reservation.numberOfGuests}</td>
                        <td>{formatDate(reservation.reservationDate)}</td>
                        <td>{formatTime(reservation.startTime)}</td>
                        <td>{formatTime(reservation.endTime)}</td>
                        <td>
                          <select className="form-control border-primary m-0 p-2 h-auto"  name="status" id="status" onChange={(e) => confirmReservation(reservation._id, e.target.value)}>
                            <option >{translateStatus(reservation.status)}</option>
                            <option value='confirmed'>تاكيد</option>
                            <option value='awaiting confirmation'>انتظار التاكيد</option>
                            <option value='canceled'>الغاء</option>
                            <option value='Missed reservation time'>تخلف عن الميعاد</option>
                          </select>
                        </td>
                        <td>
                          <a href="#updatereservationModal" className="edit" data-toggle="modal" onClick={(e) => { setReservationId(reservation._id); setCustomerName(reservation.customerName); setCustomerPhone(reservation.customerPhone); setNumberOfGuests(reservation.numberOfGuests); setEndTime(reservation.endTime); setStartTime(reservation.startTime); setReservationDate(reservation.reservationDate); setReservationNote(reservation.reservationNotes); setTableInfo({ id: reservation.tableId, tableNumber: reservation.tableNumber }) }}
                          ><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        </td>
                      </tr>
                    )
                  }
                })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{allReservations.length > endpagination ? endpagination : allReservations.length}</b> من <b>{allReservations.length}</b> عنصر</div>
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
      <div id="createreservationModal" className="modal fade">
        <div className="modal-dialog ">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => createReservations(e, tableInfo.id, tableInfo.tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه حجز طاولة</h4>
                <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                <div className="container">
                  <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-12 col-md-8 mb-1">
                      <label htmlFor="name" className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                      <input type="text" className="form-control border-primary m-0 p-2 h-auto" id="name" onChange={(e) => clientByName(allusers, e.target.value)} />
                      <ul>
                        {filteredClients && filteredClients.map((client, index) => (
                          <li key={index}>{client.username}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="mobile" className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الموبايل</label>
                      <input type="tel" className="form-control border-primary m-0 p-2 h-auto" id="mobile" onChange={(e) => setCustomerPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="date" className="form-label text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                      <input
                        type="date"
                        className="form-control border-primary m-0 p-2 h-auto"
                        id="date"
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          setReservationDate(selectedDate);
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="arrivalTime" className="form-label text-wrap text-right fw-bolder p-0 m-0">وقت الحضور</label>
                      <input
                        type="time"
                        className="form-control border-primary m-0 p-2 h-auto"
                        id="arrivalTime"
                        required
                        onChange={(e) => {
                          setStartTimeClicked(true);
                          if (reservationDate) {
                            const StartedDate = new Date(reservationDate);
                            const timeParts = e.target.value.split(':');
                            console.log({ timeParts })
                            if (StartedDate) {
                              StartedDate.setHours(parseInt(timeParts[0]));
                              StartedDate.setMinutes(parseInt(timeParts[1]));
                              console.log({ StartedDate })
                              setStartTime(StartedDate);
                            }
                          } else {
                            e.target.value = ''
                          }
                        }}
                      />
                      {startTimeClicked && !reservationDate && (
                        <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="departureTime" className="form-label text-wrap text-right fw-bolder p-0 m-0">وقت الانصراف</label>
                      <input
                        type="time"
                        className="form-control border-primary m-0 p-2 h-auto"
                        id="departureTime"
                        required
                        onChange={(e) => {
                          setEndTimeClicked(true);
                          if (reservationDate) {
                            const EndedDate = new Date(reservationDate);
                            const timeParts = e.target.value.split(':');
                            console.log({ timeParts })
                            if (EndedDate) {
                              EndedDate.setHours(parseInt(timeParts[0]));
                              EndedDate.setMinutes(parseInt(timeParts[1]));
                              console.log({ EndedDate })
                              setEndTime(EndedDate);
                              getAvailableTables(reservationDate, startTime, EndedDate)
                            }
                          } else {
                            e.target.value = ''
                          };

                        }}
                      />
                      {endTimeClicked && !reservationDate && (
                        <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-12 col-md-7">
                      <label htmlFor="tableNumber" className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                      <select className="form-select border-primary col-12" id="tableNumber" onChange={(e) => setTableInfo({ id: e.target.value, tableNumber: e.target.options[e.target.selectedIndex].text })}>
                        <option>الطاولات المتاحة في هذا الوقت</option>
                        {allTable.map((table, i) => (
                          availableTableIds.includes(table._id) && (
                            <option key={i} value={table._id}>{table.tableNumber}</option>
                          )
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-5">
                      <label htmlFor="numberOfGuests" className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد الضيوف</label>
                      <input type="number" className="form-control border-primary m-0 p-2 h-auto" id="numberOfGuests" onChange={(e) => setNumberOfGuests(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <label htmlFor="notes" className="form-label text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                    <textarea className="form-control border-primary m-0 p-2 h-auto" id="notes" rows="2" onChange={(e) => setReservationNote(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="ضافه" />
                <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div >
      </div >


      <div id="updatereservationModal" className="modal fade">
        <div className="modal-dialog ">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => updateReservation(e, reservationId, tableInfo.id, tableInfo.tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه حجز طاولة</h4>
                <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                <div className="container">
                  <div className='row'>
                    <div className="col-12 col-md-7 mb-1">
                      <label htmlFor="name" className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                      <input type="text" className="form-control border-primary m-0 p-2 h-auto" id="name" onChange={(e) => clientByName(allusers, e.target.value)} />
                      <ul>
                        {filteredClients && filteredClients.map((client, index) => (
                          <li key={index}>{client.username}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-12 col-md-5 mb-1">
                      <label htmlFor="mobile" className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الموبايل</label>
                      <input type="tel" className="form-control border-primary m-0 p-2 h-auto" id="mobile" defaultValue={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="row mb-1">
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="date" className="form-label text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                      <input
                        type="date"
                        className="form-control border-primary m-0 p-2 h-auto"
                        id="date"
                        defaultValue={reservationDate ? new Date(reservationDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          setReservationDate(selectedDate);
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-1">
                      <label className="form-label text-wrap text-right fw-bolder p-0 m-0">وقت الحضور</label>
                      <input
                        type="time"
                        className="form-control border-primary m-0 p-2 h-auto"
                        required
                        defaultValue={startTime ? new Date(startTime).toISOString().split('T')[1].slice(0, 5) : ''}
                        onChange={(e) => {
                          setStartTimeClicked(true);
                          if (reservationDate) {
                            const StartedDate = new Date(reservationDate);
                            const timeParts = e.target.value.split(':');
                            console.log({ timeParts })
                            if (StartedDate) {
                              StartedDate.setHours(parseInt(timeParts[0]));
                              StartedDate.setMinutes(parseInt(timeParts[1]));
                              console.log({ StartedDate })
                              setStartTime(StartedDate);
                            }
                          } else {
                            e.target.value = ''
                          }
                        }}
                      />
                      {startTimeClicked && !reservationDate && (
                        <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 mb-1">
                      <label htmlFor="departureTime" className="form-label text-wrap text-right fw-bolder p-0 m-0">وقت الانصراف</label>
                      <input
                        type="time"
                        className="form-control border-primary m-0 p-2 h-auto"
                        id="departureTime"
                        required
                        defaultValue={endTime ? new Date(endTime).toISOString().split('T')[1].slice(0, 5) : ''}
                        onChange={(e) => {
                          setEndTimeClicked(true);
                          if (reservationDate) {
                            const EndedDate = new Date(reservationDate);
                            const timeParts = e.target.value.split(':');
                            console.log({ timeParts })
                            if (EndedDate) {
                              EndedDate.setHours(parseInt(timeParts[0]));
                              EndedDate.setMinutes(parseInt(timeParts[1]));
                              console.log({ EndedDate })
                              setEndTime(EndedDate);
                              getAvailableTables(reservationDate, startTime, EndedDate)
                            }
                          } else {
                            e.target.value = ''
                          }
                        }}
                      />
                      {endTimeClicked && !reservationDate && (
                        <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-1">
                    <div className="col-12 col-md-7">
                      <label htmlFor="tableNumber" className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الطاولة</label>
                      <select className="form-select border-primary col-12" id="tableNumber" defaultValue={tableInfo.tableNumber} onChange={(e) => setTableInfo({ id: e.target.value, tableNumber: e.target.options[e.target.selectedIndex].text })}>
                        <option>{tableInfo.tableNumber}</option>
                        <option>الطاولات المتاحة في هذا الوقت</option>
                        {allTable.map((table, i) => (
                          availableTableIds.includes(table._id) && (
                            <option key={i} value={table._id}>{table.tableNumber}</option>
                          )
                        ))}

                      </select>
                    </div>
                    <div className="col-12 col-md-5">
                      <label htmlFor="numberOfGuests" className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد الضيوف</label>
                      <input type="number" className="form-control border-primary m-0 p-2 h-auto" id="numberOfGuests" defaultValue={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <label htmlFor="notes" className="form-label text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                    <textarea className="form-control border-primary m-0 p-2 h-auto" id="notes" rows="2" defaultValue={reservationNote} onChange={(e) => setReservationNote(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="ضافه" />
                <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div >
      </div >
    </div >
  )
}

export default ReservationTables