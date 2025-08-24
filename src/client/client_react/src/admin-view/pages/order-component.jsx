import React, { useState, useEffect } from "react";
import DynamicTable from "../../share-component/dynamicTable-component";
import DynamicSearchSort from "../../share-component/dynamicSearchSort";
import orderService from "../../services/order-service";
import OrderModalMui from "../modal/order-modal";
import { Button } from "@mui/material";

const OrderComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [seenUser, setSeenUser] = useState(false);
  const orderStatusMap = {
    pending: "Chờ xác nhận",
    preparing: "Đang soạn hàng",
    delivering: "Đang giao",
    success: "Giao thành công",
    cancelled: "Đã hủy",
  };
  useEffect(() => {
    fetchOrder();
  }, [searchTerm]);

  const fetchOrder = async () => {
    const search = searchTerm;
    const response = await orderService.getOrder({ search });
    const list = response.listData.map((item) => ({
      ...item,
      orderStatusText: orderStatusMap[item.orderStatus],
      paymentStatusText:
        item.paymentStatus === false ? "Chưa thanh toán" : "Đã thanh toán",
      listProduct: JSON.parse(item.listProducts),
      userInfor: JSON.parse(item.user_info),
    }));

    setUser(list);
  };
  // Hàm tìm kiếm dữ liệu
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = user.filter((item) => {
    const matchSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchFilter = Object.entries(filterValue).every(([key, value]) =>
      value ? item[key] === value : true
    );
    return matchSearch && matchFilter;
  });

  // Sắp xếp dữ liệu
  const sortedData = filteredData.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === "desc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === "desc" ? 1 : -1;
    return 0;
  });

  // List data cho C_SortList
  const listData = [
    {
      key: "orderStatusText",
      value: filterValue.orderStatusText || "",
      listSelect: Array.from(new Set(user.map((u) => u.orderStatusText))).map(
        (name) => ({
          id: name,
          name,
        })
      ),
    },
    {
      key: "paymentStatusText",
      value: filterValue.paymentStatusText || "",
      listSelect: Array.from(new Set(user.map((u) => u.paymentStatusText))).map(
        (email) => ({
          id: email,
          name: email,
        })
      ),
    },
  ];

  // Hàm thay đổi bộ lọc
  const handleFilterChange = (updatedListData) => {
    const updatedFilterValue = updatedListData.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    setFilterValue(updatedFilterValue); // Cập nhật giá trị bộ lọc
  };

  //hàm tạo và cập nhật

  const handleDeleteUser = async (id) => {
    if (id) {
      const response = await orderService.deleteOrder(id);
      if (response) {
        fetchOrder();
      }
    }
  };

  //data của dữ liệu
  const columns = [
    { key: "orderId", label: "mã đơn hàng" },
    { key: "orderStatusText", label: "Trạng thái đơn hàng" },
    { key: "paymentStatusText", label: "Trạng thái thanh toán" },
    { key: "paymentMethod", label: "Phương thức thanh toán" },
    { key: "totalOrderPrice", label: "Tổng tiền" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Danh sách đơn hàng</h2>

      {/* Giao diện tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      {/* Giao diện lọc động */}
      <DynamicSearchSort
        initialListData={listData}
        label="Chọn tất cả"
        onCategoryChange={(newCategory) => console.log(newCategory)} // Xử lý thay đổi danh mục (nếu có)
        onChange={handleFilterChange} // Cập nhật bộ lọc khi người dùng chọn
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          ➕ Thêm phân quyền
        </Button> */}
      </div>
      {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
      <DynamicTable
        columns={columns}
        data={sortedData}
        onEdit={(id) => {
          const selectedUser = sortedData.find((u) => u.id === id);
          setEditingUser(selectedUser);
          setShowModal(true);
          setSeenUser(false);
        }}
        // onDelete={(id) => {
        //   if (window.confirm("Bạn có chắc muốn xóa user này?")) {
        //     handleDeleteUser(id);
        //   }
        // }}
        onSeen={(id) => {
          const selectedUser = sortedData.find((u) => u.id === id);
          setEditingUser(selectedUser);
          setShowModal(true);
          setSeenUser(true);
        }}
      />
      <OrderModalMui
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => fetchOrder()}
        initialData={editingUser}
        seenUser={seenUser}
      />
    </div>
  );
};

export default OrderComponent;
