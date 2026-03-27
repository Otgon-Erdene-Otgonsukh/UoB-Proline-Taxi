"use client";

import {
  Box, 
  IconButton, 
  TextField, 
  Typography, 
  useTheme 
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { DepartmentRecord } from "@/model/models";
import { DepartmentTable } from "@/components/SuperDepartmentsTable";
import ViewManagerDialog from "./viewManagerDialog";
import ViewDepartmentDialog from "./viewDepartmentDialog";
import ConfirmDialog from "@/components/confirmDIalog";
import CustomizedButton from "@/components/CustomizedButton";
import AddDepartmentDialog from "./newDepartmentDialog";
import { deleteDepartment, getDepartmentManageList } from "../request";

const DepartmentManagePage = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    _rerenderTable()
  }, []);

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [departmentCount, setDepartmentCount] = useState(0)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPaginationMeta({
      ...paginationMeta,
      page: newPage
    })
    setIsLoading(true);
    _rerenderTable()
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    setIsLoading(true)
    _rerenderTable()
  };

  // search form
  type SearchFormProps = {
    name?: string,
  }
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    name: '',
  })
  const handleSubmitSearchForm = (e: React.FormEvent) => {
    e.preventDefault()
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    })
    setIsLoading(true)
    _rerenderTable()
  }

  const [managerData, setManagerData] = useState<DepartmentRecord["manager"]>();
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)
  const handleViewManager = (manager: DepartmentRecord["manager"]) => {
    setManagerData(manager);
    setManagerDialogOpen(true);
  };

  const [departmentData, setDepartmentData] = useState<DepartmentRecord>();
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false)
  const handleViewDepartment = (department: DepartmentRecord) => {
    setDepartmentData(department)
    setDepartmentDialogOpen(true)
  };

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const handleDeleteDepartmentConfirm = (department: DepartmentRecord) => {
    deleteDepartment(department.depId).then(async (res) => {
      if (res.status === 200) {
        setIsLoading(true)
        _rerenderTable()
      }
    });
  };

  const [newDepartmentDialogOpen, setNewDepartmentDialogOpen] = useState(false)
  const handleNewDepartmentDialogOpen = () => {
    setNewDepartmentDialogOpen(true)
  }

  const _rerenderTable = () => {
    getDepartmentManageList().then(async (res) => {
      if (res.status === 200) {
        const data = await res.json()
        let filteredData = data;
        if (searchFormInput.name) {
          filteredData = data.filter((d: DepartmentRecord) =>
            d.depName.toLowerCase().includes((searchFormInput.name || '').toLowerCase())
          )
        }

        const startIndex = paginationMeta.page * paginationMeta.pageSize;
        const endIndex = startIndex + paginationMeta.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setDepartments(paginatedData)
        setDepartmentCount(filteredData.length)
        setIsLoading(false)
      }
    });
  }

  return (<>
    <div>
      <div className="flex justify-between items-center mb-4 px-20">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20 py-2 pr-4">
            Departments
          </h1>
        </div>

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
          <CustomizedButton title="Search" type="warning" click={() => { }} />
          <CustomizedButton
            title="+"
            type="warning"
            click={handleNewDepartmentDialogOpen}
          />
        </Box>
      </div>
    </div>
    {isLoading ? (
      <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
        Getting department data...
      </Typography>
    ) : departments.length === 0 ? (
      <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
        No departments to show.
      </Typography>
    ) : (
      <div className="mt-7">
        <DepartmentTable
          data={departments}
          count={departmentCount}
          page={paginationMeta.page}
          pageSize={paginationMeta.pageSize}
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangePageSize}
          onViewDetails={handleViewDepartment}
          onViewManager={handleViewManager}
          onDeleteDepartment={(d) => { setDepartmentData(d); setConfirmDeleteDialogOpen(true); }}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    )}

    <AddDepartmentDialog
      dialogOpen={newDepartmentDialogOpen}
      handleDialogClose={() => {
        setNewDepartmentDialogOpen(false);
        setIsLoading(true);
        _rerenderTable();
      }}
    />

    {managerData && (
      <ViewManagerDialog
        viewData={managerData}
        dialogOpen={managerDialogOpen}
        handleDialogClose={() => setManagerDialogOpen(false)}
      />
    )}

    {departmentData && (
      <ViewDepartmentDialog
        departmentList={departments.map((d) => ({ depId: d.depId, depName: d.depName }))}
        viewData={departmentData}
        dialogOpen={departmentDialogOpen}
        handleDialogClose={() => {
          setDepartmentDialogOpen(false);
          setDepartmentData(undefined);
          setIsLoading(true);
          _rerenderTable();
        }}
        notifyUserCountChange={() => {
          setIsLoading(true);
          _rerenderTable();
        }}
        notifyDepartmentNameChange={() => {
          setIsLoading(true);
          _rerenderTable();
        }}
      />
    )}

    <ConfirmDialog
      open={confirmDeleteDialogOpen}
      dialogTitle="Confirm delete department"
      confirmMessage="Are you sure you want to delete this department? If there are still users in this department, they will be moved to 'Unassigned' department."
      confirmCallBack={() => {
        handleDeleteDepartmentConfirm(departmentData!);
        setConfirmDeleteDialogOpen(false);
      }}
      cancelCallBack={() => setConfirmDeleteDialogOpen(false)}
    />
  </>)
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

export default DepartmentManagePage;