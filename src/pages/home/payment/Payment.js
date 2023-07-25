import React from 'react';
import './style.css';
import Form from 'react-bootstrap/Form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
export const Payment = () => {
  return (
    <div className="payment-container">
      <div className="body-container-payment">
        <h1>Thông tin thanh toán</h1>
        <div className="account-payment">
          <p>Bạn có tài khoản chưa? </p>
          <Button variant="contained" endIcon={<ArrowRightIcon />}>
            Đăng nhập ngay?
          </Button>
        </div>
        <div className="infomation-users">
          <Form.Group className="formgroup-body">
            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" required />
            <div className="row">
              <div className="col-6">
                <Form.Label>Họ và tên:* </Form.Label>
                <Form.Control type="text" required />
              </div>
              <div className="col-6">
                <Form.Label>Số điện thoại:* </Form.Label>
                <Form.Control type="number" required />
              </div>
            </div>

            <Form.Label>Địa chỉ:* </Form.Label>
            <Form.Control type="text" required />
            <Form.Label>Ghi Chú: </Form.Label>
            <FloatingLabel controlId="floatingTextarea2" label="Ghi chú">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}
              />
            </FloatingLabel>
          </Form.Group>
        </div>
        <hr />
        <div className="payments-money">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Hình thức thanh toán
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Thanh toán khi nhận hàng"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Thanh toán khi nhận hàng"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <hr />
        <div className="payments">
          <Button variant="contained">Thanh toán</Button>
        </div>
      </div>
    </div>
  );
};
