import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';
import '../orders/Orders.css'



const StockItem = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };


  const{restaurantData, permissionsList,setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const permissionStockItem = permissionsList && permissionsList.filter(permission => permission.resource === 'stock Item')[0]

  const [itemName, setitemName] = useState('');
  const [stockItemId, setStockItemid] = useState('');
  const [categoryId, setcategoryId] = useState('');
  const [categoryName, setcategoryName] = useState('');
  const [largeUnit, setlargeUnit] = useState('');
  const [smallUnit, setsmallUnit] = useState('');
  const [currentBalance, setcurrentBalance] = useState('');
  const [price, setprice] = useState('');
  const [parts, setparts] = useState('');
  const [costOfPart, setcostOfPart] = useState('');
  const [oldCostOfPart, setoldCostOfPart] = useState('');
  const [minThreshold, setminThreshold] = useState();


  // Function to create a stock item
  const createItem = async (e, userId) => {
    if (permissionStockItem && !permissionStockItem.read) {
      toast.warn('ليس لك صلاحية لانشاء عنصر جديد في المخزن')
      return
    }
    e.preventDefault();
    const createdBy = userId;
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.post(apiUrl + '/api/stockitem/', {
        itemName, categoryId, smallUnit, parts, costOfPart, largeUnit, currentBalance,
        minThreshold, price, createdBy,
      }, config);
      console.log(response.data);
      if (response.data.error === 'Item name already exists') {

        toast.warn('هذا الاسم موجود من قبل ')
      }
      getStockItems(); // Update the list of stock items after creating a new one

      // Notify on success
      toast.success('تم إنشاء عنصر المخزون بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في إنشاء عنصر المخزون');
    }
  };


  const [allrecipes, setallrecipes] = useState([]);

  const getallrecipes = async () => {
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(`${apiUrl}/api/recipe`, config);
      console.log(response)
      const allRecipe = await response.data;
      setallrecipes(allRecipe)
      console.log({ allRecipe })

    } catch (error) {
      console.log(error)
    }

  }
  // Function to edit a stock item
  const editStockItem = async (e, userId) => {
    if (permissionStockItem && !permissionStockItem.update) {
      toast.warn('ليس لك صلاحية لتعديل عناصر المخزن')
      return
    }
    e.preventDefault();
    const createdBy = userId;
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.put(`${apiUrl}/api/stockitem/${stockItemId}`, {
        itemName,
        categoryId,
        smallUnit,
        parts,
        costOfPart,
        largeUnit,
        currentBalance,
        minThreshold,
        price,
        createdBy,
      }, config);
      console.log(response.data);
      console.log({ costOfPart, oldCostOfPart })
      if (costOfPart !== oldCostOfPart) {
        console.log("recipe is go")
        for (const recipe of allrecipes) {
          const recipeid = recipe._id;
          const productname = recipe.productId.name;
          const arrayingredients = recipe.ingredients;

          const newIngredients = arrayingredients.map((ingredient) => {
            if (ingredient.itemId === stockItemId) {
              const costofitem = costOfPart;
              const unit = ingredient.unit
              const amount = ingredient.amount
              const totalcostofitem = amount * costOfPart
              return { itemId: stockItemId, name: itemName, amount, costofitem, unit, totalcostofitem };
            } else {
              return ingredient;
            }
          });
          console.log({ newIngredients })
          const totalcost = newIngredients.reduce((acc, curr) => {
            return acc + (curr.totalcostofitem || 0);
          }, 0);
          // Update the product with the modified recipe and total cost
          const updateRecipe = await axios.put(
            `${apiUrl}/api/recipe/${recipeid}`,
            { ingredients: newIngredients, totalcost }, config
          );

          console.log({ updateRecipe });

          // Toast for successful update based on recipe change
          toast.success(`تم تحديث وصفه ${productname}`);
        }
      }
      if (response) {
        getStockItems(); // Update the list of stock items after editing
      }

      // Notify on success
      toast.success('تم تحديث عنصر المخزون بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في تحديث عنصر المخزون');
    }
  };

  // Function to delete a stock item
  const deleteStockItem = async (e) => {
    if (permissionStockItem && !permissionStockItem.delete) {
      toast.warn('ليس لك صلاحية لحذف عنصر من المخزن')
      return
    }
    e.preventDefault();
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.delete(`${apiUrl}/api/stockitem/${stockItemId}`, config);
      if (response.status === 200) {
        console.log(response);
        getStockItems(); // Update the list of stock items after deletion

        // Notify on success
        toast.success('تم حذف عنصر المخزون بنجاح');
      }
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في حذف عنصر المخزون');
    }
  };


  const [AllStockItems, setAllStockItems] = useState([]);

  // Function to retrieve all stock items
  const getStockItems = async () => {
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      

      const response = await axios.get(apiUrl + '/api/stockitem/', config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const stockItems = response.data.reverse();
      setAllStockItems(stockItems);

      // Notify on success
      toast.success('تم استرداد عناصر المخزون بنجاح');
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد عناصر المخزون');
    }
  };


  const [AllCategoryStock, setAllCategoryStock] = useState([]);

  // Function to retrieve all category stock
  const getAllCategoryStock = async () => {
    try{
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + "/api/categoryStock/", config);
      setAllCategoryStock(response.data.reverse());
    } catch (error) {
      console.error('Error fetching category stock:', error);
      toast.error('حدث خطأ اثناء جلب بيانات التصنيفات ! اعد تحميل الصفحة')
    }
  };


  const handelEditStockItemModal = (item) => {
    getallrecipes()
    setStockItemid(item._id); setcategoryId(item.categoryId._id);
    setcategoryName(item.categoryId.name); setitemName(item.itemName);
    setcurrentBalance(item.currentBalance); setlargeUnit(item.largeUnit);
    setsmallUnit(item.smallUnit); setprice(item.price); setparts(item.parts);
    setoldCostOfPart(item.costOfPart); setcostOfPart(item.costOfPart);
    setminThreshold(item.minThreshold)
  }

  const searchByitem = (name) => {
    if (!name) {
      getStockItems()
      return
    }
    const filter = AllStockItems.filter(item => item.itemName.toLowerCase().startsWith(name.toLowerCase()));
    setAllStockItems(filter)
  }

  const searchByCategory = async(category) => {
    if (!category) {
      getStockItems()
      return
    }
    const filter =  AllStockItems.filter(item => item.categoryId._id === category);
    setAllStockItems(filter)
  }

  useEffect(() => {
    getStockItems()
    getAllCategoryStock()
  }, [])
  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-sm-6 text-right">
                <h2>ادارة <b>عناصر المخزن</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center  justify-content-evenly">
                <a href="#addStockItemModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-success" data-toggle="modal"> <span>اضافه منتج جديد</span></a>

                {/* <a href="#deleteStockItemModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-danger" data-toggle="modal"> <span>حذف</span></a> */}
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">
              <div className="col-3">
                <span>عرض</span>
                <select className="form-select border-primary col-6 px-1 py-2 m-0" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                </select>
                
              </div>

              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم الصنف</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByitem(e.target.value)} />
              </div>

              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">نوع المخزن</label>
                <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByCategory(e.target.value)} >
                  <option value={""}>الكل</option>
                  {AllCategoryStock.map((category, i) => {
                    return <option value={category._id} key={i} >{category.name}</option>
                  })
                  }
                </select>
              </div>

            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>اسم الصنف</th>
                <th>المخزن</th>
                <th>الرصيد الحالي</th>
                <th>الحد الادني</th>
                <th>الوحدة كبيرة</th>
                <th>السعر</th>
                <th>عدد الوحدات</th>
                <th>الوحدة صغيرة</th>
                <th>تكلفة الوحده</th>
                <th>اضيف بواسطه</th>
                <th>تاريخ الاضافه</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {AllStockItems && AllStockItems.map((item, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i} className={`${item.currentBalance === 0 ? 'bg-danger text-white'
                      : item.currentBalance < 0 ? 'bg-secondary text-white'
                        : item.currentBalance < item.minThreshold ? 'bg-warning'
                          : ''}`}>
                      <td>{i + 1}</td>
                      <td>{item.itemName}</td>
                      <td>{item.categoryId?.name}</td>
                      <td>{item.currentBalance}</td>
                      <td>{item.minThreshold}</td>
                      <td>{item.largeUnit}</td>
                      <td>{item.price}</td>
                      <td>{item.parts}</td>
                      <td>{item.smallUnit}</td>
                      <td>{item.costOfPart}</td>
                      <td>{item.createdBy?.fullname}</td>
                      <td>{formatDateTime(item.createdAt)}</td>
                      <td>
                        <a href="#editStockItemModal" className="edit" data-toggle="modal"
                          onClick={() => { handelEditStockItemModal(item) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteStockItemModal" className="delete" data-toggle="modal"
                          onClick={() => setStockItemid(item._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{AllStockItems.length > endpagination ? endpagination : AllStockItems.length}</b> من <b>{AllStockItems.length}</b> عنصر</div>
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


      <div id="addStockItemModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => createItem(e, employeeLoginInfo.id)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم الصنف</label>
                  <input type="text" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setitemName(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">نوع المخزن</label>
                  <select className="form-control border-primary m-0 p-2 h-auto"  name="category" id="category" form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                    <option>اختر نوع المخزن</option>
                    {AllCategoryStock.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوحدة الكبيرة</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setlargeUnit(e.target.value)}></input>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوحدة الصغيره</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setsmallUnit(e.target.value)}></input>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رصيد افتتاحي</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setcurrentBalance(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الحد الادني</label>
                  <input type='number' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => { setminThreshold(e.target.value); }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">السعر</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => { setprice(e.target.value) }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد الوحدات</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">تكلفة الوحده</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" required defaultValue={costOfPart} readOnly />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" Value={new Date().toLocaleDateString()} required readOnly />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className=" btn btn-success col-6 h-100 p-0 m-0" value="اضافه" />
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />

              </div>
            </form>
          </div>
        </div>
      </div>


      <div id="editStockItemModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => editStockItem(e, employeeLoginInfo.id)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اسم الصنف</label>
                  <input type="text" className="form-control border-primary m-0 p-2 h-auto" defaultValue={itemName} required onChange={(e) => setitemName(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">نوع المخزن</label>
                  <select className="form-control border-primary m-0 p-2 h-auto"  name="category" id="category" defaultValue={categoryId} form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                    <option value={categoryId}>{categoryName}</option>
                    {AllCategoryStock.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>

                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوحدة الكبيرة</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" defaultValue={largeUnit} required onChange={(e) => setlargeUnit(e.target.value)}></input>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوحدة الصغيره</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" defaultValue={smallUnit} required onChange={(e) => setsmallUnit(e.target.value)}></input>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رصيد افتتاحي</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" defaultValue={currentBalance} required onChange={(e) => setcurrentBalance(e.target.value)} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الحد الادني</label>
                  <input type='number' className="form-control border-primary m-0 p-2 h-auto" required defaultValue={minThreshold} onChange={(e) => { setminThreshold(e.target.value); }} />
                </div>

                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">السعر</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" defaultValue={price} required onChange={(e) => { setprice(e.target.value); setcostOfPart(e.target.value / Number(parts)) }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عدد الوحدات</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" defaultValue={parts} required onChange={(e) => { setparts(e.target.value); setcostOfPart(Number(price) / e.target.value) }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">تكلفة الوحده</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-auto" required defaultValue={costOfPart} readOnly />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-auto" defaultValue={new Date().toLocaleDateString()} required readOnly />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className=" btn btn-info col-6 h-100 p-0 m-0" value="حفظ" />
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="deleteStockItemModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteStockItem}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف منتج</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <p>هل انت متاكد من حذف هذا السجل؟</p>
                <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
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

export default StockItem