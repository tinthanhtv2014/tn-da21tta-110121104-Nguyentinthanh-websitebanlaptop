import React, { useState, useEffect } from "react";
import DynamicTable from "../../share-component/dynamicTable-component";
import DynamicSearchSort from "../../share-component/dynamicSearchSort";
import productService from "../../services/product-service";
import commentService from "../../services/comment-service";
import ProductModalMui from "../modal/product-modal";
import { Button } from "@mui/material";
import accountService from "../../services/user-service";
const API_URL = process.env.REACT_APP_API_BASE_URL_PRODUCTS;
const CommentComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [comment, setComment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [seenUser, setSeenUser] = useState(false);
  useEffect(() => {
    fetchComment();
  }, [searchTerm]);

  const formatDateFolder = (isoDate) => {
    const date = new Date(isoDate);

    const pad = (n) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
  };

  const fetchComment = async () => {
    const search = searchTerm;

    const response = await commentService.getComment({ search });
    const userId = Array.from(
      new Set(response.listData.map((item) => item.userId).filter(Boolean))
    );

    const productId = Array.from(
      new Set(response.listData.map((item) => item.product_id).filter(Boolean))
    );
    const [productData, userData] = await Promise.all([
      fetchProduct(productId),
      fetchUser(userId),
    ]);

    const ProductWithImageUrl = productData.map((product) => {
      let imageArray = [];
      const folderName = product.createdAt
        ? new Date(product.createdAt)
            .toISOString()
            .split(".")[0]
            .replace(/[-:]/g, "")
        : "unknown-date";

      try {
        imageArray = product.image ? JSON.parse(product.image) : [];
      } catch (err) {
        console.error("Lỗi parse ảnh:", err);
      }

      // Parse thông tin laptop hoặc accessory
      let extraData = {};
      if (product.laptop) {
        const { id, ...restLaptop } = product.laptop;
        extraData = {
          laptopId: id,
          ...restLaptop,
        };
      } else if (product.accessory) {
        const { id, ...restAccessory } = product.accessory;
        extraData = {
          accessoryId: id,
          ...restAccessory,
        };
      }

      return {
        ...product,
        ...extraData,
        imageUrl:
          imageArray.length > 0
            ? `${API_URL}/uploads/product/${folderName}/${imageArray[0]}`
            : null,
        image: imageArray.length > 0 ? imageArray : null,
        linkCreate: folderName,
        typeName: product?.type === "accessory" ? "Phụ kiện điện tử" : "Laptop",
        priceFormat: product?.price ? product.price.toLocaleString("vi-VN") : 0,
      };
    });

    const productMap = new Map(ProductWithImageUrl.map((p) => [p.id, p]));
    const userMap = new Map(userData.map((u) => [u.id, u]));

    const mergedData = response.listData.map((item) => {
      const product = productMap.get(item.product_id) || null;
      const user = userMap.get(item.userId) || null;
      const { id: _productId, ...productWithoutId } = product || {};
      const { id: _userId, ...userWithoutId } = user || {};
      return {
        ...item,
        ...productWithoutId,
        ...userWithoutId,
      };
    });

    setComment(mergedData || []);
  };

  const fetchProduct = async (listId) => {
    const response = await productService.getProducts({
      sortList: [{ key: "id", value: listId }],
    });
    return response.listData;
  };
  const fetchUser = async (listId) => {
    const response = await accountService.getUsersSortList({
      sortList: [{ key: "id", value: listId }],
    });
    return response.users;
  };

  // Hàm tìm kiếm dữ liệu
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = comment.filter((item) => {
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
      listSelect: Array.from(new Set(comment.map((u) => u.name))).map(
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
      const response = await commentService.deleteComment(id);
      if (response) {
        await fetchComment();
      }
    }
  };

  //data của dữ liệu
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên sản phẩm" },
    { key: "imageUrl", label: "Hình ảnh", isImage: true },
    { key: "content", label: "Nội dung" },
    { key: "rating", label: "Điểm" },
    { key: "fullName", label: "Người dùng" },
    { key: "createDate", label: "Thời gian tạo" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Danh sách bình luận</h2>

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
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          ➕ Thêm sản phẩm
        </Button> */}
      </div>
      {/* Hiển thị table với dữ liệu đã lọc và sắp xếp */}
      <DynamicTable
        columns={columns}
        data={sortedData}
        // onEdit={(id) => {
        //   const selectedUser = sortedData.find((u) => u.id === id);
        //   setEditingUser(selectedUser);
        //   setShowModal(true);
        //   setSeenUser(false);
        // }}
        onDelete={(id) => {
          if (window.confirm("Bạn có chắc muốn xóa user này?")) {
            handleDeleteUser(id);
          }
        }}
        // onSeen={(id) => {
        //   const selectedUser = sortedData.find((u) => u.id === id);
        //   setEditingUser(selectedUser);
        //   setShowModal(true);
        //   setSeenUser(true);
        // }}
      />
      {/* <ProductModalMui
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => fetchComment()}
        initialData={editingUser}
        seenUser={seenUser}
      /> */}
    </div>
  );
};

export default CommentComponent;
