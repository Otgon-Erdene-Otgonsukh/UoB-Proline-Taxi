"use client";

import {
  Table, TableBody, TableHead, TableRow, TableContainer, Paper,
  Box,
  Button,
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import { DepartmentRecord } from "@/model/models";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledStickyTableCell } from "@/components/StyledTableCell";

const DepartmentManagePage = () => {

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);

  useEffect(() => {
    // getDepartmentManageList().then(res => {
    //   if (res.status === 200) {
    //     const data = await res.json();
    //     setDepartments(data);
    //   }
    // });
    const tmpDepartments = []
    for (let index = 0; index < 100; index++) {
      tmpDepartments.push({
        dep_id: index,
        dep_name: "Department " + index,
        manager: {
          time_created: "2026-01-01",
          user_id: 1,
          email: "manager@example.com",
          full_name: "Manager " + index,
          phone_number: "1234567890",
          role: "manager",
          user_status: 1
        },
        member_count: index
      })  
      setDepartments(tmpDepartments);
    }
  }, []);
  
  const [searchFormInput, setSearchFormInput] = useState({name: ""})

  const handleViewManager = (manager: DepartmentRecord["manager"]) => {
    console.log(manager);
  };

  const handleView = (department: DepartmentRecord) => {
    console.log(department);
  };

  const handleEdit = (department: DepartmentRecord) => {
    console.log(department);
  };

  const handleDelete = (department: DepartmentRecord) => {
    console.log(department)
  };

  const handleSubmitSearchForm = () => {
    console.log(searchFormInput);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Box
          component="form"
          onSubmit={handleSubmitSearchForm}
          sx={{
            display: "flex",
            gap: 2.5,
          }}
        >
          <TextField
            fullWidth
            label="Name"
            id="searchNameInput"
            value={searchFormInput.name}
            onChange={(e) => { setSearchFormInput({ ...searchFormInput, name: e.target.value }); }}
            size="small"
            sx={{ minWidth: 150 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#2c2c2c",
              color: "white",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 300,
              "&:hover": {
                bgcolor: "#414040",
                transform: "scale(1.01)",
              },
              transition: "all 0.2s",
            }}
            size="small"
          >
            Search
          </Button>
        </Box>
      </div>
      <Box>
        <TableContainer component={Paper} sx={{ boxShadow: "none", border: "none", maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 500}} aria-label="department table">
            <TableHead>
              <TableRow>
                <StyledStickyTableCell>Name</StyledStickyTableCell>
                <StyledStickyTableCell>Manager</StyledStickyTableCell>
                <StyledStickyTableCell>Member Count</StyledStickyTableCell>
                <StyledStickyTableCell>Operation</StyledStickyTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.dep_id}>
                  <StyledStickyTableCell>{department.dep_name}</StyledStickyTableCell>
                  <StyledStickyTableCell>
                    <Button onClick={() => handleViewManager(department.manager)}>
                      {department.manager.full_name}
                    </Button>
                  </StyledStickyTableCell>
                  <StyledStickyTableCell>{department.member_count}</StyledStickyTableCell>
                  <StyledStickyTableCell>
                    <div className="flex gap-2 justify-center">
                      <CustomizedButton type="primary" click={() => handleView(department)} title="View" />
                      <CustomizedButton type="warning" click={() => handleEdit(department)} title="Edit" />
                      <CustomizedButton type="error" click={() => handleDelete(department)} title="Delete" />
                    </div>
                  </StyledStickyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default DepartmentManagePage;