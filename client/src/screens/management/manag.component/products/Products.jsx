import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { detacontext } from '../../../../App';
import '../orders/Orders.css'



const Products = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { restaurantData, permissionsList, setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const productPermission = permissionsList && permissionsList.filter(perission => perission.resource === 'Products')[0]


  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState(0);
  const [productdiscount, setproductdiscount] = useState(0)
  const [productdescription, setproductdescription] = useState("");
  const [productcategoryid, setproductcategoryid] = useState(null);
  const [available, setavailable] = useState(false);
  const [productimg, setproductimg] = useState("");

  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setsizes] = useState([{ sizeName: '', sizePrice: 0, sizeDiscount: 0, sizePriceAfterDiscount: 0 }]);

  const handleCheckboxChange = (e) => {
    setHasSizes(!hasSizes);
  };

  const handleIsHasExtrasCheckboxChange = (e) => {
    setHasExtras(!hasExtras);
  };

  const handleIsAddonCheckboxChange = (e) => {
    setIsAddon(!isAddon);
  };

  const addSize = () => {
    setsizes([...sizes, { sizeName: '', sizePrice: 0, sizeDiscount: 0, sizePriceAfterDiscount: 0 }]);
  };

  const removeSize = (index) => {
    const newsizes = sizes.filter((size, i) => i !== index);
    setsizes([...newsizes]);
  };


  const [hasExtras, setHasExtras] = useState(false);
  const [isAddon, setIsAddon] = useState(false);
  const [extras, setExtras] = useState([]);

  const addExtra = (extraId) => {
    console.log({ extraId })
    if (extras.includes(extraId)) {
      setExtras(extras.filter((item) => item !== extraId));
    } else {
      setExtras([...extras, extraId]);
    }
  };


  const createProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('رجاء تسجيل الدخول مره اخري');
      return;
    }

    try {
      if (productPermission && !productPermission.create) {
        toast.warn('ليس لك صلاحية لاضافه الاصناف');
        return;
      }

      // إعداد جسم الطلب باستخدام FormData
      const formData = new FormData();
      formData.append('productname', productname);
      formData.append('productdescription', productdescription);
      formData.append('productcategoryid', productcategoryid);
      formData.append('available', available);
      formData.append('isAddon', isAddon);

      if (hasSizes) {
        formData.append('hasSizes', hasSizes);
        sizes.forEach((size, index) => {
          formData.append(`sizes[${index}]`, size);
        });
      } else {
        formData.append('productprice', productprice);

        if (productdiscount > 0) {
          formData.append('productdiscount', productdiscount);
          const priceAfterDiscount = productprice - productdiscount;
          formData.append('priceAfterDiscount', priceAfterDiscount > 0 ? priceAfterDiscount : 0);
        }
      }

      if (hasExtras) {
        formData.append('hasExtras', hasExtras);
        extras.forEach((extra, index) => {
          formData.append(`extras[${index}]`, extra);
        });
      }

      if (productimg) {
        formData.append('image', productimg);
      } else {
        toast.error('يجب إضافة صورة للمنتج');
        return;
      }

      console.log({ formData });

      const response = await axios.post(apiUrl + '/api/product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        }
      });

      console.log({ responsecreateproduct: response });

      if (response.status === 201) {
        getallproducts();
        console.log(response.data);
        toast.success("تم إنشاء المنتج بنجاح.");
      } else {
        throw new Error("فشلت عملية إضافة المنتج إلى القائمة! يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة المنتج! يرجى المحاولة مرة أخرى:", error);
      toast.error("فشل إنشاء المنتج. يرجى المحاولة مرة أخرى لاحقًا.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };



  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024; // 1 MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file) {
      // Check file size
      if (file.size > maxSize) {
        toast.error("Maximum file size exceeded (1 MB). Please select a smaller file.");
        return;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
        return;
      }

      // If both checks pass, set the file
      setproductimg(file);
    } else {
      toast.error("No file selected.");
    }
  };



  const [productInfo, setproductInfo] = useState({})
  const handelEditProductModal = (product) => {
    setproductInfo(product)
    setproductid(product._id); setproductname(product.name); setproductdescription(product.description);
    setproductprice(product.price); setproductdiscount(product.discount);
    setproductcategoryid(product.category._id);
    setavailable(product.available); setsizes(product.sizes);
    setHasSizes(product.hasSizes);
    setIsAddon(product.isAddon); setHasExtras(product.hasExtras);
    if (product.hasExtras) {
      const list = product.extras.map(ext => ext._id);
      console.log({ list });
      setExtras(list);
    } else { setExtras([]) }
  }



  const [productid, setproductid] = useState("")
  const editProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      if (productPermission && !productPermission.update) {
        toast.warn('ليس لك صلاحية لتعديل الاصناف')
        return
      }
      // Prepare request body
      const requestBody = {
        productname: productname,
        productdescription: productdescription,
        productcategoryid: productcategoryid,
        available: available,
        isAddon: isAddon,
      };

      // If product has sizes, include sizes in the request body
      if (hasSizes) {
        requestBody.hasSizes = hasSizes;
        requestBody.sizes = sizes;
      } else {
        requestBody.productprice = productprice
        requestBody.productdiscount = productdiscount;
        const priceAfterDiscount = productprice - productdiscount;
        requestBody.priceAfterDiscount = priceAfterDiscount > 0 ? priceAfterDiscount : 0;
      }

      if (hasExtras) {
        requestBody.hasExtras = hasExtras;
        requestBody.extras = extras;
      }


      if (productimg) {
        requestBody.image = productimg;
      }

      console.log({ requestBody })

      // Perform the API request to update the product
      const response = requestBody.image ?
        await axios.put(`${apiUrl}/api/product/${productid}`, requestBody, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers,
          }
        })
        : await axios.put(`${apiUrl}/api/product/withoutimage/${productid}`, requestBody, config);

      // Handle successful response
      console.log(response.data);
      if (response) {
        // Refresh categories and products after successful update
        getallCategories();
        getallproducts();

        // Show success toast
        toast.success('تم تحديث المنتج بنجاح.');
      }
    } catch (error) {
      // Handle errors
      console.log(error);

      // Show error toast
      toast.error('حدث خطأ أثناء تحديث المنتج. الرجاء المحاولة مرة أخرى.');
    }
  };



  const [listofProducts, setlistofProducts] = useState([]);
  const [listofProductsAddon, setlistofProductsAddon] = useState([]);

  const getallproducts = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/product/');
      if (response) {
        const products = await response.data;
        console.log({ products })
        setlistofProducts(products.reverse())
        const filterAddon = products.filter((product) => product.isAddon === true)
        if (filterAddon.length > 0) {
          setlistofProductsAddon(filterAddon)
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  const [allOrders, setallOrders] = useState([])
  const getAllOrders = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/order', config);

      if (response.status === 200) {
        const allOrders = response.data;
        console.log({ allOrders });
        setallOrders(allOrders)
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  useEffect(() => {
    const updatedListofProducts = [...listofProducts]
    allOrders.forEach((order) => {
      order.products.forEach((product) => {
        updatedListofProducts.map((pro) => {
          if (product.productid._id === pro._id) {
            pro.sales += product.quantity;
          }
        });
      });
    });
    setlistofProducts(updatedListofProducts)
  }, [allOrders])



  // const [productFilterd, setproductFilterd] = useState([])
  const filterProductsByCategory = (category) => {
    if (!category) {
      getallproducts()
    }
    const products = listofProducts.filter(product => product.category._id === category)
    setlistofProducts(products)
  }

  const searchByName = (name) => {
    if (!name) {
      getallproducts()
    }
    const products = listofProducts.filter((pro) => pro.name.startsWith(name) === true)
    setlistofProducts(products)
  }

  const deleteProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      if (productPermission && !productPermission.delete) {
        toast.warn('ليس لك صلاحية لحذف الاصناف')
        return
      }
      const response = await axios.delete(`${apiUrl}/api/product/${productid}`, config);
      if (response) {
        console.log(response);
        getallproducts();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [listofcategories, setlistofcategories] = useState([])
  const getallCategories = async () => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      const response = await axios.get(apiUrl + '/api/menucategory/', config);
      const categories = await response.data;
      // console.log(response.data)
      setlistofcategories(categories)
      // console.log(listofcategories)

    } catch (error) {
      console.log(error)
    }
  }







  useEffect(() => {
    getallproducts()
    getallCategories()
    getAllOrders()
    // getallStockItem()
  }, [])


  return (
    <div className="w-100 px-3 d-flex flex-nowrap align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>ادارة <b>المنتجات</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                <a href="#addProductModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal">
                  <span>اضافه منتج جديد</span></a>

                {/* <a href="#deleteProductModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal"> <span>حذف</span></a> */}
              </div>
            </div>
          </div>
          <div class="table-filter print-hide">
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
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByName(e.target.value)} />
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التصنيف</label>
                <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => filterProductsByCategory(e.target.value)} >
                  <option value={""}>الكل</option>
                  {listofcategories.map((category, i) => {
                    return <option value={category._id} key={i} >{category.name}</option>
                  })}
                </select>
              </div>

              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setallOrders(filterByTime(e.target.value, allOrders))}>
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="month">هذه السنه</option>
                  </select>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-nowrap col-9 p-0 m-0 px-1">
                  <label className="form-label text-nowrap"><strong>مدة محددة:</strong></label>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">من</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">إلى</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap justify-content-between col-3 p-0 m-0">
                    <button type="button" className="btn btn-primary w-50 h-100 p-2 " onClick={() => setallOrders(filterByDateRange(allOrders))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 h-100 p-2" onClick={getAllOrders}>استعادة
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
                <th>الصورة</th>
                <th>الاسم</th>
                <th>الوصف</th>
                <th>التصنيف</th>
                <th>الاحجام</th>
                <th>الاضافات</th>
                <th>التكلفة</th>
                <th>السعر</th>
                <th>التخفيض</th>
                <th>بعد التخفيض</th>
                <th>عدد المبيعات</th>
                <th>متاح</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {

                listofProducts && listofProducts.map((product, i) => {
                  if (i >= startpagination && i < endpagination) {
                    return (
                      <React.Fragment key={i}>
                        <tr>
                          {/* <td>
            <span className="custom-checkbox">
              <input type="checkbox" className="form-check-input form-check-input-lg" id={`checkbox${i}`} name="options[]" value="1" />
              <label htmlFor={`checkbox${i}`}></label>
            </span>
          </td> */}
                          <td>{i + 1}</td>
                          <td><img src={`${apiUrl}/images/${product.image}`} style={{ width: "60px", height: "50px" }} /></td>
                          <td>{product.name}</td>
                          <td className="text-wrap" style={{ maxWidth: '200px' }}>{product.description}</td>
                          <td>{product.category.name}</td>
                          <td>{product.sizes.length}</td>
                          <td>{product.extras.length}</td>
                          <td>{product.productRecipe ? product.productRecipe.totalcost : 'اضف تكلفه'}</td>
                          <td>{product.price}</td>
                          <td>{product.discount}</td>
                          <td>{product.priceAfterDiscount}</td>
                          <td>{product.sales ? product.sales : 0}</td>
                          <td>{product.available ? 'متاح' : 'غير متاح'}</td>
                          <td>
                            <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { handelEditProductModal(product) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                            <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(product._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                          </td>
                        </tr>
                        {product.sizes.length > 0 && product.sizes.map((size, j) => (
                          <tr key={j + i}>
                            {/* <td>
              <span className="custom-checkbox">
                <input type="checkbox" className="form-check-input form-check-input-lg" id={`checkbox${j + i}`} name="options[]" value="1" />
                <label htmlFor={`checkbox${j + i}`}></label>
              </span>
            </td> */}
                            <td>{i + 1}</td>
                            <td>
                              {/* <img src={`${apiUrl}/images/${product.image}`} style={{ width: "60px", height: "50px" }} /> */}
                            </td>
                            <td>{size.sizeName}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{size.sizeRecipe ? size.sizeRecipe.totalcost : 'اضف تكلفه'}</td>
                            <td>{size.sizePrice}</td>
                            <td>{size.sizeDiscount}</td>
                            <td>{size.sizePriceAfterDiscount}</td>
                            <td>{size.sales ? size.sales : 0}</td>
                            <td></td>
                            <td>
                              {/* <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { handelEditProductModal(product) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(product._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  }
                })

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




      <div id="addProductModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createProduct}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه منتج</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                  <input type="text" className="form-control border-primary m-0 p-2 h-auto" required onChange={(e) => setproductname(e.target.value)} />
                </div>

                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">التصنيف</label>
                  <select className="form-control border-primary m-0 p-2 h-auto" name="category" id="category" form="carform" onChange={(e) => setproductcategoryid(e.target.value)}>
                    <option defaultValue={productcategoryid}>اختر تصنيف</option>
                    {listofcategories.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder">أحجام المنتج</label>
                  <input type="checkbox" className="form-check-input form-check-input-lg" checked={hasSizes} onChange={handleCheckboxChange}
                  />
                </div>

                {hasSizes ? (
                  <div className="container p-0">
                    {sizes.map((size, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">اسم الحجم</label>
                            <input type="text" className="form-control border-primary" value={size.sizeName} onChange={(e) =>   setsizes((prevState) => {
                                  const newSizes = [...prevState];
                                  newSizes[index].sizeName = e.target.value;
                                  return newSizes;
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">السعر</label>
                            <div className="input-group">
                              <input type="number" min={0} className="form-control border-primary" value={size.sizePrice} onChange={(e) =>
                                  setsizes((prevState) => {
                                    const newSizes = [...prevState];
                                    newSizes[index].sizePrice = parseFloat(e.target.value);
                                    return newSizes;
                                  })
                                }
                              />
                              <span className="input-group-text">جنيه</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">التخفيض</label>
                            <div className="input-group">
                              <input type="number" min={0} max={size.sizePrice} className="form-control border-primary" value={size.sizeDiscount} onChange={(e) =>
                                  setsizes((prevState) => {
                                    const newSizes = [...prevState];
                                    newSizes[index].sizeDiscount = parseFloat(e.target.value);
                                    newSizes[index].sizePriceAfterDiscount = newSizes[index].sizePrice - parseFloat(e.target.value);
                                    return newSizes;
                                  })
                                }
                              />
                              <span className="input-group-text">جنيه</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 d-flex justify-content-between">
                          {sizes.length === index + 1 || sizes.length === 0 ? (
                            <button type="button" className="btn btn-primary col-12 col-md-6" onClick={addSize}
                            > إضافة حجم جديد</button>
                          ) : null}
                          <button
                            type="button" className="btn btn-danger col-12 col-md-6 mt-2 mt-md-0" onClick={() => removeSize(index)}
                          > حذف الحجم
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="form-group col-12 col-md-6">
                      <label className="form-label text-wrap text-right fw-bolder">السعر</label>
                      <div className="input-group">
                        <input
                          type="number" className="form-control border-primary" required onChange={(e) => setproductprice(e.target.value)}
                        />
                        <span className="input-group-text">جنيه</span>
                      </div>
                    </div>
                    <div className="form-group col-12 col-md-6">
                      <label className="form-label text-wrap text-right fw-bolder">التخفيض</label>
                      <div className="input-group">
                        <input type="number" min={0} max={productprice} className="form-control border-primary col-6" required onChange={(e) => setproductdiscount(e.target.value)}
                        />
                        <span className="input-group-text">جنيه</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">هل هذا المنتج اضافه</label>
                  <input type="checkbox" className="form-check-input form-check-input-lg" checked={isAddon} onChange={handleIsAddonCheckboxChange} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">هل له اضافات</label>
                  <input type="checkbox" className="form-check-input form-check-input-lg" checked={hasExtras} onChange={handleIsHasExtrasCheckboxChange} />
                </div>
                {hasExtras &&
                  <div className="form-group " style={{ fontSize: '16px', fontWeight: '900' }}>
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">اختر الاضافات</label>
                    {listofProductsAddon.length > 0 ?
                      <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                        <div className="col-lg-12">
                          <div className="form-group d-flex flex-wrap">
                            {listofProductsAddon && listofProductsAddon.map((ProductsAddon, i) => (
                              <div className="form-check form-check-flat mb-2 mr-4 d-flex align-items-center" key={i} style={{ minWidth: "200px" }}>
                                <input
                                  style={{ fontSize: '16px', border: '2px solid red' }}
                                  type="checkbox" className="form-check-input" value={ProductsAddon._id} checked={extras.includes(ProductsAddon._id)} onChange={(e) => addExtra(e.target.value)}
                                />
                                <label className="form-check-label mr-4" style={{ cursor: 'pointer' }} onClick={(e) => addExtra(ProductsAddon._id)}>{ProductsAddon.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      : <input type="text" className="form-control border-primary m-0 p-2 h-auto" value='لا يوجد اي اضافات' />
                    }
                  </div>
                }
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">متاح</label>
                  <select className="form-control border-primary m-0 p-2 h-auto" name="category" id="category" form="carform" onChange={(e) => setavailable(e.target.value)}>

                    <option defaultValue={available} >اختر الحاله</option>
                    <option value={true} >متاح</option>
                    <option value={false} >غير متاح</option>
                  </select>
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الصورة</label>
                  <input type="file" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => handleFileUpload(e)} />
                </div>
              </div>

              <div className="form-group col-12">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                <textarea className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => setproductdescription(e.target.value)}></textarea>
              </div>

              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="اضافه" />
                <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>



      <div id="editProductModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={editProduct}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل منتج</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                {hasSizes ? (
                  <div className="container p-0">
                    {sizes.map((size, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">اسم الحجم</label>
                            <input
                              type="text"
                              className="form-control border-primary"
                              value={size.sizeName}
                              onChange={(e) =>
                                setsizes((prevState) => {
                                  const newSizes = [...prevState];
                                  newSizes[index].sizeName = e.target.value;
                                  return newSizes;
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">السعر</label>
                            <div className="input-group">
                              <input type="number" min={0} className="form-control border-primary col-6" value={size.sizePrice} onChange={(e) =>
                                  setsizes((prevState) => {
                                    const newSizes = [...prevState];
                                    newSizes[index].sizePrice = parseFloat(e.target.value);
                                    return newSizes;
                                  })
                                }
                              />
                              <span className="input-group-text">جنيه</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label className="form-label text-wrap text-right fw-bolder">التخفيض</label>
                            <div className="input-group">
                              <input type="number" min={0} max={size.sizePrice} className="form-control border-primary col-6" value={size.sizeDiscount} onChange={(e) =>
                                  setsizes((prevState) => {
                                    const newSizes = [...prevState];
                                    newSizes[index].sizeDiscount = parseFloat(e.target.value);
                                    newSizes[index].sizePriceAfterDiscount = newSizes[index].sizePrice - parseFloat(e.target.value);
                                    return newSizes;
                                  })
                                }
                              />
                              <span className="input-group-text">جنيه</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 d-flex justify-content-between">
                          {sizes.length === index + 1 || sizes.length === 0 ? (
                            <button type="button" className="btn btn-primary col-12 col-md-6" onClick={addSize}
                            > إضافة حجم جديد
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn btn-danger col-12 col-md-6 mt-2 mt-md-0"
                            onClick={() => removeSize(index)}
                          >
                            حذف الحجم
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="form-group col-12 col-md-6">
                      <label className="form-label text-wrap text-right fw-bolder">السعر</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control border-primary col-6"
                          required
                          onChange={(e) => setproductprice(e.target.value)}
                        />
                        <span className="input-group-text">جنيه</span>
                      </div>
                    </div>
                    <div className="form-group col-12 col-md-6">
                      <label className="form-label text-wrap text-right fw-bolder">التخفيض</label>
                      <div className="input-group">
                        <input
                          type="number"
                          min={0}
                          max={productprice}
                          className="form-control border-primary col-6"
                          required
                          onChange={(e) => setproductdiscount(e.target.value)}
                        />
                        <span className="input-group-text">جنيه</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className="btn btn-success col-6 h-100 px-2 py-3 m-0" value="حفظ" />
                <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>



      <div id="deleteProductModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteProduct}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف منتج</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
               <div className="modal-body text-center">
          <p className="mb-2">هل أنت متأكد من حذف هذا السجل؟</p>
          <p className="text-warning"><small>لا يمكن الرجوع في هذا الإجراء.</small></p>
        </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input type="submit" className="btn btn-warningcol-6 h-100 px-2 py-3 m-0" value="حذف" />
                <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )


}

export default Products