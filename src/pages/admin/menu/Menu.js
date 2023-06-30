import React, { useEffect, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Link, useNavigate } from "react-router-dom";

import AgricultureIcon from "@mui/icons-material/Agriculture";
import AnimationIcon from "@mui/icons-material/Animation";
import DnsIcon from "@mui/icons-material/Dns";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { getSupplier } from "../../../redux/actions/supplier.action";
export default function Menu() {
  const [open, setOpen] = React.useState({});
  const dispatch = useDispatch();
  const handleClick = (item) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [item]: !prevOpen[item],
    }));
  };

  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    dispatch(getSupplier());
  }, []);
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Đăng xuất thành công! Hẹn gặp lại", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Admin
        </ListSubheader>
      }
    >
      <ListItemButton onClick={() => handleClick("phu-tung")}>
        <ListItemIcon>
          <AgricultureIcon />
        </ListItemIcon>
        <ListItemText primary="Quản Lý Máy PHOTOCOPY" />
        {open["phu-tung"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["phu-tung"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/list-types">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AnimationIcon />
              </ListItemIcon>
              <ListItemText primary="Loại Máy PHOTOCOPY" />
            </ListItemButton>
          </Link>
          {/* <Link to="/list-products-admin">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText primary="Sản Phẩm Máy PHOTOCOPY" />
            </ListItemButton>
          </Link> */}
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("combo")}>
        <ListItemIcon>
          <UpcomingIcon />
        </ListItemIcon>
        <ListItemText primary="Quản Lý ComBo" />
        {open["combo"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["combo"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/list-combos">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AnimationIcon />
              </ListItemIcon>
              <ListItemText primary="Loại Combo" />
            </ListItemButton>
          </Link>
          <Link to="/list-products-combos-admin">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText primary="Sản Phẩm Combo" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("don-hang")}>
        <ListItemIcon>
          <AddReactionIcon />
        </ListItemIcon>
        <ListItemText primary="Quản Lý Đơn Hàng" />
        {open["don-hang"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["don-hang"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/order-customer">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AddTaskIcon />
              </ListItemIcon>
              <ListItemText primary="Đơn Hàng Của Máy PHOTOCOPY & Combo" />
            </ListItemButton>
          </Link>
          {/* <Link to="/list-products-admin">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText primary="Sản Phẩm Máy PHOTOCOPY" />
            </ListItemButton>
          </Link> */}
        </List>
      </Collapse>

      <ListItemButton onClick={() => handleClick("nha-cung-cap")}>
        <ListItemIcon>
          <AirportShuttleIcon />
        </ListItemIcon>
        <ListItemText primary="Quản Lý Nhà Cung Cấp" />
        {open["nha-cung-cap"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["nha-cung-cap"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/delivery">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Đơn Hàng Của Khách" />
            </ListItemButton>
          </Link>
          <Link to="/types-supplier">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DirectionsCarIcon />
              </ListItemIcon>
              <ListItemText primary="Nhà Cung Cấp" />
            </ListItemButton>
          </Link>
          <Link to="/prducts-supplier">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText primary="Sản Phẩm Nhà Cung Cấp" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>

      <ListItemButton onClick={() => handleClick("mua-nha-cung-cap")}>
        <ListItemIcon>
          <AirportShuttleIcon />
        </ListItemIcon>
        <ListItemText primary="Mua Hàng Từ Nhà Cung Cấp" />
        {open["mua-nha-cung-cap"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["mua-nha-cung-cap"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {listSupplier?.map((item, index) => (
            <Link to={`/shopsupplier/${item.link}`}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChecklistIcon />
                </ListItemIcon>
                <ListItemText primary={item?.name} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Collapse>

      <ListItemButton onClick={() => handleClick("quan-ly-kho-cung-cap")}>
        <ListItemIcon>
          <AirportShuttleIcon />
        </ListItemIcon>
        <ListItemText primary="Quản Lý Đơn Hàng Cung Cấp Của Tôi" />
        {open["quan-ly-kho-cung-cap"] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open["quan-ly-kho-cung-cap"]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/orderpage">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Đơn Hàng Đã Đặt" />
            </ListItemButton>
          </Link>
          <Link to="/cart-supplier">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Lên Đơn" />
            </ListItemButton>
          </Link>
          <Link to="/statistics">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Thống Kê" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
      <ListItemButton onClick={handlelogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Đăng Xuất" />
      </ListItemButton>
    </List>
  );
}
