"use client";

import {
  Table, TableBody, TableHead, TableRow, TableContainer, Paper,
  Box,
  Button
} from "@mui/material";
import { useState, useEffect } from "react";
import { DepartmentRecord } from "@/model/models";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledTableCell } from "@/components/StyledTableCell";

const DepartmentManagePage = () => {

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);

  useEffect(() => {
    // getDepartmentManageList().then(res => {
    //   if (res.status === 200) {
    //     const data = await res.json();
    //     setDepartments(data);
    //   }
    // });
    setDepartments([
      {
        dep_id: 1,
        dep_name: "Department 1",
        manager: {
          time_created: "2026-01-01",
          user_id: 1,
          email: "manager@example.com",
          full_name: "Manager 1",
          phone_number: "1234567890",
          role: "manager",
          user_status: 1
        },
        member_count: 10
      }
    ]);
  }, []);

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

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none", border: "none" }}>
        <Table sx={{ minWidth: 500, borderCollapse: "collapse" }} aria-label="department table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Manager</StyledTableCell>
              <StyledTableCell>Member Count</StyledTableCell>
              <StyledTableCell>Operation</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.dep_id}>
                <StyledTableCell>{department.dep_name}</StyledTableCell>
                <StyledTableCell>
                  <Button onClick={() => handleViewManager(department.manager)}>
                    {department.manager.full_name}
                  </Button>
                </StyledTableCell>
                <StyledTableCell>{department.member_count}</StyledTableCell>
                <StyledTableCell>
                  <div className="flex gap-2 justify-center">
                    <CustomizedButton type="primary" click={() => handleView(department)} title="View" />
                    <CustomizedButton type="warning" click={() => handleEdit(department)} title="Edit" />
                    <CustomizedButton type="error" click={() => handleDelete(department)} title="Delete" />
                  </div>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepartmentManagePage;