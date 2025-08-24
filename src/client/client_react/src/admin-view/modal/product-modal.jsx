import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  InputAdornment,
  Grid, // Thêm Grid để tạo layout đẹp
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import categoryService from "../../services/category-service";
import productService from "../../services/product-service";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const ProductModalMui = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  seenUser,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0.0,
    image: [],
    imageFiles: [],
    type: "", // ← thêm dòng này
    brand: "",
    cpu: "",
    ram: "",
    storage: "",
    screen: "",
    graphics: "",
    os: "",
    ports: "",
    battery: "",
    weight: "",
    warranty: "",
    categoryId: 1,
    createdAt: "",
    accessoryType: "",
    connection: "",
    compatibleWith: "",
    importquantity: 0,
    importPrice: 0,
    manufactureYear: 0,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const response = await categoryService.getCategory();
    setCategories(response || []);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0.0,
        salePrice: 0.0,
        image: "",
        brand: "",
        cpu: "",
        ram: "",
        storage: "",
        screen: "",
        graphics: "",
        os: "",
        ports: "",
        battery: "",
        weight: "",
        warranty: "",
        categoryId: 1,
        createdAt: "",
        accessoryType: "",
        connection: "",
        compatibleWith: "",
        importquantity: 0,
        importPrice: 0,

        manufactureYear: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value?.id || 1,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Tên sản phẩm là bắt buộc!");
      return;
    }

    if (!formData.price || formData.price === 0) {
      toast.error("Giá không được bằng 0!");
      return;
    }

    if (
      formData.price &&
      formData.salePrice &&
      formData.salePrice > formData.price
    ) {
      toast.error("Giá giảm không được lớn hơn giá gốc!");
      return;
    }

    if (!formData.salePrice || formData.salePrice === 0) {
      formData.salePrice = formData.price;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("salePrice", formData.salePrice);
    formDataToSend.append("type", formData.type);

    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("importquantity", formData.importquantity);
    formDataToSend.append("importPrice", formData.importPrice);

    formDataToSend.append("manufactureYear", formData.manufactureYear);
    // Tùy vào type mà gửi thêm các trường cụ thể
    if (formData.type === "LAPTOP") {
      formDataToSend.append("cpu", formData.cpu);
      formDataToSend.append("ram", formData.ram);
      formDataToSend.append("storage", formData.storage);
      formDataToSend.append("screen", formData.screen);
      formDataToSend.append("graphics", formData.graphics);
      formDataToSend.append("os", formData.os);
      formDataToSend.append("ports", formData.ports);
      formDataToSend.append("battery", formData.battery);
      formDataToSend.append("weight", formData.weight);
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append("brand", formData.brand);
    } else if (formData.type === "ACCESSORY") {
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("accessoryType", formData.accessoryType);
      formDataToSend.append("connection", formData.connection);
      formDataToSend.append("compatibleWith", formData.compatibleWith);
      formDataToSend.append("warranty", formData.warranty);
    }

    // Thêm ảnh
    if (formData.imageFiles && formData.imageFiles.length > 0) {
      formData.imageFiles.forEach((file) => {
        formDataToSend.append("image", file);
      });
    }

    try {
      if (initialData?.id) {
        await productService.updateProducts(initialData.id, formDataToSend);
      } else {
        await productService.createProducts(formDataToSend);
        setFormData({
          name: "",
          description: "",
          price: "",
          brand: "",
          cpu: "",
          ram: "",
          storage: "",
          screen: "",
          graphics: "",
          os: "",
          ports: "",
          battery: "",
          weight: "",
          warranty: "",
          categoryId: 1,
          type: "",
          accessoryType: "",
          connection: "",
          compatibleWith: "",
          imageFiles: [],
          image: [],
          createdAt: "",
        });
      }

      onSubmit();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("Có lỗi xảy ra khi lưu sản phẩm!");
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      image: previews, // ảnh preview mới → không giữ ảnh cũ nữa
      imageFiles: files, // file ảnh mới
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {initialData ? "✏️ Cập nhật sản phẩm" : "➕ Thêm sản phẩm"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              value={
                categories.find(
                  (category) => category.id === formData.categoryId
                ) || null
              }
              options={categories}
              getOptionLabel={(option) => option.name}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField {...params} label="Danh mục" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tên sản phẩm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.name} // Kiểm tra xem giá trị có rỗng không
              helperText={!formData.name ? "Tên sản phẩm là bắt buộc" : ""} // Hiển thị thông báo lỗi
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle1">Ảnh sản phẩm</Typography>
            <Button variant="outlined" component="label">
              Chọn ảnh
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                mt: 2,
                p: 1,
                border: "1px solid #ccc",
                borderRadius: 2,
                maxHeight: 200,
              }}
            >
              {formData.imageFiles && formData.imageFiles.length > 0 ? (
                // Khi có ảnh mới chọn
                formData.imageFiles.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      minWidth: 150,
                      height: 120,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))
              ) : formData.image && formData.image.length > 0 ? (
                // Khi chưa chọn ảnh mới → hiện ảnh cũ từ server
                formData.image.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      minWidth: 150,
                      height: 120,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={
                        initialData?.linkCreate && img
                          ? `http://localhost:5002/uploads/product/${initialData.linkCreate}/${img}`
                          : ""
                      }
                      alt={`Preview ${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ padding: 2, color: "gray" }}>
                  No images available
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Loại sản phẩm</InputLabel>
              <Select
                label="Loại sản phẩm"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={!!initialData} // Disable nếu có dữ liệu khởi tạo
              >
                <MenuItem value="LAPTOP">Laptop</MenuItem>
                <MenuItem value="ACCESSORY">Phụ kiện</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Form Laptop - chỉ hiển thị nếu chọn Laptop */}
          {formData.type === "LAPTOP" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CPU"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="RAM"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bộ nhớ"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Màn hình"
                  name="screen"
                  value={formData.screen}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Đồ họa"
                  name="graphics"
                  value={formData.graphics}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hệ điều hành"
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cổng kết nối"
                  name="ports"
                  value={formData.ports}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pin"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Trọng lượng"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bảo hành"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Thương hiệu"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          {/* Form Accessory - chỉ hiển thị nếu chọn Phụ kiện */}
          {formData.type === "ACCESSORY" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Thương hiệu"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Loại phụ kiện"
                  name="accessoryType"
                  value={formData.accessoryType}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Kết nối"
                  name="connection"
                  value={formData.connection}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tương thích với"
                  name="compatibleWith"
                  value={formData.compatibleWith}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bảo hành"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá giảm"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số lượng nhập"
              name="importquantity"
              value={formData.importquantity}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá nhập"
              name="importPrice"
              value={formData.importPrice}
              onChange={handleChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Năm sản xuất"
              name="manufactureYear"
              value={formData.manufactureYear}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {seenUser === false ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {initialData ? "Cập nhật" : "Thêm mới"}
                </Button>
              ) : null}

              <Button variant="outlined" color="secondary" onClick={onClose}>
                Hủy
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductModalMui;
