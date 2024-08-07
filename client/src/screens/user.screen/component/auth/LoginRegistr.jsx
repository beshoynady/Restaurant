import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const LoginRegistr = (props) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const openlogin = props.openlogin;
  const [openform, setopenform] = useState(props.openlogin);
  const [closelogin, setcloselogin] = useState(true);

  const authform = useRef();
  const loginForm = useRef();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [deliveryArea, setdeliveryArea] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [passconfirm, setpassconfirm] = useState("");
  const [areas, setAreas] = useState([]);

  const getAllDeliveryAreas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`);
      const data = await response.data;
      if (data) {
        setAreas(data);
      } else {
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ');
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة');
    }
  };

  const closeform = () => {
    authform.current.style.display = "none";
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      if (!phone || !password) {
        toast.error('رقم الموبايل أو كلمة السر غير مُقدمة.');
        return;
      }

      const response = await axios.post(apiUrl + '/api/auth/login', { phone, password });

      if (response && response.data) {
        const { accessToken, findUser } = response.data;

        if (accessToken && findUser.isActive) {
          localStorage.setItem('token_u', accessToken);
          getUserInfoFromToken();
          toast.success('تم تسجيل الدخول!');
        } else {
          toast.error('هذا المستخدم غير نشط. الرجاء الاتصال بنا.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 404) {
        toast.error('رقم الهاتف غير مسجل.');
      } else if (error.response && error.response.status === 401) {
        toast.error('كلمة السر غير صحيحة.');
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
      }
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password || !phone || !address) {
        toast.error('هناك حقول فارغة.');
        return;
      }

      if (passconfirm !== undefined && password !== passconfirm) {
        toast.error('كلمة المرور غير متطابقة.');
        return;
      }

      const response = await axios.post(apiUrl + '/api/auth/signup', {
        username,
        password,
        phone,
        deliveryArea,
        address,
        email,
      });

      if (response && response.data) {
        const { accessToken, newUser } = response.data;
        localStorage.setItem('token_u', accessToken);
        toast.success('تم إنشاء الحساب بنجاح!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  useEffect(() => {
    getAllDeliveryAreas();
  }, []);

  return (
    <detacontext.Consumer>
      {({ getUserInfoFromToken }) => {
        return (
          <div className= {`container justify-content-center align-items-center vh-100 ${openlogin ? 'd-flex' : 'd-none'}`}>
            <div className='row w-100'>
              <div className='col-12 col-md-8 col-lg-6 mx-auto'>
                <div className='card'>
                  <div className='card-body'>
                    <ul className='nav nav-tabs' id='myTab' role='tablist'>
                      <li className='nav-item' role='presentation'>
                        <button
                          className='nav-link active'
                          id='login-tab'
                          data-bs-toggle='tab'
                          data-bs-target='#login'
                          type='button'
                          role='tab'
                          aria-controls='login'
                          aria-selected='true'
                          onClick={() => {
                            loginForm.current.style.marginRight = "0%";
                          }}
                        >
                          دخول
                        </button>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <button
                          className='nav-link'
                          id='signup-tab'
                          data-bs-toggle='tab'
                          data-bs-target='#signup'
                          type='button'
                          role='tab'
                          aria-controls='signup'
                          aria-selected='false'
                          onClick={() => {
                            loginForm.current.style.marginRight = "-50%";
                          }}
                        >
                          عضو جديد
                        </button>
                      </li>
                    </ul>
                    <div className='tab-content' id='myTabContent'>
                      <div
                        className='tab-pane fade show active'
                        id='login'
                        role='tabpanel'
                        aria-labelledby='login-tab'
                      >
                        <form onSubmit={login}>
                          <div className='mb-3'>
                            <label htmlFor='loginPhone' className='form-label'>رقم الموبايل</label>
                            <input
                              type='text'
                              className='form-control'
                              id='loginPhone'
                              placeholder='رقم الموبايل'
                              required
                              onChange={(e) => setphone(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='loginPassword' className='form-label'>كلمة السر</label>
                            <input
                              type='password'
                              className='form-control'
                              id='loginPassword'
                              placeholder='كلمة السر'
                              required
                              onChange={(e) => setpassword(e.target.value)}
                            />
                          </div>
                          <button className='btn btn-primary w-100' type='submit'>دخول</button>
                        </form>
                      </div>
                      <div
                        className='tab-pane fade'
                        id='signup'
                        role='tabpanel'
                        aria-labelledby='signup-tab'
                      >
                        <form onSubmit={signup}>
                          <div className='mb-3'>
                            <label htmlFor='signupUsername' className='form-label'>اسمك</label>
                            <input
                              type='text'
                              className='form-control'
                              id='signupUsername'
                              placeholder='اسمك'
                              required
                              onChange={(e) => setusername(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupEmail' className='form-label'>الايميل</label>
                            <input
                              type='email'
                              className='form-control'
                              id='signupEmail'
                              placeholder='الايميل'
                              onChange={(e) => setemail(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupPhone' className='form-label'>رقم الموبايل</label>
                            <input
                              type='text'
                              className='form-control'
                              id='signupPhone'
                              placeholder='رقم الموبايل'
                              required
                              onChange={(e) => setphone(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupDeliveryArea' className='form-label'>اختر المنطقة</label>
                            <select
                              className='form-select'
                              id='signupDeliveryArea'
                              onChange={(e) => setdeliveryArea(e.target.value)}
                            >
                              <option>اختر المنطقة</option>
                              {areas && areas.map((area, i) => (
                                <option value={area._id} key={i}>{area.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupAddress' className='form-label'>العنوان بالتفصيل</label>
                            <textarea
                              className='form-control'
                              id='signupAddress'
                              placeholder='العنوان بالتفصيل'
                              required
                              onChange={(e) => setaddress(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupPassword' className='form-label'>كلمة السر</label>
                            <input
                              type='password'
                              className='form-control'
                              id='signupPassword'
                              placeholder='كلمة السر'
                              required
                              onChange={(e) => setpassword(e.target.value)}
                            />
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='signupPassconfirm' className='form-label'>تأكيد كلمة السر</label>
                            <input
                              type='password'
                              className='form-control'
                              id='signupPassconfirm'
                              placeholder='تأكيد كلمة السر'
                              required
                              onChange={(e) => setpassconfirm(e.target.value)}
                            />
                          </div>
                          <button className='btn btn-primary w-100' type='submit'>تسجيل</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </detacontext.Consumer>
  );
};

export default LoginRegistr;
