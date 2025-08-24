import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { adminMenu } from "../admin-menu"; // đường dẫn tuỳ thuộc folder

const NavBarAdmin = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "#fff",
        padding: "30px 20px",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "1px" },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#1f1f1f" }}>
        Quản lý hệ thống
      </Typography>
      <List>
        {adminMenu.map((item, idx) => {
          const isOpen = openSection === idx;
          const isActive = (path) => location.pathname === path;

          if (item.children) {
            return (
              <React.Fragment key={idx}>
                <ListItem
                  button
                  onClick={() => toggleSection(idx)}
                  sx={{
                    borderRadius: "12px",
                    color: "#1f1f1f",
                    "&:hover": { backgroundColor: "#8aad51" },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem, subIdx) => (
                      <ListItem
                        key={subIdx}
                        button
                        component={Link}
                        to={subItem.path}
                        sx={{
                          pl: 4,
                          borderRadius: "13px",
                          color: "#1f1f1f",
                          backgroundColor: isActive(subItem.path)
                            ? "#8aad51"
                            : "transparent",
                          "&:hover": { backgroundColor: "#8aad51" },
                        }}
                      >
                        <ListItemText primary={subItem.title} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItem
              key={idx}
              button
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "12px",
                color: "#1f1f1f",
                backgroundColor: isActive(item.path)
                  ? "#8aad51"
                  : "transparent",
                "&:hover": { backgroundColor: "#8aad51" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default NavBarAdmin;
