import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const CategoryStock = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { restaurantData, permissionsList, setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)



  const [categoryStockname, setcategoryStockname] = useState('')
  const [categoryStockId, setcategoryStockId] = useState('')

  const [allCategoryStock, setallCategoryStock] = useState([])

  const getallCategoryStock = async () => {

    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + "/api/categoryStock/", config);
      setallCategoryStock(response.data.reverse());
    } catch (error) {
      console.error('Error fetching category stock:', error);
      toast.error('حدث خطأ اثناء جلب بيانات التصنيفات ! اعد تحميل الصفحة')
    }
  }


  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      if (response) {
        const StockItems = await response.data.reverse();
        setAllStockItems(StockItems)
      } else {
        toast.warn('حدث خطا اثناء جلب بيانات اصناف المخزن ! اعد تحميل الصفحة')
      }

    } catch (error) {
      console.log(error)
    }

  }


  const createCategoryStock = async (e) => {
    e.preventDefault()
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // Validate category stock name
      if (!categoryStockname.trim()) {
        toast.error("اسم التصنيف مطلوب");
      }

      const response = await axios.post(apiUrl + "/api/categoryStock/", { name: categoryStockname }, config);
      console.log({ error: response.data.error })


      if (response.status === 201) {
        // Display success toast message
        toast.success("تم إنشاء التصنيف بنجاح");
      } else {
        console.error({ error: response.data.message });
        toast.error("حدث خطأ أثناء إنشاء التصنيف. يرجى المحاولة مرة أخرى.");
      }
      getallCategoryStock();
    } catch (error) {
      // Log the error
      console.error("Error creating category stock:", error);
      if (error.response.data.error === 'Category name already exists') {
        toast.error('هذا التصنيف موجود بالفعل ')
        return
      }
      // Display error toast message
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  }



  const editCategoryStock = async (e) => {
    e.preventDefault();
    // console.log(categoryStockId); // Log the category stock ID
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // Attempt to send a PUT request to update the category stock
      const edit = await axios.put(apiUrl + "/api/categoryStock/" + categoryStockId, { name: categoryStockname }, config);

      if (edit.error === 'Category name already exists') {
        toast.error('هذا التصنيف موجود بالفعل ')
      }
      if (edit.status === 200) {
        toast.success("تم تعديل التصنيف بنجاح");
      }
      getallCategoryStock(); // Fetch updated category stock data
      getallStockItem(); // Fetch updated stock item data
      // Display success toast message
    } catch (error) {
      console.log(error); // Log any errors that occur
      // Display error toast message
      toast.error("حدث خطأ أثناء تعديل التصنيف. يرجى المحاولة مرة أخرى.");
    }
  }


  const deleteCategoryStock = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // Attempt to send a DELETE request to delete the category stock
      const deleted = await axios.delete(apiUrl + "/api/categoryStock/" + categoryStockId, config);
      // console.log(categoryStockId); // Log the category stock ID
      // console.log(deleted); // Log the response from the server

      if (deleted) {
        getallCategoryStock(); // Fetch updated category stock data
        getallStockItem(); // Fetch updated stock item data
        // Display success toast message
        toast.success("تم حذف التصنيف بنجاح");
      }
    } catch (error) {
      console.log(error); // Log any errors that occur
      // Display error toast message
      toast.error("حدث خطأ أثناء حذف التصنيف. يرجى المحاولة مرة أخرى.");
    }
  }


  const searchByCategoryStock = (CategoryStock) => {
    if (!CategoryStock) {
      getallCategoryStock()
      return
    }
    const categories = allCategoryStock.filter((Category) => Category.name.startsWith(CategoryStock) === true)
    setAllStockItems(categories)
  }


  useEffect(() => {
    getallStockItem()
    getallCategoryStock()
  }, [])

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row ">
              <div className="text-right">
                <h2>إدارة <b>اقسام المخزن</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                <a href="#addCategoryStockModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal"> <span>اضافه تصنيف</span></a>
                {/* <a href="#deleteCategoryStockModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal"> <span>حذف</span></a> */}
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
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
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم الصنف</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByCategoryStock(e.target.value)} />
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
                <th>الاسم</th>
                <th>عدد المنتجات</th>
                <th>اضيف في</th>
                <th>اجراءات</th>
              </tr>

            </thead>
            <tbody>
              {allCategoryStock.map((categoryStock, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{categoryStock.name}</td>
                      <td>{AllStockItems ? AllStockItems.filter((Item) => Item.categoryId._id === categoryStock._id).length : 0}</td>
                      <td>{formatDateTime(categoryStock.createdAt)}</td>
                      <td>
                        <a href="#editCategoryStockModal" className="edit" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteCategoryStockModal" className="delete" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })}

            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{allCategoryStock.length > endpagination ? endpagination : allCategoryStock.length}</b> من <b>{allCategoryStock.length}</b> عنصر</div>
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
      <div id="addCategoryStockModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createCategoryStock}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه تصنيف</h4>
                <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                  <input type="text" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setcategoryStockname(e.target.value)} />
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
      <div id="editCategoryStockModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={editCategoryStock}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل التصنيف</h4>
                <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                  <input type="text" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setcategoryStockname(e.target.value)} />
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
      <div id="deleteCategoryStockModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteCategoryStock}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف تصنيف</h4>
                <button type="button" className="close m-0 p-1" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <p>هل انت متاكد من حذف هذا التصنيف?</p>
                <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
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

export default CategoryStock