import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const ProductRecipe = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const{restaurantData, permissionsList,setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const productRecipePermission = permissionsList && permissionsList.filter(perission => perission.resource === 'Recipes')[0]



  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/product/');
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }

  const [productFilterd, setproductFilterd] = useState([])
  const getproductByCategory = (category) => {
    const products = listofProducts.filter(product => product.category._id === category)
    setproductFilterd(products)
  }

  // const searchByName = (name) => {
  //   const products = listofProducts.filter((pro) => pro.name.startsWith(name) === true)
  //   setproductFilterd(products)
  // }


  const [listofcategories, setlistofcategories] = useState([])
  const getallCategories = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/menucategory/');
      const categories = await response.data;
      // console.log(response.data)
      setlistofcategories(categories)
      // console.log(listofcategories)

    } catch (error) {
      console.log(error)
    }
  }


  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      const StockItems = await response.data;
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }



  const [product, setproduct] = useState({});
  const [productId, setproductId] = useState("");
  const [productName, setproductName] = useState("");

  const [recipeOfProduct, setrecipeOfProduct] = useState(null);
  const [ingredients, setingredients] = useState([]);
  const [producttotalcost, setproducttotalcost] = useState();

  const getProductRecipe = async (productId, sizeId) => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      if (productRecipePermission&&!productRecipePermission.read) {
        toast.warn('ليس لك صلاحية لعرض الوصفات')
        return
      }
      if (!productId) {
        toast.error("اختر الصنف اولا.");
      }

      const allRecipeResponse = await axios.get(`${apiUrl}/api/recipe`, config);
      const allRecipe = allRecipeResponse.data;
      console.log({ allRecipe });

      let recipeOfProduct;

      if (productId && sizeId) {
        console.log({ sizeId })
        recipeOfProduct = allRecipe.filter(recipe =>
          recipe.productId._id === productId && recipe.sizeId === sizeId
        );
      } else if (productId && !sizeId) {
        console.log({ sizeId, productId })
        recipeOfProduct = allRecipe.filter(recipe =>
          recipe.productId._id === productId && recipe.sizeId === null
        );
      }

      if (recipeOfProduct && recipeOfProduct.length > 0) {
        const selectedRecipe = recipeOfProduct[0];
        setrecipeOfProduct(selectedRecipe);

        const ingredients = selectedRecipe.ingredients;
        // console.log("المكونات:", ingredients);
        if (ingredients) {
          setingredients([...ingredients].reverse());
          toast.success('تم جلب مكونات الوصفة بنجاح');
        }

        const totalrecipeOfProduct = selectedRecipe.totalcost;
        // console.log("التكلفة الكلية للوصفة:", totalrecipeOfProduct);
        if (totalrecipeOfProduct) {
          setproducttotalcost(totalrecipeOfProduct);
        }
      } else {
        console.warn("لم يتم العثور على وصفة مطابقة للمنتج وحجم المعرفات المقدمة.");
        setrecipeOfProduct({});
        setingredients([]);
        setproducttotalcost(null); // Reset the total cost if no recipe is found
        toast.warn('لم يتم العثور على وصفة مطابقة.');
      }
    } catch (error) {
      console.error("خطأ في جلب وصفة المنتج:", error);
      toast.error('حدث خطأ أثناء جلب وصفة المنتج. يرجى المحاولة لاحقًا.');
      // Optional: Display a user-friendly message
      // alert("حدث خطأ أثناء جلب وصفة المنتج. يرجى المحاولة لاحقًا.");
    }
  };



  const [sizes, setsizes] = useState([]);

  const handleSelectedProduct = (id) => {
    setproductId(id);
    const findProduct = listofProducts.find(product => product._id === id);
    setproductName(findProduct.name);
    setproduct(findProduct)
    if (findProduct.hasSizes) {
      setsizes(findProduct.sizes)
      setsize({});
      setsizeId('');
    } else {
      setsizes([]);
      setsize({});
      setsizeId('');
      getProductRecipe(id);
    }
  }



  const [size, setsize] = useState({});
  const [sizeId, setsizeId] = useState('');
  const handleSelectedProductSize = (sizeid) => {
    setsize(product.sizes.find(size => size._id === sizeid))
    setsizeId(sizeid)
    getProductRecipe(productId, sizeid);
  }


  const [itemId, setitemId] = useState("");
  const [name, setname] = useState("");
  const [amount, setamount] = useState();
  const [costofitem, setcostofitem] = useState();
  const [unit, setunit] = useState("");
  const [totalcostofitem, settotalcostofitem] = useState();

  const createRecipe = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      if (productRecipePermission&&!productRecipePermission.create) {
        toast.warn('ليس لك صلاحية لانشاء الوصفات')
        return
      }
      if (!itemId || !name || !amount || !costofitem || !unit || !totalcostofitem) {
        toast.error("يرجى تعبئة جميع الحقول بشكل صحيح");
        return;
      }

      let newIngredients;
      let totalCost;

      if (recipeOfProduct._id) {
        // If there are existing ingredients, create a new array with the added ingredient
        newIngredients = [...ingredients, { itemId, name, amount, costofitem, unit, totalcostofitem }];
        // Calculate the total cost by adding the cost of the new ingredient
        totalCost = Math.round((producttotalcost + totalcostofitem) * 100) / 100;


        // Update the recipe by sending a PUT request
        const addRecipeToProduct = await axios.put(
          `${apiUrl}/api/recipe/${recipeOfProduct._id}`,
          { ingredients: newIngredients, totalcost: totalCost },
          config
        );

        if (addRecipeToProduct.status === 200) {
          const recipedata = await addRecipeToProduct.data
          console.log({ sizeId: recipedata.sizeId, sizes })
          if (size && product.hasSizes) {
            sizes.map(si => {
              if (si._id === recipedata.sizeId) {
                size.sizeRecipe = recipedata._id
              }
            })
            console.log({ productId, sizes })
            const updateProduct = await axios.put(`${apiUrl}/api/product/withoutimage/${productId}`, { sizes }, config);
          } else if (!product.hasSizes) {
            const productRecipe = recipedata._id
            const updateProduct = await axios.put(`${apiUrl}/api/product/withoutimage/${productId}`, { productRecipe }, config);

          }
          toast.success("تم تحديث الوصفة بنجاح");
        } else {
          throw new Error("Failed to update recipe");
        }

        getProductRecipe(productId, sizeId); // Refresh the product recipe
      } else {
        const sizeName = size ? size.sizeName : '';
        const sizeId = size ? size._id : '';

        // If there are no existing ingredients, create a new array with the single ingredient
        newIngredients = [{ itemId, name, amount, costofitem, unit, totalcostofitem }];
        totalCost = totalcostofitem; // Total cost is the cost of the single ingredient


        // Add the new recipe to the product by sending a POST request
        const addRecipeToProduct = await axios.post(`${apiUrl}/api/recipe`,
          { productId, productName, sizeName, sizeId, ingredients: newIngredients, totalcost: totalCost },
          config
        );

        if (addRecipeToProduct.status === 201) {
          const recipedata = await addRecipeToProduct.data
          console.log({ sizeId: recipedata.sizeId, sizes })
          if (size && product.hasSizes) {
            sizes.map(si => {
              if (si._id === recipedata.sizeId) {
                size.sizeRecipe = recipedata._id
              }
            })
            console.log({ productId, sizes })
            const updateProduct = await axios.put(`${apiUrl}/api/product/withoutimage/${productId}`, { sizes }, config);
          } else if (!product.hasSizes) {
            const productRecipe = recipedata._id
            const updateProduct = await axios.put(`${apiUrl}/api/product/withoutimage/${productId}`, { productRecipe }, config);

          }
          getProductRecipe(productId, sizeId); // Refresh the product recipe
          setitemId(''); // Clear the input fields
          setname('');
          setamount('');
          setunit('');
          setcostofitem('');
          settotalcostofitem('');
          toast.success("تم إضافة المكون بنجاح"); // Notify success in adding ingredient
        } else {
          throw new Error("Failed to add recipe");
        }
      }
    } catch (error) {
      console.error("Error creating/updating recipe:", error); // Log any errors that occur during the process
      toast.error("حدث خطأ أثناء إنشاء/تحديث الوصفة"); // Notify error in creating/updating recipe
    }
  };



  const [recipeid, setrecipeid] = useState('')



  const editRecipe = async (e) => {
    try {
      e.preventDefault();
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      if (productRecipePermission&&!productRecipePermission.update) {
        toast.warn('ليس لك صلاحية لتعديل الوصفات')
        return
      }

      const newIngredients = ingredients.map((ingredient) => {
        if (ingredient.itemId === itemId) {
          return { itemId, name, amount, costofitem, unit, totalcostofitem };
        } else {
          return ingredient;
        }
      });


      let total = 0;
      for (let i = 0; i < newIngredients.length; i++) {
        total += newIngredients[i].totalcostofitem;
      }
      const totalcost = Math.round(total * 100) / 100;

      const editRecipeToProduct = await axios.put(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, { ingredients: newIngredients, totalcost }, config
      );


      if (editRecipeToProduct) {
        console.log({ editRecipeToProduct });
        getProductRecipe(productId, sizeId);
        setitemId('');
        setname('');
        setamount('');
        setunit('');
        setcostofitem('');
        toast.success('تم تعديل المكون بنجاح')
      } else {
        toast.error('حدث خطأ اثناء تعديل المكون ! حاول مره اخري')
      }
    } catch (error) {
      console.error("Error editing recipe:", error.message);
      toast.error("حدث خطأ أثناء تعديل الوصفة");
    }
  };



  const deleteRecipe = async (e) => {
    e.preventDefault()
    if (productRecipePermission&&!productRecipePermission.delete) {
      toast.warn('ليس لك صلاحية لحذف الوصفات')
      return
    }
    if (ingredients.length > 2) {
      const newingredients = ingredients.filter(ingredient => ingredient.itemId != itemId)
      console.log({ newingredients })
      let total = 0
      for (let i = 0; i < newingredients.length; i++) {
        total += newingredients[i].totalcostofitem
      }
      console.log({ totalcost: total })
      // productRecipe.map(rec=>totalcost = totalcost + rec.totalcostofitem)
      const deleteRecipetoProduct = await axios.put(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, { ingredients: newingredients, totalcost: total }, config)
    } else {
      const deleteRecipetoProduct = await axios.delete(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, config)
      console.log(deleteRecipetoProduct)
    }
    getProductRecipe(productId)
  }


  const deleteAllRecipe = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      if (productRecipePermission&&!productRecipePermission.delete) {
        toast.warn('ليس لك صلاحية لحذف الوصفات')
        return
      }
      if (recipeOfProduct) {
        const deleteRecipeToProduct = await axios.delete(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, config);

        console.log(deleteRecipeToProduct);
        getProductRecipe(productId, sizeId);

        deleteRecipeToProduct.status === 200 ? toast.success('تم حذف الوصفة بنجاح') : toast.error('حدث خطأ أثناء الحذف');
        getProductRecipe(productId, sizeId)

      } else {
        toast.error('يرجى اختيار الصفنف والمنتج أولاً');
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      toast.error('فشل عملية الحذف! يرجى المحاولة مرة أخرى');
      getProductRecipe(productId, sizeId)
    }
  };



  useEffect(() => {
    getallproducts()
    getallCategories()
    getallStockItem()
  }, [])


  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-sm-6">
                <h2>ادارة <b>تكاليف الانتاج</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center  justify-content-evenly">
                <a href="#addRecipeModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-success" data-toggle="modal"> <span>اضافه منتج جديد</span></a>

                <a href="#deleteAllProductModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-danger" data-toggle="modal"> <span>حذف الكل</span></a>
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">
              
                <div className="show-entries d-flex flex-wrap align-items-center justify-content-evenly col-2 p-0 m-0">
                  <span>عرض</span>
                  <select className="form-select border-primary col-6 px-1 py-2 m-0" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
              </div>
                <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التصنيف</label>
                  <select className="form-control border-primary m-0 p-2 h-100" onChange={(e) => getproductByCategory(e.target.value)} >
                    <option value={""}>الكل</option>
                    {listofcategories.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>
                <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المنتج</label>
                  <select className="form-control border-primary m-0 p-2 h-100" onChange={(e) => handleSelectedProduct(e.target.value)} >
                    <option value={""}>الكل</option>
                    {productFilterd.map((product, i) => {
                      return <option value={product._id} key={i} >{product.name}</option>
                    })
                    }
                  </select>
                </div>
                {sizes.length > 0 ?
                  <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الحجم</label>
                    <select className="form-control border-primary m-0 p-2 h-100"  onChange={(e) => handleSelectedProductSize(e.target.value)} >
                      <option value="">اختر حجم</option>
                      {sizes.map((size, i) => {
                        return <option value={size._id} key={i} >{size.sizeName}</option>
                      })}
                    </select>
                  </div>
                  : ""}
                <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اجمالي التكاليف</label>
                  <input type="Number" className="form-control border-primary m-0 p-2 h-100" readOnly defaultValue={producttotalcost} />
                </div>
                {/* <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">Status</label>
                  <select className="form-control border-primary m-0 p-2 h-100">
                    <option>Any</option>
                    <option>Delivered</option>
                    <option>Shipped</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <span className="filter-icon"><i className="fa fa-filter"></i></span> */}
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
                <th>الاسم</th>
                <th>التكلفة</th>
                <th>الوحدة</th>
                <th>الكمية</th>
                <th>تكلفة المكون</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.length > 0 ? ingredients.map((rec, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>
                        <span className="custom-checkbox">
                          <input type="checkbox" className="form-check-input form-check-input-lg" id="checkbox1" name="options[]" value="1" />
                          <label htmlFor="checkbox1"></label>
                        </span>
                      </td>
                      <td>{i + 1}</td>
                      <td>{rec.name}</td>
                      <td>{rec.costofitem}</td>
                      <td>{rec.unit}</td>
                      <td>{rec.amount}</td>
                      <td>{rec.totalcostofitem}</td>
                      <td>
                        <a href="#editRecipeModal" className="edit" data-toggle="modal" onClick={() => {
                          setrecipeid(rec._id)
                          setitemId(rec.itemId);
                          setname(rec.name);
                          setamount(rec.amount)
                          setunit(rec.unit)
                          setcostofitem(rec.costofitem);
                          settotalcostofitem(rec.settotalcostofitem)
                        }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => { setitemId(rec.itemId) }}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              }) : ''
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{listofProducts.length > endpagination ? endpagination : listofProducts.length}</b> من <b>{listofProducts.length}</b>عنصر</div>
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

      <div id="addRecipeModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createRecipe}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">اضافه مكون</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                  <select className="form-control border-primary m-0 p-2 h-100" form="carform" onChange={(e) => { setitemId(e.target.value);
                     setname(AllStockItems.find(s => s._id === e.target.value).itemName); 
                     setunit(AllStockItems.find(s => s._id === e.target.value).smallUnit); 
                     setcostofitem(AllStockItems.find(s => s._id === e.target.value).costOfPart) }}>
                    <option value="">اختر</option>
                    {AllStockItems && AllStockItems.map((item, i) => {
                      return (
                        <option value={item._id} key={i} >{item.itemName}</option>
                      )
                    })
                    }
                  </select>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التكلفة</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-100" required defaultValue={costofitem} readOnly />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الكمية</label>
                  <input type="Number" className="form-control border-primary col-4" required onChange={(e) => { setamount(e.target.value); settotalcostofitem(e.target.value * costofitem) }} />
                  <input type="text" className="form-control border-primary col-4" defaultValue={unit} readOnly required />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التكلفة الاجمالية</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-100" defaultValue={totalcostofitem} required readOnly />
                </div>
                {/* <div className="form-group col-12 col-md-6">
                          <button onClick={add}>اضافه جديدة</button>
                        </div> */}

              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className=" btn btn-success col-6 h-100 p-0 m-0" value="اضافه" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="editRecipeModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={editRecipe}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">تعديل مكون</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                  <input type='text' className="form-control border-primary m-0 p-2 h-100" defaultValue={name} readOnly />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التكلفة</label>
                  <input type='Number' className="form-control border-primary col-4" required defaultValue={costofitem} readOnly />
                  <input type="text" className="form-control border-primary col-4" defaultValue={unit} readOnly required />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الكمية</label>
                  <input type="Number" className="form-control border-primary m-0 p-2 h-100" defaultValue={amount} required onChange={(e) => { setamount(e.target.value); settotalcostofitem(e.target.value * costofitem) }} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التكلفة الاجمالية</label>
                  <input type='Number' className="form-control border-primary m-0 p-2 h-100" defaultValue={totalcostofitem} required readOnly />
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
      <div id="deleteProductModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteRecipe}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">حذف منتج</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
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
      <div id="deleteAllProductModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteAllRecipe}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">حذف منتج</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
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

export default ProductRecipe