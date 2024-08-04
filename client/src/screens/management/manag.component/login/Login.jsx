import React, { useContext, useState, useEffect } from 'react';
import './Login.css';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const { getUserInfoFromToken } = useContext(detacontext);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateButton, setShowCreateButton] = useState(false);

  const checkIfEmployeesExist = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/employee');
      const employees = response.data;
      
      if (employees.length === 0) {
        console.log('No employees found.');
      } else {
        console.log('Employees found:', employees.length);
        setShowCreateButton(false);
      }
    } catch (error) {
      
        setShowCreateButton(true);
        console.error('Network Error:', error);
        toast.error('حدث خطأ في الشبكة.');
    }
  };


  useEffect(() => {
    checkIfEmployeesExist();
  }, []);

  const adminLogin = async (e) => {
    e.preventDefault();
    console.log({ phone, password });

    // Input validation
    if (!phone || !password) {
      toast.error('ادخل رقم الموبايل و الباسورد بشكل صحيح');
      return;
    }

    try {
      // Send login request
      const response = await axios.post(apiUrl + '/api/employee/login', {
        phone,
        password,
      });

      // Handle response
      if (response && response.data) {
        const { data } = response;

        // Display response message
        toast.success('تم تسجيل الدخول بنجاح');

        if (data.accessToken) {
          localStorage.setItem('token_e', data.accessToken);
          // Retrieve user info from token if needed
          const userInfo = getUserInfoFromToken();
        }

        // Redirect to management page if employee is active
        if (data.findEmployee.isActive === true) {
          window.location.href = `https://${window.location.hostname}/management`;
        } else {
          toast.error('غير مسموح لك بالدخول');
        }
      }
    } catch (error) {
      console.error(error);

      // Display error message from server response
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ. الرجاء المحاولة مرة أخرى.');
      }
    }
  };

  const handleCreateFirstEmployee = async () => {
    try {
      const response = await axios.post(apiUrl + '/api/employee/create-first');
      toast.success('تم إنشاء أول موظف بنجاح');
      // Refresh the employee check
      checkIfEmployeesExist();
    } catch (error) {
      console.error('Error creating first employee:', error);
      toast.error('حدث خطأ أثناء إنشاء أول موظف.');
    }
  };


  
  return (
    <section className="body">
      <div className="container">
        <div className="login-box">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-sm-6">
              <div className="logo">
                <span className="logo-font">Smart</span> Menu
              </div>
              <div className="app-description">
                <p>أدخل رقم هاتفك وكلمة المرور للوصول إلى تطبيق Smart Menu الذي يمكنك من إدارة أقسام مطعمك بسهولة والتحكم الشامل في عملياته.</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            {/* {showCreateButton && ( */}
              <div className="col-md-6 col-12 mt-3">
                <button onClick={handleCreateFirstEmployee} className="btn btn-secondary">إنشاء أول موظف</button>
              </div>
            {/* )  */}
            {/* // : (
            //   <div className="col-md-6 col-12">
            //     <br />
            //     <h3 className="header-title">سجل دخول</h3>
            //     <form className="login-form" onSubmit={adminLogin}>
            //       <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-start col-12">
            //         <input type="text" className="form-control border-primary" placeholder="الهاتف" onChange={(e) => setPhone(e.target.value)} />
            //       </div>
            //       <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-start col-12">
            //         <input type="password" className="form-control border-primary" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} />
            //       </div>
            //       <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-start col-12">
            //         <button type='submit' className="h-100 btn btn-primary btn-block">تسجيل دخول</button>
            //       </div>
            //     </form>
            //   </div>
            // ) */}
            {/* } */}
            <div className="col-sm-6 hide-on-mobile">
              <div id="demo" className="carousel slide" data-ride="carousel">
                {/* Indicators */}
                <ul className="carousel-indicators">
                  <li data-target="#demo" data-slide-to="0" className="active"></li>
                  <li data-target="#demo" data-slide-to="1"></li>
                </ul>
                {/* The slideshow */}
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="slider-feature-card">
                      <img src="https://i.imgur.com/YMn8Xo1.png" alt="" />
                      <h3 className="slider-title">إدارة المطعم بذكاء</h3>
                      <p className="slider-description">قم بإدارة قوائم المطعم الإلكترونية بسهولة وفاعلية باستخدام تطبيق Smart Menu.</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="slider-feature-card">
                      <img src="https://i.imgur.com/Yi5KXKM.png" alt="" />
                      <h3 className="slider-title">تحكم كامل بأعمالك</h3>
                      <p className="slider-description">احصل على تقارير مفصلة وإدارة شاملة لأقسام مطعمك من خلال تطبيق Smart Menu.</p>
                    </div>
                  </div>
                </div>
                {/* Left and right controls */}
                <a className="carousel-control-prev" href="#demo" data-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </a>
                <a className="carousel-control-next" href="#demo" data-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
