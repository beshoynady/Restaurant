import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';





const Kitchen = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { formatDate, formatTime } = useContext(detacontext)


  const start = useRef();
  const ready = useRef();

  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [consumptionOrderActive, setConsumptionOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders



  const [allRecipe, setallRecipe] = useState([]); // State for all orders

  const getAllRecipe = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }

      const getAllRecipe = await axios.get(`${apiUrl}/api/recipe`, config);
      const allRecipeData = getAllRecipe.data
      setallRecipe(allRecipeData)
      console.log({ getAllRecipe });
    } catch (error) {
      console.error("Error fetching product recipe:", error.message);
    }
  };

  

  const getAllOrders = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }

      // Fetch orders from the API
      const ordersResponse = await axios.get(`${apiUrl}/api/order/limit/50`);
      const kitchenOrders = ordersResponse.data;
      // console.log({ kitchenOrders })
      // Set all orders state
      setAllOrders(kitchenOrders);

      // Filter active orders based on certain conditions
      const activeOrders = kitchenOrders.filter(order => order.isActive && (order.status === 'Approved' || order.status === 'Preparing' || order.status === 'Prepared'));

      // Set active orders state
      setOrderActive(activeOrders);
      const getAllRecipe = await axios.get(`${apiUrl}/api/recipe`, config);
      const allRecipeData = await getAllRecipe.data

      const allRecipe = allRecipeData

      const updatedConsumptionOrderActive = [];

      // console.log({ allRecipe, activeOrders })
      activeOrders.forEach(order => {
        order.products.forEach(product => {
          if (!product.isDone) {
            // console.log({ order, product })
            const productIngredients = product.sizeId ? allRecipe.find(recipe => recipe.productId._id === product.productid?._id && recipe.sizeId === product.sizeId)?.ingredients
              : allRecipe.find(recipe => recipe.productId._id === product.productid?._id)?.ingredients || [];

            // console.log({ productIngredients })

            // Update consumptionOrderActive
            productIngredients.forEach(item => {
              const existingItemIndex = updatedConsumptionOrderActive.findIndex(con => con.itemId?._id == item.itemId?._id);
              const amount = item.amount * product.quantity;

              if (existingItemIndex !== -1) {
                // If the item already exists, update the amount
                updatedConsumptionOrderActive[existingItemIndex].amount += amount;
              } else {
                // If the item does not exist, add it to the array
                updatedConsumptionOrderActive.push({
                  itemId: item.itemId,
                  name: item.name,
                  unit: item.unit,
                  amount
                });
              }
            });

            product.extras && product.extras.map(productextra => {
              productextra.extraDetails.map(extra => {
                const extraIngredients = allRecipe.find(recipe => recipe.productId._id === extra.extraId._id)?.ingredients || [];

                // console.log({ extraIngredients })

                // Update consumptionOrderActive
                extraIngredients.forEach(item => {
                  const existingItemIndex = updatedConsumptionOrderActive.findIndex(con => con.itemId?._id == item.itemId?._id);
                  const amount = item.amount;

                  if (existingItemIndex !== -1) {
                    // If the item already exists, update the amount
                    updatedConsumptionOrderActive[existingItemIndex].amount += amount;
                  } else {
                    // If the item does not exist, add it to the array
                    updatedConsumptionOrderActive.push({
                      itemId: item.itemId,
                      name: item.name,
                      unit: item.unit,
                      amount
                    });
                  }
                });
              })
            })
          }
        });
      });
      console.log({ updatedConsumptionOrderActive })

      // Set updated consumptionOrderActive state
      setConsumptionOrderActive(updatedConsumptionOrderActive);
    } catch (error) {
      // Handle errors
      console.error('Error fetching orders:', error);
    }
  };



  const today = formatDate(new Date());
  const [date, setDate] = useState(today);
  const [allKitchenConsumption, setAllKitchenConsumption] = useState([]);
  const [filteredKitchenConsumptionToday, setFilteredKitchenConsumptionToday] = useState([]);

  const getKitchenConsumption = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مرة أخرى');
        return;
      }

      setFilteredKitchenConsumptionToday([]);
      console.log('Fetching kitchen consumption...');

      const response = await axios.get(`${apiUrl}/api/kitchenconsumption`, config);

      if (response && response.data) {
        const kitchenConsumptions = response.data.data || [];
        setAllKitchenConsumption(kitchenConsumptions);

        const kitchenConsumptionsToday = kitchenConsumptions.filter((kitItem) => {
          const itemDate = formatDate(kitItem.createdAt);
          return itemDate === date;
        });

        console.log({ kitchenConsumptionsToday, kitchenConsumptions });
        setFilteredKitchenConsumptionToday(kitchenConsumptionsToday);
      } else {
        console.error('Unexpected response or empty data');
      }
    } catch (error) {
      console.error('Error fetching kitchen consumption:', error);
      toast.error('حدث خطأ أثناء جلب استهلاك المطبخ');
    }
  };

  // Updates an order status to 'Preparing'

  const orderInProgress = async (id) => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const status = 'Preparing';
      const orderData = { status };
      const response = await axios.put(`${apiUrl}/api/order/${id}`, orderData, config);
      if (response.status === 200) {
        // Fetch orders from the API
        await getAllOrders()
        toast.success('الاوردر يجهز!');
      } else {
        toast.error('حدث خطأ اثناء قبول الاوردر ! حاول مره اهري');
      }
    } catch (error) {
      console.error(error);
      toast.error('فش بدء الاوردر ! اعد تحميل الصفحة ');
    }
  };




  const updateOrderDone = async (id, type) => {
    if (!token) {
      // Handle case where token is not available
      toast.error('رجاء تسجيل الدخول مره اخري');
      return
    }
    try {
      // Fetch order data by ID
      const orderData = await axios.get(`${apiUrl}/api/order/${id}`);
      const products = await orderData.data.products;

      const fetchKitchenConsumption = await axios.get(apiUrl + '/api/kitchenconsumption', config);
      const Allkitchenconsumption = await fetchKitchenConsumption.data.data

      const kitchenConsumptionsToday = await Allkitchenconsumption.filter((kitItem) => {
        const itemDate = formatDate(kitItem.createdAt);
        return itemDate === date;
      });

      let totalConsumptionOrder = []
      // Loop through each product in the order
      products.forEach(product => {
        if (!product.isDone) {
          console.log({ product });
          const productIngredients = product.sizeId
            ? allRecipe.find(recipe => recipe.productId._id === product.productid?._id && recipe.sizeId === product.sizeId)?.ingredients
            : allRecipe.find(recipe => recipe.productId._id === product.productid?._id)?.ingredients || [];

          console.log({ productIngredients })
          // Update consumptionOrderActive
          productIngredients.forEach(item => {
            console.log({ item })
            let kitconsumption = kitchenConsumptionsToday.find(kitItem => kitItem.stockItemId._id === item.itemId?._id);
            console.log({ kitconsumption })

            const existingItemIndex = totalConsumptionOrder.findIndex(con => con.itemId?._id === item.itemId?._id);
            console.log({ existingItemIndex })

            const amount = item.amount * product.quantity;

            if (existingItemIndex !== -1) {

              // If the item already exists, update the amount
              totalConsumptionOrder[existingItemIndex].amount += amount;
            } else {
              // If the item does not exist, add it to the array
              totalConsumptionOrder.push({
                itemId: item.itemId,
                amount,
                productsProduced: kitconsumption ? [...kitconsumption.productsProduced] : []
              });
            }


            console.log({ totalConsumptionOrder })

            const existingItem= totalConsumptionOrder.find(con => con.itemId?._id === item.itemId?._id);

            let foundProducedProduct = product.sizeId ?
              existingItem?.productsProduced?.find(produced => produced.productId === product.productid?._id && produced.sizeId === product.sizeId)
              : existingItem?.productsProduced?.find(produced => produced.productId === product.productid?._id);

            console.log({ foundProducedProduct })

            if (!foundProducedProduct) {
              const newProducedProduct = product.sizeId ?
                { productId: product.productid?._id, sizeId: product.sizeId,sizeName:product.size, productionCount: product.quantity, productName: product.name }
                : { productId: product.productid?._id, productionCount: product.quantity, productName: product.name };
              console.log({newProducedProduct})
              existingItem?.productsProduced.push(newProducedProduct);
            } else {
              foundProducedProduct.productionCount += product.quantity;
            }
          });
          // console.log({ totalConsumptionOrder })



          product.extras && product.extras.forEach(productextra => {
            productextra.extraDetails.forEach(extra => {
              const extraIngredients = allRecipe.find(recipe => recipe.productId._id === extra.extraId._id)?.ingredients || [];

              // Update consumptionOrderActive
              extraIngredients.forEach(item => {

                const existingItemIndex = totalConsumptionOrder.findIndex(con => con.itemId?._id === item.itemId?._id);
                const amount = item.amount;

                if (existingItemIndex !== -1) {

                  // If the item already exists, update the amount
                  totalConsumptionOrder[existingItemIndex].amount += amount;
                } else {
                  // If the item does not exist, add it to the array
                  totalConsumptionOrder.push({
                    itemId: item.itemId,
                    amount,
                  });
                }

                let foundProducedProduct = totalConsumptionOrder[existingItemIndex]?.productsProduced?.find(produced => produced.productId === extra.extraId?._id);

                if (!foundProducedProduct) {
                  const newProducedProduct = { productId: extra.extraId?._id, productionCount: 1, productName: extra.name };

                  totalConsumptionOrder[existingItemIndex]?.productsProduced.push(newProducedProduct);
                } else {
                  foundProducedProduct.productionCount += 1;
                }
              });
            });
          });
        
        }
      });

      // console.log({ totalConsumptionOrder })
      totalConsumptionOrder.map(async (item) => {
        let kitconsumption = await kitchenConsumptionsToday.find(kitItem => kitItem.stockItemId._id === item.itemId?._id);
        try {
          const consumptionQuantity = kitconsumption.consumptionQuantity + item.amount
          const bookBalance = kitconsumption.bookBalance - item.amount
          console.log({ productsProduced: item.productsProduced })
          // Update kitchen consumption data
          const update = await axios.put(`${apiUrl}/api/kitchenconsumption/${kitconsumption._id}`, {
            consumptionQuantity,
            bookBalance,
            productsProduced: item.productsProduced
          }, config);
          // console.log({ update: update });
        } catch (error) {
          console.log({ error: error });
        }
      })

      // Perform other operations if needed after the loop completes
      // Update order status or perform other tasks

      // const status = 'Prepared';
      // const updateproducts = products.map((prod) => ({ ...prod, isDone: true }));
      // if (type === 'Internal') {
      //   const waiter = await specifiedWaiter(id);
      //   await axios.put(`${apiUrl}/api/order/${id}`, { products: updateproducts, status, waiter });
      // }
      // await axios.put(`${apiUrl}/api/order/${id}`, { products: updateproducts, status });
      // Set all orders state
      getAllOrders()
      getKitchenConsumption()
      toast.success('تم تجهيز الاوردر !'); // Notifies success in completing order

    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ اثناء تعديل حاله الاودر !اعد تحميل الصفحة و حاول مره اخري ');
    }
  };



  // Fetches all active waiters from the API

  const [AllWaiters, setAllWaiters] = useState([]); // State for active waiters

  const getAllWaiters = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }

      const allEmployees = await axios.get(apiUrl + '/api/employee', config);

      const allWaiters = allEmployees.data.length > 0 ? allEmployees.data.filter((employee) => employee.role === 'waiter') : [];
      const waiterActive = allWaiters.length > 0 ? allWaiters.filter((waiter) => waiter.isActive === true) : [];
      setAllWaiters(waiterActive);
    } catch (error) {
      console.log(error);
    }
  };


  // Determines the next available waiter to take an order
  const specifiedWaiter = async (id) => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // البحث عن الطلب بالمعرف المحدد
      const getorder = allOrders.find((order) => order._id == id);
      if (!getorder) {
        throw new Error('Order not found');
      }

      // استخراج رقم القسم من بيانات الطاولة المرتبطة بالطلب
      const tablesectionNumber = getorder.table && getorder.table.sectionNumber;
      if (!tablesectionNumber) {
        throw new Error('Table section number not found');
      }

      // البحث عن النوادل في القسم المحدد
      const sectionWaiters = AllWaiters.filter((waiter) => waiter.sectionNumber == tablesectionNumber);
      if (sectionWaiters.length === 0) {
        throw new Error('No waiters found in the specified section');
      }

      const OrderSection = allOrders.filter(order => order.waiter && order.waiter.sectionNumber === tablesectionNumber).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      let waiterId = '';

      if (OrderSection.length > 0) {
        const lastWaiterId = OrderSection[0]?.waiter?._id;
        const lastWaiterIndex = sectionWaiters.findIndex(waiter => waiter._id === lastWaiterId);
        console.log({ lastWaiterId, lastWaiterIndex });

        waiterId = (lastWaiterIndex !== -1 && lastWaiterIndex < sectionWaiters.length - 1)
          ? sectionWaiters[lastWaiterIndex + 1]._id
          : sectionWaiters[0]._id;
      } else {
        console.log('لا توجد طلبات سابقة لهذه الطاولة');
        waiterId = sectionWaiters[0]._id;
      }

      console.log({ waiterId });

      return waiterId;
    } catch (error) {
      console.error('Error fetching table or waiter data:', error);
      return ''; // التعامل مع حالة الخطأ هنا، وإرجاع سلسلة فارغة كقيمة افتراضية لمعرف النادل
    }
  };

  // Calculates the waiting time for an order
  const waitingTime = (t) => {
    const t1 = new Date(t).getTime();
    const t2 = new Date().getTime();
    const elapsedTime = t2 - t1;

    const minutesPassed = Math.floor(elapsedTime / (1000 * 60));
    return minutesPassed;
  };



  const updateOrderStatus = async (id, type, products) => {
    const status = 'Prepared';
    const updatedProducts = products.map(prod => ({ ...prod, isDone: true }));

    if (type === 'Internal') {
      const waiter = await specifiedWaiter(id);
      await axios.put(`${apiUrl}/api/order/${id}`, { products: updatedProducts, status, waiter });
    } else {
      await axios.put(`${apiUrl}/api/order/${id}`, { products: updatedProducts, status });
    }
  };



  // Fetches orders and active waiters on initial render
  useEffect(() => {
    getAllRecipe()
    getAllWaiters();
    getAllOrders();
    getKitchenConsumption();
  }, []);

  // useEffect(() => {
  //   getKitchenConsumption();
  // }, [date]);

  return (
    <div className='w-100 h-100 d-flex flex-wrap align-content-start justify-content-around align-items-start  overflowY-auto bg-transparent p-1'
      style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
      <div className="col-12 h-auto mb-1 pb-1 d-flex flex-wrap justify-content-around align-items-start" style={{ borderBottom: '1px solid red' }}>
        {orderactive && consumptionOrderActive.map((item, index) => (
          <div className="card bg-primary text-white" style={{ height: '100px', width: '130px' }} key={index}>
            <div className="card-body d-flex flex-column justify-content-center text-center" style={{ padding: '5px' }}>
              <h5 className="card-title text-center" style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h5>
              <p className="card-text text-center" style={{ fontSize: '14px', fontWeight: '500' }} >الرصيد: {filteredKitchenConsumptionToday.find((cons) => cons.stockItemId._id === item.itemId?._id) ?
                filteredKitchenConsumptionToday.find((cons) => cons.stockItemId._id === item.itemId?._id).bookBalance : '0'} {item.unit}</p>
              <p className="card-text text-center" style={{ fontSize: '14px', fontWeight: '500' }}>المطلوب: {item.amount}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12 d-flex flex-wrap justify-content-around align-items-start">
        {orderactive && orderactive.map((order, i) => {
          if (order.products.filter((pr) => pr.isDone === false).length > 0) {
            return (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card text-white bg-success" style={{ width: "265px" }}>
                  <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                    <div style={{ maxWidth: "50%" }}>
                      <p className="card-text"> {order.table != null ? `طاولة: ${order.table.tableNumber}` : (order.user ? `العميل: ${order.user.username}` : '')}</p>
                      <p className="card-text">رقم الطلب: {order.orderNum ? order.orderNum : ''}</p>
                      <p className="card-text">الفاتورة: {order.serial}</p>
                      <p className="card-text">نوع الطلب: {order.orderType}</p>
                    </div>

                    <div style={{ maxWidth: "50%" }}>
                      {order.waiter ? <p className="card-text">الويتر: {order.waiter && order.waiter.username}</p> : ""}
                      <p className="card-text">الاستلام: {formatTime(order.createdAt)}</p>
                      <p className="card-text">الانتظار: {setTimeout(() => waitingTime(order.updateAt), 60000)} دقيقه</p>
                    </div>
                  </div>
                  <ul className='list-group list-group-flush'>
                    {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                      return (
                        <>
                          <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i}
                            style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{i + 1}- {product.name} {product.size ? product.size : ''}</p>
                              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                          </li>
                          {product.extras && product.extras.length > 0 && (
                            product.extras.map((extra, j) => {
                              if (extra && extra.isDone === false) {
                                return (
                                  <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={`${i}-${j}`}
                                    style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                      {extra.extraDetails.map((detail) => (
                                        <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                      ))}
                                    </div>
                                  </li>
                                );
                              } else {
                                return null;
                              }
                            })
                          )}
                        </>

                      )
                    })}
                  </ul>
                  <div className="card-footer text-center w-100 d-flex flex-row">
                    {order.status === 'Preparing' ?
                      (<button className="btn w-100 btn-warning h-100 btn btn-lg"
                        onClick={() => {
                          updateOrderDone(order._id, order.orderType);
                        }}>تم التنفيذ</button>)

                      : order.status === 'Approved' ?
                        (<button className="btn w-100 btn-primary h-100 btn btn-lg"
                          onClick={() => orderInProgress(order._id)}
                        >بدء التنفيذ</button>)

                        : ""
                    }
                  </div>
                </div>
              </div>
            )
          } else if (order.status === 'Prepared' && order.products.filter((pr) => pr.isDone === true && pr.isDeleverd === false).length > 0) {
            return (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card text-white bg-success" style={{ width: "265px" }}>
                  <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                    <div style={{ maxWidth: "50%" }}>
                      <p className="card-text"> {order.table != null ? `طاولة: ${order.table.tableNumber}` : (order.user ? `العميل: ${order.user.username}` : '')}</p>
                      <p className="card-text">رقم الطلب: {order.orderNum ? order.orderNum : ''}</p>
                      <p className="card-text">الفاتورة: {order.serial}</p>
                      <p className="card-text">نوع الطلب: {order.orderType}</p>
                    </div>

                    <div style={{ maxWidth: "50%" }}>
                      {order.waiter ? <p className="card-text">الويتر: {order.waiter && order.waiter.username}</p> : ""}
                      <p className="card-text">الاستلام: {formatTime(order.createdAt)}</p>
                      <p className="card-text">الانتظار: {setTimeout(() => waitingTime(order.updateAt), 60000)} دقيقه</p>
                    </div>
                  </div>
                  <ul className='list-group list-group-flush'>
                    {order.products.filter((pr) => pr.isDone === true && pr.isDeleverd === false).map((product, i) => {
                      return (
                        <>
                          <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i}
                            style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{i + 1}- {product.name} {product.size ? product.size : ''}</p>
                              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                          </li>
                          {product.extras && product.extras.length > 0 && (
                            product.extras.map((extra, j) => {
                              if (extra && extra.isDone === false) {
                                return (
                                  <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={`${i}-${j}`}
                                    style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                      {extra.extraDetails.map((detail) => (
                                        <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                      ))}
                                    </div>
                                  </li>
                                );
                              } else {
                                return null;
                              }
                            })
                          )}
                        </>

                      )
                    })}
                  </ul>
                  <div className="card-footer text-center w-100 d-flex flex-row">
                    <button className="btn w-100 btn-info h-100 btn btn-lg"
                    >انتظار الاستلام</button>
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>
    </div>
  )

}

export default Kitchen