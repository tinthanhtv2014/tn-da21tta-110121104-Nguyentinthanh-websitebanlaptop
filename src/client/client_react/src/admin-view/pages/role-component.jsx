import React, { useState, useEffect } from "react";
import DynamicTable from "../../share-component/dynamicTable-component";
import DynamicSearchSort from "../../share-component/dynamicSearchSort";
import roleService from "../../services/role-service";
import RoleModalMui from "../modal/role-modal";
import { Button } from "@mui/material";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const RoleComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchRole();
  }, [searchTerm]);

  const fetchRole = async () => {
    const search = searchTerm;
    const response = await roleService.getRoles({ search });

    setUser(response.listData);
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
      key: "roleName",
      value: filterValue.fullName || "",
      listSelect: Array.from(new Set(user.map((u) => u.fullName))).map(
        (name) => ({
          id: name,
          name,
        })
      ),
    },
    {
      key: "listPermision",
      value: filterValue.emailAddress || "",
      listSelect: Array.from(new Set(user.map((u) => u.emailAddress))).map(
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
      const response = await roleService.deleteRole(id);
      if (response) {
        fetchRole();
      }
    }
  };

  //data của dữ liệu
  const columns = [
    { key: "id", label: "ID" },
    { key: "roleName", label: "tên phân quyền" },
    { key: "listPermision", label: "danh sách quyền" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Danh sách phân quyền</h2>

      {/* Giao diện tìm kiếm */}
      {/* <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      /> */}

      {/* Giao diện lọc động */}
      <DynamicSearchSort
        initialListData={listData}
        label="Chọn danh mục"
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
          ➕ Thêm phân quyền
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
      <RoleModalMui
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => fetchRole()}
        initialData={editingUser}
      />
    </div>
  );
};

export default RoleComponent;
