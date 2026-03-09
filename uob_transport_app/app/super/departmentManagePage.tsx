"use client";

import {
  Table, TableBody, TableHead, TableRow, TableContainer, Paper,
  Box,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { DepartmentRecord } from "@/model/models";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledStickyTableCell } from "@/components/StyledTableCell";
import AddDepartmentDialog from "./departmentManageComponents/newDepartmentDialog";
import ViewManagerDialog from "./departmentManageComponents/viewManagerDialog";
import ViewDepartmentDialog from "./departmentManageComponents/viewDepartmentDialog";
import ConfirmDialog from "@/components/confirmDIalog";
import { getDepartmentManageList } from "./request";

const DepartmentManagePage = () => {

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [allDepartments, setAllDepartments] = useState<DepartmentRecord[]>([]);

  useEffect(() => {
    getDepartmentManageList().then(async (res) => {
      if (res.status === 200) {
        const data = await res.json()
        console.log(data);
        setAllDepartments(data);
        setDepartments(data);
      }
    });
  }, []);


  const [managerData, setManagerData] = useState<DepartmentRecord["manager"]>();
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)
  const handleViewManager = (manager: DepartmentRecord["manager"]) => {
    setManagerData(manager);
    setManagerDialogOpen(true);
  };

  const [departmentData, setDepartmentData] = useState<DepartmentRecord>();
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false)
  const handleView = (department: DepartmentRecord) => {
    setDepartmentData(department)
    setDepartmentDialogOpen(true)
  };

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const handleOpenConfirmDeleteDialog = (department: DepartmentRecord) => {
    setDepartmentData(department)
    setConfirmDeleteDialogOpen(true)
  };
  const handleDeleteDepartment = (department: DepartmentRecord) => {

    console.log(department);
  };

  const [searchFormInput, setSearchFormInput] = useState({ name: "" })
  const handleSubmitSearchForm = (e: React.SubmitEvent) => {
    e.preventDefault()
    console.log(searchFormInput);
    if (searchFormInput.name !== '') {
      setDepartments(allDepartments.filter(e => {
        return e.depName.indexOf(searchFormInput.name) !== -1
      }))
    } else {
      setDepartments(allDepartments)
    }
  }

  const [newDepartmentDialogOpen, setNewDepartmentDialogOpen] = useState(false)

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
          <Button
            fullWidth
            onClick={() => setNewDepartmentDialogOpen(true)}
            variant="contained"
            sx={{
              color: "white",
              borderRadius: "0.375rem",
              fontSize: "0.625rem",
              fontWeight: 300,
              "&:hover": {
                transform: "scale(1.01)",
              },
              transition: "all 0.2s",
            }}
            size="small"
          >
            New Department
          </Button>
        </Box>
      </div>
      {/* TODO Add Data loading */}
      <Box>
        <TableContainer component={Paper} sx={{ boxShadow: "none", border: "none", maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 500 }} aria-label="department table">
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
                <TableRow key={department.depId}>
                  <StyledStickyTableCell>{department.depName}</StyledStickyTableCell>
                  <StyledStickyTableCell>
                    {department.manager ?
                      (<Button onClick={() => handleViewManager(department.manager)}>
                        {department.manager.full_name}
                      </Button>) :
                      (<Chip
                        size="small"
                        color='default'
                        label="To be assigned"
                      />)}
                  </StyledStickyTableCell>
                  <StyledStickyTableCell>{department.userCount}</StyledStickyTableCell>
                  <StyledStickyTableCell>
                    <div className="flex gap-2 justify-center">
                      <CustomizedButton type="primary" click={() => handleView(department)} title="View" />
                      <CustomizedButton type="error" click={() => handleOpenConfirmDeleteDialog(department)} title="Delete" />
                    </div>
                  </StyledStickyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AddDepartmentDialog dialogOpen={newDepartmentDialogOpen} handleDialogClose={() => setNewDepartmentDialogOpen(false)} />
      {managerData && (<ViewManagerDialog viewData={managerData} dialogOpen={managerDialogOpen} handleDialogClose={() => setManagerDialogOpen(false)} />)}
      {departmentData && (<ViewDepartmentDialog viewData={departmentData} dialogOpen={departmentDialogOpen} handleDialogClose={() => { setDepartmentDialogOpen(false); setDepartmentData(undefined) }} />)}

      <ConfirmDialog
        open={confirmDeleteDialogOpen}
        dialogTitle="Confirm delete department"
        confirmMessage="Are you sure you want to delete this department?"
        confirmCallBack={() => { handleDeleteDepartment(departmentData!); setConfirmDeleteDialogOpen(false); }}
        cancelCallBack={() => setConfirmDeleteDialogOpen(false)}
      />
    </>
  );
};

export default DepartmentManagePage;