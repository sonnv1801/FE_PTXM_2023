import React, { useEffect, useState } from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Logo from '../../assets/logo1.png';
import { NavBarMobileAdmin } from './NavBarMobileAdmin';
import WavingHandIcon from '@mui/icons-material/WavingHand';
const NavbarAdmin = () => {
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }

  const user = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem('token');

    navigate('/login');
    toast.success('Đăng xuất thành công! Hẹn gặp lại', {
      position: toast.POSITION.TOP_RIGHT,
    });
    refreshPage();
  };

  return (
    <>
      <div id="lg-navbar-desktop">
        <div style={{ marginTop: '8rem' }}></div>
        <nav className="nav-container">
          <ul>
            <li>
              <Link to="/" title="Trang chủ">
                <img src={Logo} alt="logo" style={{ width: '100px' }} />
              </Link>
            </li>
            <li>
              <Link to="/" title="Phụ tùng xe máy">
                <WavingHandIcon /> Xin Chào {user?.fullname}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <NavBarMobileAdmin
        refreshPage={refreshPage}
        user={user}
        handlelogout={handlelogout}
      />
    </>
  );
};

export default NavbarAdmin;
