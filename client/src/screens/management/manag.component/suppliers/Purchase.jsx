import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';
import '../orders/Orders.css'




const Purchase = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const{restaurantData, permissionsList,setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const permissionPurchase = permissionsList?.filter(permission => permission.resource === 'Purchases')[0]
  const permissionPurchaseReturn = permissionsList?.filter(permission => permission.resource === 'Purchases Returns')[0]

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

  const Stockmovement = ['Purchase', 'ReturnPurchase'];

  const createStockAction = async (item, receiverid) => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const itemId = item.itemId;
      const quantity = item.quantity;
      const price = Number(item.price);
      const cost = item.cost;
      const expirationDate = item.expirationDate
      const movement = 'Purchase'
      const receiver = receiverid
      const stockItem = StockItems.filter(item => item._id === itemId)[0]

      const itemName = stockItem.itemName
      const oldBalance = stockItem.currentBalance
      const parts = stockItem.parts
      const currentBalance = Number(quantity) + Number(oldBalance);
      const unit = stockItem.largeUnit
      const costOfPart = Math.round((Number(price) / Number(parts)) * 100) / 100;
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

        // console.log(response);

        for (const recipe of allrecipes) {
          const recipeid = recipe._id;
          const productname = recipe.productId?.name;
          const arrayingredients = recipe.ingredients;

          const newIngredients = arrayingredients.map((ingredient) => {
            // console.log({ingredient, costOfPart, amount : ingredient.amount})
            if (ingredient.itemId === itemId) {
              const costofitem = costOfPart;
              const unit = ingredient.unit
              const amount = ingredient.amount
              const totalcostofitem = amount * costOfPart
              return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
            } else {
              return ingredient;
            }
          });
          console.log({ newIngredients })
          const totalcost = newIngredients.reduce((acc, curr) => {
            return acc + (curr.totalcostofitem || 0);
          }, 0);
          // Update the product with the modified recipe and total cost
          const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`,
            { ingredients: newIngredients, totalcost }, config);

          console.log({ updateRecipe });

          // Toast for successful update based on recipe change
          toast.success(`تم تحديث وصفة  ${productname}`);
        }
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


  const [previousBalance, setPreviousBalance] = useState(0);

  const handleAddSupplierTransactionPurchase = async (invoiceNumber) => {
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      let newCurrentBalance = 0
      const transactionType = 'Purchase'
      const amount = netAmount
      const transactionDate = invoiceDate
      const currentBalance = previousBalance + amount
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

      if (paidAmount > 0) {
        const transactionType = 'Payment'
        const amount = paidAmount
        const transactionDate = invoiceDate
        const previousBalance = newCurrentBalance
        const currentBalance = previousBalance - paidAmount
        const requestData = { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

        console.log({ requestData })

        const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
        console.log({ response })
        if (response.status === 201) {
          const supplierresponse = await axios.put(`${apiUrl}/api/supplier/${supplier}`, { currentBalance }, config);
          console.log({ supplierresponse })
          toast.success('تم انشاء العملية بنجاح');
        } else {
          toast.error('حدث خطأ أثناء انشاء العملية');
        }
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء انشاء العملية');
    }
  };


  const [items, setItems] = useState([{ itemId: '', quantity: 0, largeUnit: '', price: 0, cost: 0, expirationDate: '' }]);

  const handleNewItem = () => {
    setItems([...items, { itemId: '', quantity: 0, price: 0, largeUnit: '', cost: 0, expirationDate: '' }])
  }

  const handleDeleteItem = (index) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handleItemId = (id, index) => {
    const stockitem = StockItems.filter(item => item._id === id)[0]
    const updatedItems = [...items]
    updatedItems[index].itemId = stockitem._id
    updatedItems[index].largeUnit = stockitem.largeUnit
    console.log({ updatedItems })
    setItems(updatedItems)

  }
  const handleQuantity = (quantity, index) => {
    const updatedItems = [...items]
    updatedItems[index].quantity = Number(quantity)
    updatedItems[index].cost = Number(quantity) * Number(updatedItems[index].price);
    console.log({ updatedItems })
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handlePrice = (price, index) => {
    const updatedItems = [...items]
    updatedItems[index].price = Number(price)
    updatedItems[index].cost = Number(updatedItems[index].quantity) * Number(price);
    console.log({ updatedItems })
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handleExpirationDate = (date, index) => {
    const updatedItems = [...items]
    updatedItems[index].expirationDate = new Date(date);
    console.log({ updatedItems })
    setItems(updatedItems)
  }
  const [totalAmount, setTotalAmount] = useState(0);
  const clacTotalAmount = () => {
    let total = 0
    items.forEach(item => {
      total += item.cost
    })
    setTotalAmount(total)
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
  }, [items, additionalCost, discount, salesTax])

  const [supplier, setSupplier] = useState('');
  const [financialInfo, setFinancialInfo] = useState('');
  const [supplierInfo, setsupplierInfo] = useState('');
  const [itemsSupplied, setitemsSupplied] = useState([]);

  const handleSupplier = (id) => {
    setSupplier(id)
    const findSupplier = AllSuppliers.filter(supplier => supplier._id === id)[0]
    setsupplierInfo(findSupplier)
    setFinancialInfo(findSupplier.financialInfo)
    setPreviousBalance(findSupplier.currentBalance)
    setitemsSupplied(findSupplier.itemsSupplied)
  }


  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setinvoiceDate] = useState(new Date());

  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [paymentType, setpaymentType] = useState('');

  const handlePaidAmount = (amount) => {
    setPaidAmount(amount);
    setBalanceDue(Number(netAmount) - Number(amount));
    if (amount === 0) {
      setPaymentStatus('unpaid');
      setpaymentType('credit');
    } else if (amount === netAmount) {
      setPaymentStatus('paid');
      setpaymentType('cash');
    } else if (amount < netAmount) {
      setPaymentStatus('partially_paid');
      setpaymentType('credit');
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





  const createPurchaseInvoice = async (e, receiverId) => {
    if (permissionPurchase && !permissionPurchase.create) {
      toast.warn('ليس لك صلاحية لانشاء فاتورة مشتريات')
      return
    }
    e.preventDefault()
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      if (paidAmount > 0 && !isConfirmedaPaiment) {
        toast.warn('لم يتم خصم المبلغ المدفوع ! قم  بتاكيد الخصم ثم حاول مره اخري')
        return
      }
      const newInvoice = {
        invoiceNumber,
        invoiceDate,
        supplier,
        items,
        totalAmount,
        discount,
        salesTax,
        netAmount,
        additionalCost,
        paidAmount,
        balanceDue,
        paymentDueDate,
        cashRegister,
        paymentStatus,
        paymentType,
        paymentMethod,
        notes,
      }
      console.log({ newInvoice })
      const response = await axios.post(`${apiUrl}/api/purchaseinvoice`, newInvoice, config);
      console.log({ response })
      if (response.status === 201) {
        items.forEach(item => {
          createStockAction(item, receiverId)
        })

        await handleAddSupplierTransactionPurchase(response.data._id)
        getAllPurchases();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [invoice, setinvoice] = useState({})

  const getInvoice = async (id) => {
    if (permissionPurchase && !permissionPurchase.read) {
      toast.warn('ليس لك صلاحية لعرض فاتورة مشتريات')
      return
    }
    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      const resInvoice = await axios.get(`${apiUrl}/api/purchaseinvoice/${id}`, config)
      console.log({ resInvoice })
      if (resInvoice) {
        setinvoice(resInvoice.data)
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب الفاتوره ! اعد تحميل الصفحة و حاول مره اخري')
    }
  }



  const [allPurchaseInvoice, setallPurchaseInvoice] = useState([])
  const getAllPurchases = async () => {
    if (permissionPurchase && !permissionPurchase.read) {
      toast.warn('ليس لك صلاحية لعرض فاتورة مشتريات')
      return
    }
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


  const searchByIvoiceNumber = (invoiceNumber) => {
    if (!invoiceNumber) {
      getAllPurchases()
      return
    }
    const invoices = allPurchaseInvoice.filter((invoice) => invoice.invoiceNumber.startsWith(invoiceNumber) === true)
    setallPurchaseInvoice(invoices)
  }

  const searchByPaymentType = (type) => {
    if (!type) {
      getAllPurchases()
      return
    }
    const invoices = allPurchaseInvoice.filter((invoice) => invoice.paymentType === type)
    setallPurchaseInvoice(invoices)
  }


  const searchBySupplier = (supplier) => {
    if (!supplier) {
      getAllPurchases()
      return
    }
    const invoices = allPurchaseInvoice.filter((invoice) => invoice.supplier._id === supplier)
    setallPurchaseInvoice(invoices)
  }

  const searchBypaymentStatus = (status) => {
    if (!status) {
      getAllPurchases()
      return
    }
    const invoices = allPurchaseInvoice.filter((invoice) => invoice.paymentStatus === status)
    setallPurchaseInvoice(invoices)
  }

  const searchByCashRegister = (cashRegister) => {
    if (!cashRegister) {
      getAllPurchases()
      return
    }
    const invoices = allPurchaseInvoice.filter((invoice) => invoice.cashRegister_id === cashRegister)
    setallPurchaseInvoice(invoices)
  }


  const [isConfirmedaPaiment, setisConfirmedaPaiment] = useState(false)

  const confirmPayment = async (e) => {
    e.preventDefault();

    // Check if required variables are defined and valid
    if (!CashRegisterBalance || !paidAmount || !cashRegister || !invoiceNumber) {
      toast.error('برجاء التحقق من صحة المدخلات!');
      return;
    }

    const updatedbalance = CashRegisterBalance - paidAmount; // Calculate the updated balance

    try {
      if (!token) {
        // Handle case where token is not available
        toast.error('رجاء تسجيل الدخول مره اخري');
        return
      }
      // Perform the cash movement
      const cashMovementResponse = await axios.post(`${apiUrl}/api/cashMovement/`, {
        registerId: cashRegister,
        amount: paidAmount,
        type: 'Payment',
        description: `دفع فاتورة مشتريات رقم ${invoiceNumber}`,
      }, config);

      const cashMovement = cashMovementResponse.data.cashMovement;
      console.log(cashMovement);

      if (cashMovementResponse) {
        toast.success('تم تسجيل حركه الخزينه بنجاح');

        // Update the cash register balance
        const updateCashRegisterResponse = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
          balance: updatedbalance,
        }, config);

        if (updateCashRegisterResponse) {
          toast.success('تم خصم المدفوع من الخزينة بنجاح');
          setisConfirmedaPaiment(true)
        } else {
          // If updating the cash register fails, roll back the cash movement
          await axios.delete(`${apiUrl}/api/cashMovement/${cashMovement._id}`, config);
          toast.error('فشل في تحديث رصيد الخزينة. تم إلغاء حركة الخزينة.');
        }
      } else {
        toast.error('حدث خطأ أثناء تسجيل حركة الخزينة. حاول مرة أخرى.');
      }
    } catch (error) {
      console.log(error);
      toast.error('فشل في تسجيل المصروف! حاول مرة أخرى.');
    }
  };


  const printContainerPurchasesInvoice = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainerPurchasesInvoice.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });


  useEffect(() => {
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
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>ادارة <b>المشتريات</b></h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                <a href="#addPurchaseInvoiceModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-success" data-toggle="modal"> <label className=" text-wrap text-right fw-bolder p-0 m-0">اضافه فاتورة جديدة</label></a>

                {/* <a href="#deleteStockactionModal" className="d-flex align-items-center justify-content-center  h-100  m-0 btn btn-danger" data-toggle="modal"> <label className=" text-wrap text-right fw-bolder p-0 m-0">حذف</label></a> */}
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
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">رقم الفاتوره</label>
                <input type="text" className="form-control border-primary m-0 p-2 h-auto" onChange={(e) => searchByIvoiceNumber(e.target.value)} />
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">طريقه السداد</label>
                <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => searchByPaymentType(e.target.value)} >
                  <option value={""}>الكل</option>
                  <option value="cash">كاش</option>;
                  <option value="credit">تقسيط</option>;
                </select>
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">حاله السداد</label>
                <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => searchBypaymentStatus(e.target.value)} >
                  <option value={""}>الكل</option>
                  <option value="unpaid">لم يتم السداد</option>;
                  <option value="partially_paid">سداد جزء</option>;
                  <option value="paid">سداد كامل</option>;
                </select>
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">المورد</label>
                <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => searchBySupplier(e.target.value)} >
                  <option value={""}>الكل</option>
                  {AllSuppliers.map(supplier => {
                    return <option value={supplier._id}>{supplier.name}</option>;
                  })}
                </select>
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">خزينه الدفع</label>
                <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => searchByCashRegister(e.target.value)} >
                  <option value={""}>الكل</option>
                  {AllCashRegisters.map(cashRegister => {
                    return <option value={cashRegister._id}>{cashRegister.name}</option>;
                  })}
                </select>
              </div>
              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex flex-wrap align-items-center justify-content-between col-3 p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-control border-primary m-0 p-2 h-auto"  onChange={(e) => setallPurchaseInvoice(filterByTime(e.target.value, allPurchaseInvoice))}>
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
                    <button type="button" className="btn btn-primary w-50 h-100 p-2 " onClick={() => setallPurchaseInvoice(filterByDateRange(allPurchaseInvoice))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 h-100 p-2" onClick={getAllPurchases}>استعادة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>

                <th>م</th>
                <th>التاريخ</th>
                <th>الفاتوره</th>
                <th>المورد</th>
                <th>الاجمالي</th>
                <th>الخصم</th>
                <th>الضريبه</th>
                <th>اضافية</th>
                <th>الاجمالي</th>
                <th>نوع الفاتورة</th>
                <th>دفع</th>
                <th>باقي</th>
                <th>تاريخ الاستحقاق</th>
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
              {allPurchaseInvoice.length > 0 && allPurchaseInvoice.map((invoice, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>

                      <td>{i + 1}</td>
                      <td>{invoice.invoiceDate && formatDate(invoice.invoiceDate)}</td>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.supplier?.name}</td>
                      <td>{invoice.totalAmount}</td>
                      <td>{invoice.discount}</td>
                      <td>{invoice.salesTax}</td>
                      <td>{invoice.additionalCost}</td>
                      <td>{invoice.netAmount}</td>
                      <td>{invoice.paymentType}</td>
                      <td>{invoice.paidAmount}</td>
                      <td>{invoice.balanceDue}</td>
                      <td>{invoice.paymentDueDate && formatDate(invoice.paymentDueDate)}</td>
                      <td>{invoice.paymentMethod}</td>
                      <td>{invoice.paymentStatus}</td>
                      <td>{invoice.cashRegister?.name}</td>
                      <td>{invoice.createdBy?.fullname}</td>
                      <td>{invoice.createdAt && formatDateTime(invoice.createdAt)}</td>
                      <td>{invoice.notes}</td>
                      <td>
                        <a href="#viewPurchaseModal" data-toggle="modal" onClick={() => { getInvoice(invoice._id) }}>
                          <i className="material-icons text-primary fs-2" data-toggle="tooltip" title="مشاهدة المشتريات">&#xE417;</i>
                        </a>
                      </td>
                    </tr>
                  )
                }
              })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{allPurchaseInvoice.length > endpagination ? endpagination : allPurchaseInvoice.length}</b> من <b>{allPurchaseInvoice.length}</b> عنصر</div>
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
            <form onSubmit={(e) => createPurchaseInvoice(e, employeeLoginInfo.id)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه فاتورة مشتريات</h4>
                <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body container ">

                <div className="card">
                  <div className="card-header text-center">
                    <h4>ادخل بيانات فاتورة الشراء</h4>
                  </div>

                  <div className="card-body min-content">
                    <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                          <select required className="form-control border-primary m-0 p-2 h-auto"  id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                            <option>اختر المورد</option>
                            {AllSuppliers.map((supplier, i) => (
                              <option value={supplier._id} key={i}>{supplier.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="notesInput">الرصيد</span>
                          <input type="text" className="form-control border-primary m-0 p-2 h-auto" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                        </div>

                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="invoiceNumberInput">رقم الفاتورة</span>
                          <input type="text" className="form-control border-primary m-0 p-2 h-auto" required id="invoiceNumberInput" placeholder="رقم الفاتورة" onChange={(e) => setInvoiceNumber(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="invoiceDateInput">تاريخ الفاتورة</span>
                          <input type="date" className="form-control border-primary m-0 p-2 h-auto" required id="invoiceDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setinvoiceDate(e.target.value)} />
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
                            <th scope="w-100 d-flex flex-wrap align-items-center justify-content-between">{i + 1}</th>
                            <td>
                              <select className="form-select p-0 m-0" required onChange={(e) => handleItemId(e.target.value, i)}>
                                <option value="">
                                  {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                </option>
                                {itemsSupplied.map((stock, j) => (
                                  <option value={stock._id} key={j}>{stock.itemName}</option>
                                ))}
                              </select>
                            </td>
                            <td><input type="number" required className="form-control p-0 m-0" name="qty" onChange={(e) => handleQuantity(e.target.value, i)} /></td>
                            <td><input type="text" readOnly value={item.largeUnit} className="form-control p-0 m-0" name="largeUnit" /></td>

                            <td><input type="number" className="form-control p-0 m-0" name="price" required onChange={(e) => handlePrice(e.target.value, i)} /></td>

                            <td><input type="text" className="form-control p-0 m-0" value={item.cost} name="amt" readOnly /></td>

                            <td><input type="date" className="form-control p-0 m-0" name="Exp" onChange={(e) => handleExpirationDate(e.target.value, i)} /></td>
                            <td className="NoPrint"><button type="button" className="h-100 btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                          <input type="text" className="form-control text-end" value={totalAmount} id="totalInput" readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                          <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">خصم</span>
                          <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                          <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount} readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                          <textarea className="form-control border-primary m-0 p-2 h-auto" id="notesInput" placeholder="الملاحظات" onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                          <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setAdditionalCost(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="paidAmount">مدفوع</span>
                          <input type="number" className="form-control text-end" defaultValue={paidAmount} id="paidAmount" onChange={(e) => handlePaidAmount(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">طريقه الدفع</span>
                          <select className='form-select' name="paymentMethod" id="paymentMethod" onChange={(e) => handlePaymentMethod(e.target.value, employeeLoginInfo.id)}>
                            <option>اختر طريقه الدفع</option>
                            {financialInfo && financialInfo.map((financialInfo, i) => {
                              return <option value={financialInfo.paymentMethodName}>{`${financialInfo.paymentMethodName} ${financialInfo.accountNumber}`}</option>
                            })}
                          </select>
                        </div>
                        {paidAmount > 0 ? (
                          listCashRegister ? (
                            <>
                              <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                                <span className="input-group-text" htmlFor="CashRegister">اختر حساب الاستلام</span>
                                <select
                                  className="form-select border-primary col"
                                  id="CashRegister" required
                                  onChange={(e) => selectCashRegister(e.target.value)}
                                >
                                  <option>اختر حساب الدفع</option>
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
                                    className="form-control text-end"
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
                            <span className="input-group-text">ليس لك خزينة للدفع النقدي</span>
                          )
                        ) : null}


                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="balanceDue">باقي المستحق</span>
                          <input type="text" className="form-control text-end" id="balanceDue" value={balanceDue} readOnly />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="gstInput">تاريخ الاستحقاق</span>
                          <input type="date" className="form-control text-end" id="gstInput" onChange={(e) => setPaymentDueDate(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                          <span className="input-group-text" htmlFor="netAmountInput">حالة الفاتورة</span>
                          <input type="text" className="form-control text-end" id="netAmountInput" value={paymentStatus} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
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


      <div id="viewPurchaseModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
              <h4 className="modal-title">عرض فاتورة المشتريات</h4>
              <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div className="modal-body container printpage" ref={printContainerPurchasesInvoice} style={{ direction: 'rtl' }}>
              <div className="card">
                <div className="card-header text-center">
                  <h4>بيانات فاتورة الشراء</h4>
                </div>
                <div className="card-body min-content">
                  <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-6">
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                        <input type="text" className="form-control border-primary col" id="supplierSelect" readOnly value={invoice.supplier?.name} />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text" htmlFor="createdBy">تسجيل بواسطه</span>
                        <input type="text" className="form-control border-primary col" id="createdBy" readOnly value={invoice.createdBy?.fullname} />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text" htmlFor="createdAt">تاريخ التسجيل</span>
                        <input type="text" className="form-control border-primary col" id="createdAt" readOnly value={formatDateTime(invoice.createdAt)} />
                      </div>

                    </div>
                    <div className="col-6">
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text" htmlFor="invoiceNumberInput">رقم الفاتورة</span>
                        <input type="text" className="form-control border-primary col" required id="invoiceNumberInput" value={invoice.invoiceNumber} />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text" htmlFor="invoiceDateInput">تاريخ الفاتورة</span>
                        <input type="text" className="form-control border-primary col" required id="invoiceDateInput" value={formatDate(invoice.invoiceDate)} />
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
                      </tr>
                    </thead>
                    <tbody id="TBody">
                      {invoice.items && invoice.items.map((item, i) => (
                        <tr id="TRow" key={i}>
                          <th scope="w-100 d-flex flex-wrap align-items-center justify-content-between">{i + 1}</th>
                          <td><input type="text" className="form-control p-0 m-0" name="itemName" value={item.itemId.itemName} readOnly /></td>
                          <td><input type="text" className="form-control p-0 m-0" name="qty" value={item.quantity} readOnly /></td>
                          <td><input type="text" className="form-control p-0 m-0" name="largeUnit" value={item.largeUnit} readOnly /></td>
                          <td><input type="text" className="form-control p-0 m-0" name="price" value={item.price} readOnly /></td>
                          <td><input type="text" className="form-control p-0 m-0" name="cost" value={item.cost} readOnly /></td>
                          <td><input type="text" className="form-control p-0 m-0" name="expirationDate" value={formatDate(item.expirationDate)} readOnly /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-6">
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">الإجمالي</span>
                        <input type="text" className="form-control text-end" value={invoice.totalAmount} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">ضريبة القيمة المضافة</span>
                        <input type="text" className="form-control text-end" value={invoice.salesTax} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">خصم</span>
                        <input type="text" className="form-control text-end" value={invoice.discount} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">المبلغ الصافي</span>
                        <input type="text" className="form-control text-end" value={invoice.netAmount} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">التكلفه الاضافيه</span>
                        <input type="text" className="form-control text-end" value={invoice.additionalCost} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">الملاحظات</span>
                        <input type="text" className="form-control text-end" value={invoice.notes} readOnly />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">طريقة السداد</span>
                        <input type="text" className="form-control text-end" value={invoice.paymentType} readOnly />
                      </div>

                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">مسدد</span>
                        <input type="text" className="form-control text-end" value={invoice.paidAmount} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">طريقه الدفع</span>
                        <input type="text" className="form-control text-end" value={invoice.paymentMethod} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text"> حساب الاستلام</span>
                        <input type="text" className="form-control text-end" value={invoice.cashRegister?.name} readOnly />
                      </div>

                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">باقي المستحق</span>
                        <input type="text" className="form-control text-end col" value={invoice.balanceDue} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">تاريخ الاستحقاق</span>
                        <input type="text" className="form-control text-end col" value={formatDate(invoice.paymentDueDate)} readOnly />
                      </div>
                      <div className="input-group mb-3 d-flex align-items-center justify-content-between flex-nowrap">
                        <span className="input-group-text">حالة الفاتورة</span>
                        <input type="text" className="form-control text-end col" value={invoice.paymentStatus} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
              <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
              <input type="button" className="btn btn-primarycol-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="طباعه" onClick={handlePrint} />
            </div>
          </div>
        </div>
      </div>




      {/* <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content shadow-lg border-0 rounded ">
                    <form onSubmit={deleteStockaction}>
                      <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close m-0" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body d-flex flex-wrap align-items-center p-4 text-right">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                        <input type="submit" className="btn btn-warningcol-6 h-100 px-2 py-3 m-0" value="حذف" />
                        <input type="button" className="btn btn-danger col-6 h-100 px-2 py-3 m-0" data-dismiss="modal" value="إغلاق" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
    </div>
  )
}

export default Purchase