import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css';

const Store = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { restaurantData, permissionsList, setStartDate, setEndDate, filterByDateRange, filterByTime,
    employeeLoginInfo, formatDate, formatDateTime, setisLoading, EditPagination, startpagination,
    endpagination, setstartpagination, setendpagination } = useContext(detacontext);

  const storePermissions = permissionsList?.find(permission => permission.resource === 'store');

  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [storekeeper, setStorekeeper] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [storeId, setStoreId] = useState('');

  const [allStores, setAllStores] = useState([]);
  const [allStockItems, setAllStockItems] = useState([]);

  const getAllStores = async () => {
    if (!token) {
      toast.error('رجاء تسجيل الدخول مره اخري');
      return;
    }

    try {
      if (storePermissions && !storePermissions.read) {
        toast.warn('ليس لك صلاحية لعرض تصنيفات المخزن');
        return;
      }
      const response = await axios.get(apiUrl + "/api/store/", config);
      setAllStores(response.data.reverse());
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('حدث خطأ اثناء جلب بيانات التصنيفات! اعد تحميل الصفحة');
    }
  };

  const getAllStockItems = async () => {
    try {
      if (!token) {
        toast.error('رجاء تسجيل الدخول مره اخري');
        return;
      }
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      setAllStockItems(response.data.reverse());
    } catch (error) {
      console.log('Error fetching stock items:', error);
    }
  };

  const createStore = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('رجاء تسجيل الدخول مره اخري');
      return;
    }

    try {
      if (storePermissions && !storePermissions.create) {
        toast.warn('ليس لك صلاحية لاضافه تصنيفات المخزن');
        return;
      }

      if (!storeName.trim() || !storeCode.trim() || !description.trim() || !address.trim() || !storekeeper.trim() || !createdBy.trim()) {
        toast.error("جميع الحقول مطلوبة");
        return;
      }

      const response = await axios.post(apiUrl + "/api/store/", {
        storeName,
        storeCode,
        description,
        address,
        storekeeper,
        createdBy
      }, config);

      if (response.status === 201) {
        toast.success("تم إنشاء المتجر بنجاح");
        getAllStores();
      } else {
        toast.error("حدث خطأ أثناء إنشاء المتجر. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(error.response?.data?.error === 'Store name already exists' ? 'هذا المتجر موجود بالفعل' : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  };

  const editStore = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('رجاء تسجيل الدخول مره اخري');
      return;
    }

    try {
      if (storePermissions && !storePermissions.update) {
        toast.warn('ليس لك صلاحية لتعديل تصنيفات المخزن');
        return;
      }

      if (!storeName.trim() || !storeCode.trim() || !description.trim() || !address.trim() || !storekeeper.trim() || !createdBy.trim()) {
        toast.error("جميع الحقول مطلوبة");
        return;
      }

      const response = await axios.put(apiUrl + "/api/store/" + storeId, {
        storeName,
        storeCode,
        description,
        address,
        storekeeper,
        createdBy
      }, config);

      if (response.status === 200) {
        toast.success("تم تعديل المتجر بنجاح");
        getAllStores();
        getAllStockItems();
      } else {
        toast.error("حدث خطأ أثناء تعديل المتجر. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.log("Error editing store:", error);
      toast.error("حدث خطأ أثناء تعديل المتجر. يرجى المحاولة مرة أخرى.");
    }
  };

  const deleteStore = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('رجاء تسجيل الدخول مره اخري');
      return;
    }

    try {
      if (storePermissions && !storePermissions.delete) {
        toast.warn('ليس لك صلاحية لحذف تصنيفات المخزن');
        return;
      }

      const response = await axios.delete(apiUrl + "/api/store/" + storeId, config);

      if (response.status === 200) {
        toast.success("تم حذف المتجر بنجاح");
        getAllStores();
        getAllStockItems();
      }
    } catch (error) {
      console.log("Error deleting store:", error);
      toast.error("حدث خطأ أثناء حذف المتجر. يرجى المحاولة مرة أخرى.");
    }
  };

  const searchByStore = (name) => {
    if (!name) {
      getAllStores();
      return;
    }
    const filteredStores = allStores.filter(store => store.storeName.startsWith(name));
    setAllStores(filteredStores);
  };

  useEffect(() => {
    getAllStockItems();
    getAllStores();
  }, []);

  return (
    <div className="w-100 px-3 d-flex align-items-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>إدارة <b>أقسام المخزن</b></h2>
              </div>
              {storePermissions?.create &&
                <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap align-items-center justify-content-end print-hide">
                  <a href="#addstoreModal" className="d-flex align-items-center justify-content-center h-100 m-0 btn btn-success" data-toggle="modal">
                    <span>إضافة تصنيف</span>
                  </a>
                </div>
              }
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-start p-0 m-0">
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عرض</label>
                <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                  {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم التصنيف</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByStore(e.target.value)} />
              </div>
            </div>
          </div>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>الاسم</th>
                <th>عدد المنتجات</th>
                <th>أضيف في</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {allStores.map((store, i) => {
                if (i >= startpagination && i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{store.storeName}</td>
                      <td>{allStockItems.filter(item => item.categoryId._id === store._id).length}</td>
                      <td>{formatDateTime(store.createdAt)}</td>
                      <td>
                        {storePermissions?.update &&
                          <a href="#editstoreModal" className="edit" data-toggle="modal" onClick={() => {
                            setStoreId(store._id);
                            setStoreName(store.storeName);
                            setStoreCode(store.storeCode);
                            setDescription(store.description);
                            setAddress(store.address);
                            setStorekeeper(store.storekeeper);
                            setCreatedBy(store.createdBy);
                          }}>
                            <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                          </a>
                        }
                        {storePermissions?.delete &&
                          <a href="#deletestoreModal" className="delete" data-toggle="modal" onClick={() => setStoreId(store._id)}>
                            <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                          </a>
                        }
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{startpagination + 1}</b> إلى <b>{endpagination}</b> من <b>{allStores.length}</b> تصنيف</div>
            <ul className="pagination">
              <li className={`page-item ${startpagination <= 0 ? 'disabled' : ''}`}>
                <a href="#" className="page-link" onClick={() => setstartpagination(startpagination - endpagination)}>&laquo;</a>
              </li>
              {Array.from({ length: Math.ceil(allStores.length / endpagination) }).map((_, index) => (
                <li key={index} className={`page-item ${startpagination === index * endpagination ? 'active' : ''}`}>
                  <a href="#" className="page-link" onClick={() => setstartpagination(index * endpagination)}>{index + 1}</a>
                </li>
              ))}
              <li className={`page-item ${endpagination >= allStores.length ? 'disabled' : ''}`}>
                <a href="#" className="page-link" onClick={() => setstartpagination(startpagination + endpagination)}>&raquo;</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      <div id="addstoreModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">إضافة تصنيف</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <form onSubmit={createStore}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="storeName">اسم التصنيف:</label>
                  <input type="text" className="form-control" id="storeName" required onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="storeCode">رمز التصنيف:</label>
                  <input type="text" className="form-control" id="storeCode" required onChange={(e) => setStoreCode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="description">الوصف:</label>
                  <input type="text" className="form-control" id="description" required onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="address">العنوان:</label>
                  <input type="text" className="form-control" id="address" required onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="storekeeper">مسؤول التصنيف:</label>
                  <input type="text" className="form-control" id="storekeeper" required onChange={(e) => setStorekeeper(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="createdBy">أنشأ بواسطة:</label>
                  <input type="text" className="form-control" id="createdBy" required onChange={(e) => setCreatedBy(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">حفظ</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal">إغلاق</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Store Modal */}
      <div id="editstoreModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">تعديل التصنيف</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <form onSubmit={editStore}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editStoreName">اسم التصنيف:</label>
                  <input type="text" className="form-control" id="editStoreName" required value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editStoreCode">رمز التصنيف:</label>
                  <input type="text" className="form-control" id="editStoreCode" required value={storeCode} onChange={(e) => setStoreCode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editDescription">الوصف:</label>
                  <input type="text" className="form-control" id="editDescription" required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editAddress">العنوان:</label>
                  <input type="text" className="form-control" id="editAddress" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editStorekeeper">مسؤول التصنيف:</label>
                  <input type="text" className="form-control" id="editStorekeeper" required value={storekeeper} onChange={(e) => setStorekeeper(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editCreatedBy">أنشأ بواسطة:</label>
                  <input type="text" className="form-control" id="editCreatedBy" required value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">تعديل</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal">إغلاق</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Store Modal */}
      <div id="deletestoreModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">حذف التصنيف</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <p>هل أنت متأكد أنك تريد حذف هذا التصنيف؟</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={deleteStore}>حذف</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">إغلاق</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
