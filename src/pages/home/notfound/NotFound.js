import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
function NotFound() {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div
              className="col-sm-10 col-sm-offset-1 text-center"
              style={{ width: '100%' }}
            >
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>
              <div className="contant_box_404">
                <h3 className="h2">Bạn đi lạc vào đâu đây?</h3>
                <p>Trang này không tồn tại, kiểm tra lại đê!</p>
                <Link to="/" className="link_404">
                  Quay Lại Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
