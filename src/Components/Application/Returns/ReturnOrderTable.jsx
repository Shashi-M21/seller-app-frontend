import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Box,
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { postCall } from "../../../Api/axios.js";
import cogoToast from "cogo-toast";
import { EditOutlined } from "@mui/icons-material";

const RETURN_ORDER_STATUS = {
  Return_Initiated: 'Return Initiated',
  Liquidated: 'Liquidated',
  Reject: 'Rejected',
  Rejected: 'Rejected',
}

const StyledTableCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    fontWeight: 'bold'
  },
});

const ActionMenu = ({ row, handleRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleClick = (e) => {
    setOrderStatus(null);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setOrderStatus(null);
    setAnchorEl(null);
  };

  const updateReturnState = () => {
    const url = `/api/v1/orders/${row.orderId}/item/return`;
    const data = {
      id: row._id,
      state: orderStatus
    }
    postCall(url, data)
      .then((resp) => {
        cogoToast.success("Status updated successfully");
        handleClose();
        handleRefresh();
      })
      .catch((error) => {
        console.log(error);
        cogoToast.error(error.response?.data?.error || error.message);
      });
  };

  return (
    <>
      <Tooltip title="Update status">
        <IconButton color="primary" disabled={row.state !== "Return_Initiated"}>
          <EditOutlined onClick={handleClick} />
        </IconButton>
      </Tooltip>
      <Popover
        id="edit-order-status"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: '400px', p: 2 }}>
          <Stack direction="column" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderStatus}
                label="Select Status"
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <MenuItem value={RETURN_ORDER_STATUS.Liquidated}>Liquidate</MenuItem>
                <MenuItem value={RETURN_ORDER_STATUS.Reject}>Reject</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" variant="outlined" onClick={handleClose}>Cancel</Button>
              <Button size="small" variant="contained" onClick={updateReturnState}>Update</Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default function InventoryTable(props) {
  const { page, rowsPerPage, totalRecords, handlePageChange, handleRowsPerPageChange, handleRefresh } = props

  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10))
    handlePageChange(0)
  };

  const renderCellContent = (column, value) => {
    if (typeof value === "boolean") {
      return (
        <div>
          <span className="ml-2">
            {value === false || value === null ? "No" : "Yes"}
          </span>
        </div>
      );
    } else {
      return column.format ? column.format(value) : value;
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className="font-medium"
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell
                  key="action-header"
                  className="font-medium"
                >
                  Action
                </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={index}
                  >
                    {props.columns.map((column, idx) => {
                      const value = row[column.id];
                      if(column.id === "state"){
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {RETURN_ORDER_STATUS[value]}
                          </TableCell>
                        );
                      }else{
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {renderCellContent(column, value)}
                          </TableCell>
                        );
                      }
                    })}
                    <TableCell component="th" scope="row">
                      <ActionMenu row={row} handleRefresh={handleRefresh} />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
