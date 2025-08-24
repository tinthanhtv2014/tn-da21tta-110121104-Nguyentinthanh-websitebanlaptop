import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";

const DynamicSearchSort = ({
  initialListData = [],
  label = "Tất Cả",
  onCategoryChange,
  onChange,
}) => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    setListData(initialListData);
  }, [initialListData]);

  const handleChange = (key, newValue) => {
    const updatedListData = listData.map((item) =>
      item.key === key ? { ...item, value: newValue } : item
    );
    setListData(updatedListData);

    if (key === "categoryLv" && onCategoryChange) {
      onCategoryChange(newValue);
    }

    onChange(updatedListData);
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {listData.map((sort, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id={`label-${sort.key}`}>
              {sort.label || "Chọn"}
            </InputLabel>
            <Select
              labelId={`label-${sort.key}`}
              id={`sort-${sort.key}`}
              value={sort.value || ""}
              label={sort.label || "Chọn"}
              onChange={(e) => handleChange(sort.key, e.target.value)}
            >
              <MenuItem value="">{label}</MenuItem>
              {sort.listSelect?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
};

export default DynamicSearchSort;
