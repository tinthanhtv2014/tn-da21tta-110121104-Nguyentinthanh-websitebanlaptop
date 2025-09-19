// src/share-component/CategoryListComponent.jsx
import React from "react";
import { Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import categoryService from "../../services/category-service";
const CategoryListComponent = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await categoryService.getCategory();
    if (response) {
      const withAll = [{ id: 0, name: "Tất cả" }, ...response];
      setCategories(withAll);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: { xs: 300, sm: 400, md: 450 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <CategoryIcon sx={{ mr: 1, color: "inherit" }} />
        Danh mục sản phẩm
      </Typography>

      <List
        sx={{
          flex: 1, // chiếm hết chỗ còn lại
          overflowY: "auto", // cho phép scroll
        }}
      >
        {categories &&
          categories.map((category) => (
            <ListItem
              button
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "inherit",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderLeft: "4px solid #ff9800",
                },
                marginBottom: 1,
              }}
            >
              <ListItemText
                primary={category.name}
                sx={{
                  fontWeight: "bold",
                  color: "inherit",
                  "&:hover": {
                    color: "#e91e63",
                  },
                }}
              />
            </ListItem>
          ))}
      </List>
    </Paper>
  );
};

export default CategoryListComponent;
