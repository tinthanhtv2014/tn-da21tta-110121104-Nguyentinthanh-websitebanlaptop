import React, { useState, useEffect } from "react";
import DynamicTable from "../../share-component/dynamicTable-component";
import DynamicSearchSort from "../../share-component/dynamicSearchSort";
import voucherService from "../../services/voucher-service";

import { Button } from "@mui/material";
import VoucherModalMui from "../modal/voucher-modal";
const API_URL = process.env.REACT_APP_API_BASE_URL;
const VoucherComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [voucher, setVoucher] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchVoucher();
  }, [searchTerm]);

  const fetchVoucher = async () => {
    const search = searchTerm;
    const response = await voucherService.getVouchers({ search });
    console.log("shadjlhdasd", response);
    setVoucher(response.listData || []);
  };

  // Hàm tìm kiếm dữ liệu
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = voucher.filter((item) => {
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
      key: "name",
      value: filterValue.name || "",
      listSelect: Array.from(new Set(voucher.map((u) => u.name))).map(
        (name) => ({
          id: name,
          name,
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
      const response = await voucherService.deleteVouchers(id);
      if (response) {
        fetchVoucher();
      }
    }
  };

  //data của dữ liệu
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "tên voucher" },
    { key: "code", label: "Mã code" },
    { key: "type", label: "loại voucher" },
    { key: "startDate", label: "thời gian bắt đầu" },
    { key: "expiryDate", label: "thời gian kết thúc" },
    { key: "discountAmount", label: "tiền giảm giá" },
    { key: "discountPercent", label: "phần trăm giảm giá" },
    { key: "maxDiscountValue", label: "giảm tối đa" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Danh sách mã khuyến mãi</h2>

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
        label="Chọn voucher"
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          ➕ Thêm voucher
        </Button>
      </div>
      {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
      <DynamicTable
        columns={columns}
        data={sortedData}
        onEdit={(id) => {
          const selectedUser = sortedData.find((u) => u.id === id);
          setEditingUser(selectedUser);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm("Bạn có chắc muốn xóa user này?")) {
            handleDeleteUser(id);
          }
        }}
      />
      <VoucherModalMui
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => fetchVoucher()}
        initialData={editingUser}
      />
    </div>
  );
};

export default VoucherComponent;
