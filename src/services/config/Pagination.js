import React from 'react';
import { TablePagination } from '@mui/material';

const Pagination = ({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 25],
  onPageChange,
  onRowsPerPageChange,
  component = "div"
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component={component}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      sx={{
        fontFamily: "Inter, sans-serif",
        color: "#171A1F",
        "& .MuiTablePagination-selectLabel": {
          fontFamily: "Inter, sans-serif",
          color: "#171A1F"
        },
        "& .MuiTablePagination-select": {
          fontFamily: "Inter, sans-serif",
          color: "#171A1F"
        },
        "& .MuiTablePagination-displayedRows": {
          fontFamily: "Inter, sans-serif",
          color: "#171A1F"
        },
        "& .MuiTablePagination-actions": {
          fontFamily: "Inter, sans-serif",
          color: "#171A1F"
        }
      }}
    />
  );
};

export default Pagination;