import React, { useState, useEffect, useRef,useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import '../orders/Orders.css'




const PurchaseReturn = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };


  const{restaurantData, permissionsList,setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo,
    usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination,
    setstartpagination, setendpagination } = useContext(detacontext)

  const [AllStockactions, setAllStockactions] = useState([]);

  const getallStockaction = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/stockmanag/', config);
      console.log(response.data)
      const Stockactions = await response.data;
      setAllStockactions(Stockactions.reverse())
    } catch (error) {
      console.log(error)
    }
  }


  const [AllSuppliers, setAllSuppliers] = useState([]);
  // Function to retrieve all suppliers
  const getAllSuppliers = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/supplier/', config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const suppliers = response.data.reverse();
      if (suppliers.length > 0) {
        setAllSuppliers(suppliers);
        toast.success('تم استرداد جميع الموردين بنجاح');
      }

      // Notify on success
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد الموردين');
    }
  };

  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/cashregister', config);
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const [allrecipes, setallrecipes] = useState([]);

  const getallrecipes = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(`${apiUrl}/api/recipe`, config);
      console.log(response)
      const allRecipe = await response.data;
      setallrecipes(allRecipe)
      console.log(allRecipe)
    } catch (error) {
      console.log(error)
    }
  }

  const [StockItems, setStockItems] = useState([]);
  const getaStockItems = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      if (response) {
        console.log(response.data)
        setStockItems(response.data.reverse())
      }
    } catch (error) {
      toast.error('فشل استيراد الاصناف بشكل صحيح !اعد تحميل الصفحة ')
    }

  }


  const createStockAction = async (item, receiverid) => {
    const itemId = item.itemId;
    const quantity = item.quantity;
    const price = Number(item.price);
    const cost = item.cost;
    const expirationDate = item.expirationDate
    const movement = 'ReturnPurchase'
    const receiver = receiverid
    const itemPercentage = Number(price) / Number(netAmount)
    const itemAdditionalCost = additionalCost * itemPercentage
    const costOfItem = itemAdditionalCost + price
    const stockItem = StockItems.filter(item => item._id === itemId)[0]
    console.log({ stockItem })

    // const itemName = stockItem.itemName
    const oldBalance = stockItem.currentBalance
    const parts = stockItem.parts
    const currentBalance = Number(oldBalance) - Number(quantity);
    const unit = stockItem.largeUnit
    const costOfPart = Math.round((Number(costOfItem) / Number(parts)) * 100) / 100;
    console.log({ itemPercentage, itemAdditionalCost, costOfItem, parts, price, costOfPart })
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`,
        { currentBalance, price, costOfPart }, config);
      console.log(changeItem);

      if (changeItem.status === 200) {
        // Create a new stock action
        const response = await axios.post(apiUrl + '/api/stockmanag/', {
          itemId,
          movement,
          quantity,
          cost,
          unit,
          balance: currentBalance,
          oldBalance,
          price,
          supplier,
          receiver,
          expirationDate,
        }, config);

        console.log(response);

        // for (const recipe of allrecipes) {
        //   const recipeid = recipe._id;
        //   const productname = recipe.productId.name;
        //   const arrayingredients = recipe.ingredients;

        //   const newIngredients = arrayingredients.map((ingredient) => {
        //     if (ingredient.itemId === itemId) {
        //       const costofitem = costOfPart;
        //       const unit = ingredient.unit
        //       const amount = ingredient.amount
        //       const totalcostofitem = amount * costOfPart
        //       return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
        //     } else {
        //       return ingredient;
        //     }
        //   });
        //   console.log({ newIngredients })
        //   const totalcost = newIngredients.reduce((acc, curr) => {
        //     return acc + (curr.totalcostofitem || 0);
        //   }, 0);
        //   // Update the product with the modified recipe and total cost
        //   const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`,
        //     { ingredients: newIngredients, totalcost }, config);

        //   console.log({ updateRecipe });

        //   // Toast for successful update based on recipe change
        //   toast.success(`تم تحديث وصفة  ${productname}`);
        // }
      }

      // Update the stock actions list and stock items
      getallStockaction();
      getaStockItems();

      // Toast notification for successful creation
      toast.success('تم تسجيل حركه المخزن بنجاح');
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل تسجيل حركه المخزن ! حاول مره اخري');
    }
  };


  const [listtransactionType, setlistTransactionType] = useState(['OpeningBalance', 'Purchase', 'Payment', 'PurchaseReturn', 'Refund']);
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);


  const [returnedItems, setreturnedItems] = useState([]);
  const handleNewItem = () => {
    setreturnedItems([...returnedItems, { itemId: '', quantity: 0, price: 0, largeUnit: '', cost: 0, expirationDate: '' }])
  }

  const handleDeleteItem = (index) => {
    const updatedItems = [...returnedItems]
    updatedItems.splice(index, 1)
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handleItemId = (id, index) => {
    const stockitem = StockItems.filter(item => item._id === id)[0]
    const updatedItems = [...returnedItems]
    updatedItems[index].itemId = stockitem._id
    updatedItems[index].largeUnit = stockitem.largeUnit
    console.log({ updatedItems })
    setreturnedItems(updatedItems)

  }
  const handleQuantity = (quantity, index) => {
    console.log({ returnedItems })
    const updatedItems = [...returnedItems]
    updatedItems[index].quantity = Number(quantity)
    updatedItems[index].cost = Number(quantity) * Number(updatedItems[index].price);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handlePrice = (price, index) => {
    const updatedItems = [...returnedItems]
    updatedItems[index].price = Number(price)
    updatedItems[index].cost = Number(updatedItems[index].quantity) * Number(price);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handleExpirationDate = (date, index) => {
    const updatedItems = [...returnedItems]
    updatedItems[index].expirationDate = new Date(date);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
  }
  const [totalAmount, setTotalAmount] = useState(0);
  const clacTotalAmount = () => {
    let total = 0
    returnedItems.forEach(item => {
      total += item.cost
    })
    setTotalAmount(total)
    setNetAmount(total)
    setBalanceDue(total)

  }

  const [additionalCost, setAdditionalCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const calcNetAmount = () => {
    // let total = Number(totalAmount) + Number(additionalCost) + Number(salesTax) - Number(discount)
    let total = Number(totalAmount) + Number(salesTax) - Number(discount)
    setNetAmount(total)
    setBalanceDue(total)

  }


  useEffect(() => {
    calcNetAmount()
  }, [returnedItems, additionalCost, discount, salesTax])

  const [supplier, setSupplier] = useState('');
  const [financialInfo, setFinancialInfo] = useState('');
  const [supplierInfo, setsupplierInfo] = useState('');

  const handleSupplier = (id) => {
    setSupplier(id)
    const findSupplier = AllSuppliers.filter(supplier => supplier._id === id)[0]
    setsupplierInfo(findSupplier)
    setFinancialInfo(findSupplier.financialInfo)
    setPreviousBalance(findSupplier.currentBalance)
  }


  const [originalInvoice, setoriginalInvoice] = useState('');
  const handleInvoice = (id) => {
    const returnInvoice = allPurchaseInvoice.filter(returnInvoice => returnInvoice._id = id)[0]
    console.log({ returnInvoice })
    setreturnInvoice(returnInvoice)
    setreturnedItems(returnInvoice.items)
    setoriginalInvoice(id)
    handleSupplier(returnInvoice.supplier._id)
  }

  const [returnDate, setreturnDate] = useState(new Date());

  const [refundedAmount, setrefundedAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [returnStatus, setreturnStatus] = useState('unreturned');
  const [refundMethod, setrefundMethod] = useState('');

  const handlerefundedAmount = (amount) => {
    setrefundedAmount(amount);
    setBalanceDue(Number(netAmount) - Number(amount));

    if (amount === 0) {
      setreturnStatus('unreturned');
    } else if (amount === netAmount) {
      setreturnStatus('fully_returned');
    } else if (amount < netAmount) {
      setreturnStatus('partially_returned');
    }
  };



  const [listCashRegister, setlistCashRegister] = useState([]);
  const [cashRegister, setCashRegister] = useState();
  const [CashRegisterBalance, setCashRegisterBalance] = useState(0);
  const handleCashRegister = (id) => {
    console.log({ id })
    const filterCashRegister = AllCashRegisters.filter(CashRegister => CashRegister.employee._id === id)
    console.log({ id, filterCashRegister })
    setlistCashRegister(filterCashRegister)
  };
  const selectCashRegister = (id) => {
    const cashRegisterSelected = listCashRegister.find(register => register._id === id)
    setCashRegister(id)
    setCashRegisterBalance(cashRegisterSelected.balance)
  }


  const [paymentMethod, setPaymentMethod] = useState('');
  const handlePaymentMethod = (Method, employeeId) => {
    console.log({ Method, employeeId })
    setPaymentMethod(Method)
    handleCashRegister(employeeId)
  }

  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [notes, setNotes] = useState('');


  // const createPurchaseInvoice = async (e, receiverId) => {

  //   e.preventDefault()
  //   try{
  // if (!token) {
  // Handle case where token is not available
  //   toast.error('رجاء تسجيل الدخول مره اخري');
  // }
  //     const newInvoice = {
  //       originalInvoice,
  //       returnDate,
  //       supplier,
  //       items,
  //       totalAmount,
  //       discount,
  //       salesTax,
  //       netAmount,
  //       additionalCost,
  //       refundedAmount,
  //       balanceDue,
  //       paymentDueDate,
  //       cashRegister,
  //       returnStatus,
  //       refundMethod,
  //       paymentMethod,
  //       notes,
  //     }
  //     console.log({ newInvoice })
  //     const response = await axios.post(`${apiUrl}/api/purchasereturn`, newInvoice, config);
  //     console.log({ response })
  //     if (response.status === 201) {
  //       items.forEach(item => {
  //         createStockAction(item, receiverId)
  //       })

  //       await handleAddSupplierTransactionPurchase(response.data._id)
  //       getAllPurchases();
  //       toast.success('تم اضافه المشتريات بنجاح')
  //     } else {
  //       toast.error('فشل اضافه المشتريات ! حاول مره اخري')
  //     }
  //   } catch (error) {
  //     toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
  //   }
  // }

  const [returnInvoice, setreturnInvoice] = useState({})

  const getReturnInvoice = async (id) => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const resInvoice = await axios.get(`${apiUrl}/api/purchasereturn/${id}`, config)
      if (resInvoice) {
        setreturnInvoice(resInvoice.data)
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب الفاتوره ! اعد تحميل الصفحة و حاول مره اخري')
    }
  }

  const createPurchaseReturn = async (e, receiverId) => {

    e.preventDefault()
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const items = []
      returnedItems.map(item => {
        if (item.quantity > 0) {
          const i = { itemId: item.itemId?._id, quantity: item.quantity, price: item.price, largeUnit: item.largeUnit, cost: item.cost, expirationDate: item.expirationDate }
          items.push(i)
          console.log({ i })
        }
      })
      if (items.length === 0) {
        toast.warn('يجب ارجاء صنف واحد علي الاقل  و اعطاءه كمية للارجاع')
        return
      }
      if (refundMethod === 'cash' && !cashRegister) {
        toast.warn('لا يمكنك ارجاع المشتريات وانت ليس لك حساب خزينه تستقبل بها قيمه المرتجعات ')
        return
      }

      const purchasereturn = {
        originalInvoice,
        returnDate,
        supplier,
        returnedItems: items,
        totalAmount,
        discount,
        netAmount,
        salesTax,
        refundedAmount,
        balanceDue,
        paymentDueDate,
        additionalCost,
        cashRegister,
        returnStatus,
        paymentMethod,
        refundMethod,
        notes,
      }
      console.log({ purchasereturn })
      const response = await axios.post(`${apiUrl}/api/purchasereturn`, purchasereturn, config);
      console.log({ response })
      if (response.status === 201) {
        items.forEach(item => {
          createStockAction(item, receiverId)
        })

        // await handleAddSupplierTransactionPurchaseReturn(response.data._id)
        getAllPurchasesReturn();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      console.log({ error })
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [allPurchasesReturn, setallPurchasesReturn] = useState([])
  const getAllPurchasesReturn = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/purchasereturn', config);
      console.log({ response })
      if (response.status === 200) {
        setallPurchasesReturn(response.data.reverse())
      } else {
        toast.error('فشل جلب جميع فواتير المشتريات ! اعد تحميل الصفحة')
      }
    } catch (error) {
      console.log({ error })
      toast.error('حدث خطأ اثناء جلب فواتير المشتريات ! اعد تحميل الصفحة')
    }
  }

  const [allPurchaseInvoice, setallPurchaseInvoice] = useState([])
  const getAllPurchases = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const response = await axios.get(apiUrl + '/api/purchaseinvoice', config);
      console.log({ response })
      if (response.status === 200) {
        setallPurchaseInvoice(response.data.reverse())
      } else {
        toast.error('فشل جلب جميع فواتير المشتريات ! اعد تحميل الصفحة')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب فواتير المشتريات ! اعد تحميل الصفحة')
    }
  }


  const searchByInvoice = (returnInvoice) => {
    if (returnInvoice === "all") {
      getAllPurchasesReturn()
    }
    getAllPurchasesReturn()
    const filters = allPurchasesReturn.filter((PurchasesReturn) => PurchasesReturn.originalInvoice._id === returnInvoice)
    setallPurchasesReturn(filters)
  }
  const searchBySupplier = (supplierId) => {
    if (supplierId === "all") {
      getAllPurchasesReturn()
    }
    getAllPurchasesReturn()
    const filters = allPurchasesReturn.filter((PurchasesReturn) => PurchasesReturn.supplier._id === supplierId)
    setallPurchasesReturn(filters)
  }

  const confirmPayment = async (e) => {
    e.preventDefault();
    const updatedbalance = Number(CashRegisterBalance) + Number(refundedAmount); // Calculate the updated balance

    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }

      // await handleAddSupplierTransactionPaymentPurchase()

      const cashMovement = await axios.post(apiUrl + '/api/cashMovement/', {
        registerId: cashRegister,
        amount: refundedAmount,
        type: 'Refund',
        description: `استرداد مرتجع فاتورة مشتريات رقم ${returnInvoice.invoiceNumber}`,
      }, config);
      console.log(cashMovement)
      console.log(cashMovement.data.cashMovement._id)

      if (cashMovement) {
        toast.success('تم تسجيل حركه الخزينه بنجاح');

        const updatecashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
          balance: updatedbalance, // Use the updated balance
        }, config);

        // Update the state after successful updates
        if (updatecashRegister) {
          // Toast notification for successful creation
          toast.success(' تم اضافه المبلع المسترد الي الخزينة');
        }
      } else {
        toast.success('حدث خطا اثنا تسجيل حركه الخزينه ! حاول مره اخري');

      }

    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل في تسجيل المصروف !حاول مره اخري');

    }
  };

  const confirmDeduct = async () => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      let newCurrentBalance = 0

      const invoiceNumber = originalInvoice
      const transactionType = 'PurchaseReturn'
      const paymentMethod = 'خصم من الرصيد'
      const amount = netAmount
      const transactionDate = returnDate
      const currentBalance = previousBalance - amount

      const requestData = { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

      console.log({ requestData })

      const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
      console.log({ response })
      if (response.status === 201) {
        const supplierresponse = await axios.put(`${apiUrl}/api/supplier/${supplier}`, { currentBalance }, config);

        newCurrentBalance = Number(supplierresponse.data.updatedSupplier.currentBalance)

        console.log({ supplierresponse })
        toast.success('تم انشاء العملية بنجاح');
      } else {
        toast.error('حدث خطأ أثناء انشاء العملية');
      }

      // if (refundedAmount > 0) {
      //   const transactionType = 'Payment'
      //   const amount = refundedAmount
      //   const transactionDate = returnDate
      //   const previousBalance = newCurrentBalance
      //   const currentBalance = previousBalance - refundedAmount
      //   const requestData = { originalInvoice, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

      //   console.log({ requestData })

      //   const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
      //   console.log({ response })
      //   if (response.status === 201) {
      //     const supplierresponse = await axios.put(`${apiUrl}/api/supplier/${supplier}`, { currentBalance }, config);
      //     console.log({ supplierresponse })
      //     toast.success('تم انشاء العملية بنجاح');
      //   } else {
      //     toast.error('حدث خطأ أثناء انشاء العملية');
      //   }
      // }
    } catch (error) {
      toast.error('حدث خطأ أثناء انشاء العملية');
    }
  };

  const printContainerPurchasesReturnInvoice = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainerPurchasesReturnInvoice.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });


  useEffect(() => {
    getAllPurchasesReturn()
    getAllPurchases()
    getallStockaction()
    getaStockItems()
    getAllCashRegisters()
    getallrecipes()
    getAllSuppliers()
  }, [])


  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-sm-6">
                <h2>ادارة <b>مرتجع المشتريات</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center  justify-content-evenly">
                <a href="#addPurchaseInvoiceModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-success" data-toggle="modal"> <label className=" text-wrap text-right fw-bolder p-0 m-0">انشاء مرتجع مشتريات</label></a>
                {/* <a href="#deleteStockactionModal" className="d-flex align-items-center justify-content-center col-4 h-100 p-2 m-0 btn btn-danger" data-toggle="modal"> <label className=" text-wrap text-right fw-bolder p-0 m-0">حذف</label></a> */}
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div class="col-12 text-dark d-flex flex-wrap align-items-center justify-content-evenly p-0 m-0">

              <div className="show-entries d-flex flex-wrap align-items-center justify-content-evenly col-2 p-0 m-0">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">عرض</label>
                <select className="form-select border-primary col-6 px-1 py-2 m-0" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">صفوف</label>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الفاتورة</label>
                <select className="form-control border-primary m-0 p-2 h-100"  onChange={(e) => searchByInvoice(e.target.value)} >
                  <option value="all">الكل</option>
                  {allPurchaseInvoice.map(PurchaseInvoice => {
                    return <option value={PurchaseInvoice._id}>{PurchaseInvoice.invoiceNumber}</option>;
                  })}
                </select>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المورد</label>
                <select className="form-control border-primary m-0 p-2 h-100"  onChange={(e) => searchBySupplier(e.target.value)} >
                  <option value="all">الكل</option>
                  {AllSuppliers.map(Supplier => {
                    return <option value={Supplier._id}>{Supplier.name}</option>;
                  })}
                </select>
              </div>

              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-control border-primary m-0 p-2 h-100"  onChange={(e) => setallPurchasesReturn(filterByTime(e.target.value, allPurchasesReturn))}>
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="month">هذه السنه</option>
                  </select>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-nowrap col-9 p-0 m-0 px-1">
                  <label className="form-label text-nowrap"><strong>مدة محددة:</strong></label>

                  <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">من</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-100" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="filter-group d-flex align-items-center justify-content-between col-3 p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">إلى</label>
                    <input type="date" className="form-control border-primary m-0 p-2 h-100" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap justify-content-between col-3 p-0 m-0">
                    <button type="button" className=" btn btn-primary w-50 h-100 p-2 " onClick={() => setallPurchasesReturn(filterByDateRange(allPurchasesReturn))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className=" btn btn-warning w-50 h-100 p-2" onClick={getAllPurchasesReturn}>استعادة
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
                  <label className="custom-checkbox">
                    <input type="checkbox" className="form-check-input form-check-input-lg" id="selectAll" />
                    <label htmlFor="selectAll"></label>
                  </label>
                </th> */}
                <th>م</th>
                <th>التاريخ</th>
                <th>الفاتوره الاصليه</th>
                <th>المورد</th>
                <th>مجموع المرتجع</th>
                <th>الخصم</th>
                <th>الضريبه</th>
                <th>الاجمالي</th>
                <th>اضافية</th>
                {/* <th>الاجمالي بالمصاريف</th> */}
                <th>نوع الفاتورة</th>
                <th>استرد</th>
                <th>باقي</th>
                <th>تاريخ الاسترداد</th>
                <th>طريقه الدفع</th>
                <th>الحالة</th>
                <th>الخزينه</th>
                <th>تم بواسطه</th>
                <th>تسجيل في</th>
                <th>ملاحظات</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {allPurchasesReturn.length > 0 && allPurchasesReturn.map((returnInvoice, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      {/* <td>
                        <label className="custom-checkbox">
                          <input type="checkbox" className="form-check-input form-check-input-lg" id="checkbox1" name="options[]" value="1" />
                          <label htmlFor="checkbox1"></label>
                        </label>
                      </td> */}
                      <td>{i + 1}</td>
                      <td>{formatDate(returnInvoice.returnDate)}</td>
                      <td>{returnInvoice.originalInvoice.invoiceNumber}</td>
                      <td>{returnInvoice.supplier.name}</td>
                      <td>{returnInvoice.totalAmount}</td>
                      <td>{returnInvoice.discount}</td>
                      <td>{returnInvoice.salesTax}</td>
                      <td>{returnInvoice.netAmount}</td>
                      <td>{returnInvoice.additionalCost}</td>
                      <td>{returnInvoice.refundMethod}</td>
                      <td>{returnInvoice.refundedAmount}</td>
                      <td>{returnInvoice.balanceDue}</td>
                      <td>{formatDate(returnInvoice.paymentDueDate)}</td>
                      <td>{returnInvoice.paymentMethod}</td>
                      <td>{returnInvoice.refundStatus}</td>
                      <td>{returnInvoice.cashRegister.name}</td>
                      <td>{returnInvoice.createdBy.fullname}</td>
                      <td>{formatDateTime(returnInvoice.createdAt)}</td>
                      <td>{returnInvoice.notes}</td>
                      <td>
                        <a href="#viewPurchaseReturnModal" data-toggle="modal" onClick={() => { getReturnInvoice(returnInvoice._id) }}><i className="material-icons text-primary" data-toggle="tooltip" title="aye">&#xE417;</i></a>
                        {/* <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => }><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                      </td>
                    </tr>
                  )
                }
              })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{allPurchasesReturn.length > endpagination ? endpagination : allPurchasesReturn.length}</b> من <b>{allPurchasesReturn.length}</b> عنصر</div>
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


      <div id="addPurchaseInvoiceModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => createPurchaseReturn(e, employeeLoginInfo.id)}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">تسجيل مرتجع مشتريات</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body container ">

                <div className="card">
                  <div className="card-header text-center">
                    <h4>ادخل بيانات فاتورة الشراء</h4>
                  </div>

                  <div className="card-body min-content">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="supplierSelect">الفاتورة الاصليه</span>
                          <select required className="form-select border-primary col" id="originalInvoiceInput" onChange={(e) => handleInvoice(e.target.value)}>
                            <option>اختر الفاتورة</option>
                            {allPurchaseInvoice.map((returnInvoice, i) => (
                              <option value={returnInvoice._id} key={i}>{returnInvoice.invoiceNumber}</option>
                            ))}
                          </select>
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="returnDateInput">تاريخ المرتجع</span>
                          <input type="date" className="form-control border-primary col" required id="returnDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setreturnDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                          <input type="text" className="form-control border-primary col" required id="originalInvoiceInput" value={supplierInfo.name} readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="notesInput">الرصيد</span>
                          <input type="text" className="form-control border-primary col" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                        </div>

                      </div>

                    </div>

                    <table className="table table-bordered table-striped table-hover">
                      <thead className="table-success">
                        <tr>
                          <th scope="col" className="col-1">#</th>
                          <th scope="col" className="col-3">الصنف</th>
                          <th scope="col" className="col-1">الكمية</th>
                          <th scope="col" className="col-1">الوحده</th>
                          <th scope="col" className="col-1">السعر</th>
                          <th scope="col" className="col-1">الثمن</th>
                          <th scope="col" className="col-2">انتهاء</th>
                          <th scope="col" className="col-2 NoPrint">
                            <button type="button" className="h-100 btn btn-sm btn-success" onClick={handleNewItem}>+</button>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="TBody">
                        {returnedItems && returnedItems.map((item, i) => (
                          <tr id="TRow" key={i}>
                            <th scope="d-flex flex-wrap align-items-center justify-content-between">{i + 1}</th>
                            <td><input type="text" className="form-control p-0 m-0" name="qty" value={item.itemId?.itemName} readOnly /></td>
                            <td><input type="text" required className="form-control p-0 m-0" max={item.quantity} value={item.quantity} name="qty" onChange={(e) => handleQuantity(Number(e.target.value), i)} /></td>

                            <td><input type="text" readOnly value={item.largeUnit} className="form-control p-0 m-0" name="largeUnit" /></td>

                            <td><input type="number" className="form-control p-0 m-0" name="price" required value={item.price} onChange={(e) => handlePrice(Number(e.target.value), i)} /></td>

                            <td><input type="text" className="form-control p-0 m-0" value={item.cost} name="amt" readOnly /></td>

                            <td><input type="text" className="form-control p-0 m-0" name="Exp" readOnly value={formatDate(item.expirationDate)} /></td>
                            {/* <td className="NoPrint"><button type="button" className="h-100 btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                          <input type="text" className="form-control text-end" value={totalAmount > 0 ? totalAmount : returnInvoice.totalAmount} id="totalInput" readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                          <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} value={salesTax ? salesTax : returnInvoice.salesTax} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">خصم</span>
                          <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} value={discount > 0 ? discount : returnInvoice.discount} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                          <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount > 0 ? netAmount : returnInvoice.netAmount} readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                          <input type="number" className="form-control text-end" id="gstInput" placeholder='اي تكلفه تمت حتي يتم الارجاع مثل النقل' onChange={(e) => setAdditionalCost(e.target.value)}/>
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                          <textarea className="form-control border-primary col" id="notesInput" placeholder="اكتب سبب المرتجع" required onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="refundMethod">طريقة السداد</span>
                          <select
                            className="form-select border-primary col"
                            id="refundMethod"
                            onChange={(e) => setrefundMethod(e.target.value)}
                            value={refundMethod}
                          >
                            <option>اختر طريقه السداد</option>
                            <option value="cash">نقدي</option>
                            <option value="credit">سداد مؤجل</option>
                            <option value="deduct_supplier_balance">خصم من رصيد المورد</option>
                          </select>
                        </div>

                        {refundMethod && refundMethod === 'cash' &&
                          <>

                            <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                              <span className="input-group-text" htmlFor="refundedAmount">مسدد</span>
                              <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
                            </div>
                            <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                              <span className="input-group-text" htmlFor="gstInput">طريقه الدفع</span>
                              <select className='form-select border-primary col' name="paymentMethod" id="paymentMethod" onChange={(e) => handlePaymentMethod(e.target.value, employeeLoginInfo.id)}>
                                <option>اختر طريقه الدفع</option>
                                <option value="نقدي">نقدي</option>
                                {financialInfo && financialInfo.map((financialInfo, i) => {
                                  return <option value={financialInfo.paymentMethodName}>{`${financialInfo.paymentMethodName} ${financialInfo.accountNumber}`}</option>
                                })}
                              </select>
                            </div>
                          </>
                        }

                        {refundMethod === 'cash' ? (
                          listCashRegister ? (
                            <>
                              <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                <span className="input-group-text " htmlFor="CashRegister">اختر حساب الاستلام</span>
                                <select
                                  className="form-select border-primary col"
                                  id="CashRegister"
                                  onChange={(e) => selectCashRegister(e.target.value)}
                                >
                                  <option>اختر حساب الاستلام</option>
                                  {listCashRegister.map(register => (
                                    <option key={register._id} value={register._id}>{register.name}</option>
                                  ))}
                                </select>
                              </div>
                              {cashRegister && (
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text" htmlFor="netAmountInput">رصيد  الخزينة</span>
                                  <input
                                    type="button"
                                    className="form-control text-end col"
                                    id="netAmountInput"
                                    value={CashRegisterBalance}
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-success w-100 h-100 p-0"
                                    id="netAmountInput"
                                    onClick={confirmPayment}
                                  >
                                    تاكيد الدفع
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="input-gro col-4up-text">ليس لك خزينة للدفع النقدي</span>
                          )
                        ) : refundMethod === 'deduct_supplier_balance' ? (
                          <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                            <span className="input-group-text" htmlFor="netAmountInput">رصيد  المورد</span>
                            <input
                              type="button"
                              className="form-control text-end col"
                              id="netAmountInput"
                              value={supplierInfo.currentBalance}
                              readOnly
                            />
                            <button
                              type="button"
                              className="btn btn-success w-100 h-100 p-0"
                              id="netAmountInput"
                              onClick={confirmDeduct}
                            >
                              تاكيد الخصم
                            </button>
                          </div>
                        ) : null}


                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="balanceDue">باقي المستحق</span>
                          <input type="text" className="form-control text-end col" id="balanceDue" value={balanceDue} readOnly />
                        </div>
                        {balanceDue > 0 &&
                          <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                            <span className="input-group-text" htmlFor="gstInput">تاريخ الاستحقاق</span>
                            <input type="date" className="form-control text-end col" id="gstInput" onChange={(e) => setPaymentDueDate(e.target.value)} />
                          </div>
                        }
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">حالة الفاتورة</span>
                          <input type="text" className="form-control text-end col" id="netAmountInput" value={returnStatus} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
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
      
      <div id="viewPurchaseReturnModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form >
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">عرض مرتجع مشتريات</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body printpage" ref={printContainerPurchasesReturnInvoice} style={{direction:'rtl'}}>

                <div className="card">
                  <div className="card-header text-center">
                    <h4>ادخل بيانات فاتورة الشراء</h4>
                  </div>

                  <div className="card-body min-content">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="supplierSelect">الفاتورة الاصلية</span>
                          <input type="text" className="form-control border-primary col" id="originalInvoiceInput" value={returnInvoice.originalInvoice} readOnly />
                         
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="returnDateInput">تاريخ المرتجع</span>
                          <input type="text" className="form-control border-primary col" readOnly id="returnDateInput" value={formatDateTime(returnInvoice.returnDate)} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                          <input type="text" className="form-control border-primary col" readOnly id="originalInvoiceInput" value={returnInvoice.supplier?.name}  />
                        </div>
                        

                      </div>

                    </div>

                    <table className="table table-bordered table-striped table-hover">
                      <thead className="table-success">
                        <tr>
                          <th scope="col" className="col-1">#</th>
                          <th scope="col" className="col-3">الصنف</th>
                          <th scope="col" className="col-1">الكمية</th>
                          <th scope="col" className="col-1">الوحده</th>
                          <th scope="col" className="col-1">السعر</th>
                          <th scope="col" className="col-1">الثمن</th>
                          <th scope="col" className="col-2">انتهاء</th>
                          <th scope="col" className="col-2 NoPrint">
                            <button type="button" className="h-100 btn btn-sm btn-success" onClick={handleNewItem}>+</button>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="TBody">
                        {returnInvoice.returnedItems && returnInvoice.returnedItems.map((item, i) => (
                          <tr id="TRow" key={i}>
                            <th scope="d-flex flex-wrap align-items-center justify-content-between">{i + 1}</th>
                            <td><input type="text" className="form-control p-0 m-0" name="qty" value={item.itemId?.itemName} readOnly /></td>
                            <td><input type="text"  className="form-control p-0 m-0"  value={item.quantity} name="qty" readOnly /></td>

                            <td><input type="text" readOnly value={item.largeUnit} className="form-control p-0 m-0" name="largeUnit" /></td>

                            <td><input type="number" className="form-control p-0 m-0" name="price" readOnly value={item.price} /></td>

                            <td><input type="text" className="form-control p-0 m-0" value={item.cost} name="amt" readOnly /></td>

                            <td><input type="text" className="form-control p-0 m-0" name="Exp" readOnly value={formatDate(item.expirationDate)} /></td>
                            {/* <td className="NoPrint"><button type="button" className="h-100 btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                          <input type="text" className="form-control text-end" value={returnInvoice.totalAmount} id="totalInput" readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                          <input type="number" className="form-control text-end" id="gstInput" value={returnInvoice.salesTax} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">خصم</span>
                          <input type="number" className="form-control text-end" id="gstInput" value={returnInvoice.discount} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                          <input type="text" className="form-control text-end" id="netAmountInput" value={returnInvoice.netAmount} readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                          <input type="text" className="form-control text-end" id="gstInput" value={returnInvoice.additionalCost}/>
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                          <textarea className="form-control border-primary col" id="notesInput"  readOnly value={returnInvoice.notes} style={{ height: 'auto' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="refundMethod">طريقة السداد</span>
                          <input type="text" className="form-control text-end" id="gstInput" readOnly value={returnInvoice.refundMethod}/>
                         
                        </div>

                        {returnInvoice.refundMethod && returnInvoice.refundMethod === 'cash' &&
                          <>

                            <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                              <span className="input-group-text" htmlFor="refundedAmount">مسدد</span>
                              <input type="text" className="form-control text-end" value={returnInvoice.refundedAmount} id="refundedAmount"/>
                            </div>
                            <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                              <span className="input-group-text" htmlFor="gstInput">طريقه الدفع</span>
                              <input type="text" className="form-control text-end" id="paymentMethod" value={returnInvoice.paymentMethod}/>
                            </div>
                              <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                <span className="input-group-text " htmlFor="CashRegister">اختر حساب الاستلام</span>
                              <input type="text" className="form-control text-end" id="CashRegister" value={returnInvoice.cashRegister?.name}/>
                               
                              </div>
                          </>
                        }


                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="balanceDue">باقي المستحق</span>
                          <input type="text" className="form-control text-end col" id="balanceDue" value={returnInvoice.balanceDue} readOnly />
                        </div>
                        {balanceDue > 0 &&
                          <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                            <span className="input-group-text" htmlFor="paymentDueDate">تاريخ الاستحقاق</span>
                            <input type="date" className="form-control text-end col" id="paymentDueDate" value={formatDate(returnInvoice.paymentDueDate)} />
                          </div>
                        }
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">حالة الفاتورة</span>
                          <input type="text" className="form-control text-end col" id="netAmountInput" value={returnInvoice.returnStatus} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
              <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
              <input type="button" className="btn btn-primary col-6 h-100 p-0 m-0" data-dismiss="modal" value="طباعه" onClick={handlePrint} />
              </div>
            </form>
          </div>
        </div>
      </div>
      

      {/* <div id="purchaseReturnModal" className="modal fade">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content shadow-lg border-0 rounded ">
                    <form onSubmit={(e) => handlePurchaseReturn(e, employeeLoginInfo.id)}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body container ">

                        <div className="card">
                          <div className="card-header text-center">
                            <h4>ادخل بيانات فاتورة الشراء</h4>
                          </div>
                          <div className="card-body min-content">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                              <div className="col-6">
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                                  <select readOnly className="form-control border-primary m-0 p-2 h-100"  id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                                    <option>اختر المورد</option>
                                    {AllSuppliers.map((supplier, i) => (
                                      <option value={supplier._id} key={i}>{supplier.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="notesInput">الرصيد</span>
                                  <input type="text" className="form-control border-primary m-0 p-2 h-100" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                                </div>

                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="originalInvoiceInput">رقم الفاتورة</span>
                                  <input type="text" className="form-control border-primary m-0 p-2 h-100" required id="originalInvoiceInput" placeholder="رقم الفاتورة" onChange={(e) => setoriginalInvoice(e.target.value)} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="returnDateInput">تاريخ الفاتورة</span>
                                  <input type="date" className="form-control border-primary m-0 p-2 h-100" required id="returnDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setreturnDate(e.target.value)} />
                                </div>
                              </div>
                            </div>

                            <table className="table table-bordered table-striped table-hover">
                              <thead className="table-success">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col" className="col-4">الصنف</th>
                                  <th scope="col" className="col-2">الكمية</th>
                                  <th scope="col" className="col-2">الوحده</th>
                                  <th scope="col" className="col-2">السعر</th>
                                  <th scope="col" className="col-2">الثمن</th>
                                  <th scope="col" className="col-2">انتهاء</th>
                                  <th scope="col" className="col-4 NoPrint">
                                    <button type="button" className="h-100 btn btn-sm btn-success" onClick={handleNewItem}>+</button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="TBody">
                                {items.map((item, i) => (
                                  <tr id="TRow" key={i}>
                                    <th scope="d-flex flex-wrap align-items-center justify-content-between">{i + 1}</th>
                                    <td>
                                      <select className="form-control border-primary m-0 p-2 h-100"  required onChange={(e) => handleItemId(e.target.value, i)}>
                                        <option value="">
                                          {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                        </option>
                                        {StockItems.map((stock, j) => (
                                          <option value={stock._id} key={j}>{stock.itemName}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td><input type="number" required className="form-control border-primary m-0 p-2 h-100" name="qty" onChange={(e) => handleQuantity(e.target.value, i)} /></td>
                                    <td><input type="text" readOnly value={item.largeUnit} className="form-control border-primary m-0 p-2 h-100" name="largeUnit" /></td>

                                    <td><input type="number" className="form-control border-primary m-0 p-2 h-100" name="price" required onChange={(e) => handlePrice(e.target.value, i)} /></td>

                                    <td><input type="text" className="form-control border-primary m-0 p-2 h-100" value={item.cost} name="amt" readOnly /></td>

                                    <td><input type="date" className="form-control border-primary m-0 p-2 h-100" name="Exp" onChange={(e) => handleExpirationDate(e.target.value, i)} /></td>
                                    <td className="NoPrint"><button type="button" className="h-100 btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                              <div className="col-6">
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="totalInput">الإجمالي</span>
                                  <input type="text" className="form-control text-end" value={totalAmount} id="totalInput" readOnly />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="gstInput">خصم</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="netAmountInput">المبلغ الصافي</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount} readOnly />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="notesInput">الملاحظات</span>
                                  <textarea className="form-control border-primary m-0 p-2 h-100" id="notesInput" placeholder="الملاحظات" onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="gstInput">تكلفه اضافية</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setAdditionalCost(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="refundedAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="gstInput">طريقه الدفع</span>
                                  <select className='form-select border-primary col' name="paymentMethod" id="paymentMethod" onChange={(e) => handlePaymentMethod(e.target.value, employeeLoginInfo.id)}>
                                    <option>اختر طريقه الدفع</option>
                                    <option value="نقدي">نقدي</option>
                                    {financialInfo && financialInfo.map((financialInfo, i) => {
                                      return <option value={financialInfo.paymentMethodName}>{`${financialInfo.paymentMethodName} ${financialInfo.accountNumber}`}</option>
                                    })}
                                  </select>
                                </div>
                                {paymentMethod === 'نقدي' && cashRegister ?
                                  <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                    <span className="input-group-text col-4" htmlFor="netAmountInput">رصيد  الخزينة</span>
                                    <input type="button" className="form-control text-end" id="netAmountInput" value={CashRegisterBalance} readOnly />
                                    <button type="button" className="h-100 btn btn-success" id="netAmountInput" onClick={confirmPayment} >تاكيد الدفع</button>
                                  </div>
                                  : <span className="input-gro col-4up-text"> ليس لك خزينة للدفع النقدي</span>
                                }

                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="balanceDue">باقي المستحق</span>
                                  <input type="text" className="form-control text-end" id="balanceDue" value={balanceDue} readOnly />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="gstInput">تاريخ الاستحقاق</span>
                                  <input type="date" className="form-control text-end" id="gstInput" onChange={(e) => setPaymentDueDate(e.target.value)} />
                                </div>
                                <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                  <span className="input-group-text col-4" htmlFor="netAmountInput">حالة الفاتورة</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={returnStatus} readOnly />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                        <input type="submit" className=" btn btn-success col-6 h-100 p-0 m-0" value="اضافه" />
                        <input type="button" className=" btn btn-danger col-6 h-100 p-0 m-0" data-dismiss="modal" value="إغلاق" />
                      </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}

      {/* <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content shadow-lg border-0 rounded ">
                    <form onSubmit={deleteStockaction}>
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
              </div> */}
    </div>
  )
}

export default PurchaseReturn