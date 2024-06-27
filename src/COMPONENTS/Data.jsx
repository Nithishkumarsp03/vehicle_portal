import React, { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import Input from "@mui/joy/Input";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "./data.css";

const DataTable = () => {
  const { userid, username } = useParams();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  console.log(search);

  const updateStatus = async (from_datetime, status, key) => {
    try {
      const response = await fetch("http://localhost:8000/api/updateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_datetime,
          status,
          key,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Username",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "user_id",
      headerName: "UserID",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "from_datetime",
      headerName: "From Date Time",
      width: 170,
      headerClassName: "bold-header",
    },
    {
      field: "to_datetime",
      headerName: "To Date Time",
      width: 170,
      headerClassName: "bold-header",
    },
    {
      field: "starting_place",
      headerName: "Starting Place",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "ending_place",
      headerName: "Destination",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "purpose",
      headerName: "Industry/Company",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type of Trip",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "passengers",
      headerName: "Passengers",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "driver",
      headerName: "Drivers",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 300,
      headerClassName: "bold-header",  
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "cancel",
      headerName: "Cancellation",
      headerClassName: "bold-header",
      width: 130,
      renderCell: (params) => {
        const handleCancel = async () => {
          await updateStatus(params.row.from_datetime, 0, params.row.key);
        };
        return (
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        );
      },
    },
    {
      field: "view",
      headerName: "View",
      headerClassName: "bold-header",
      width: 130,
      renderCell: (params) => {
        const handleView = () => {
          setSelectedRow(params.row);
          setOpen(true);
        };
        return (
          <Button
            className="view"
            onClick={handleView}
            variant="outlined"
            color="primary"
            size="small"
          >
            View
          </Button>
        );
      },
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const reversedData = data.reverse();
      const mappedRows = reversedData.map((item, index) => {
        const formattedFromDateTime = moment(item.FROM_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedToDateTime = moment(item.TO_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const status =
          item.STATUS === "0" ? "Cancelled" : item.STATUS === "1" ?  "Pending" : "Approved";
        return {
          id: index + 1,
          name: item.NAME,
          user_id: item.USER_ID,
          from_datetime: formattedFromDateTime,
          to_datetime: formattedToDateTime,
          starting_place: item.STARTING_PLACE,
          ending_place: item.ENDING_PLACE,
          purpose: item.PURPOSE,
          type: item.TYPE,
          passengers: item.PASSENGERS,
          driver: item.DRIVER,
          vehicle: item.VEHICLE,
          remarks: item.REMARKS,
          status,
          key: item.ID,
        };
      });
      setRows(mappedRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };


  return (
    <>
    <div style={{display: "flex"}}>
      <h2>Welcome {username}, </h2>
    </div>
      

      <div className="table">
        <Input
          type="text"
          className="search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          rowClassName={(params) =>
            params.row.status === "Approved" ? "" : "cancelled-row"
          }
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ fontSize: "25px", textAlign: "center" }}>
          Trip Details
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <div>
              {/* <p><strong>ID:</strong> {selectedRow.id}</p> */}
              <p className="dialogue">
                <strong>Username:</strong> {selectedRow.name}
              </p>
              <p className="dialogue">
                <strong>UserID:</strong> {selectedRow.user_id}
              </p>
              <p className="dialogue">
                <strong>From Date Time:</strong> {selectedRow.from_datetime}
              </p>
              <p className="dialogue">
                <strong>To Date Time:</strong> {selectedRow.to_datetime}
              </p>
              <p className="dialogue">
                <strong>Starting Place:</strong> {selectedRow.starting_place}
              </p>
              <p className="dialogue">
                <strong>Destination:</strong> {selectedRow.ending_place}
              </p>
              <p className="dialogue">
                <strong>Industry/Company:</strong> {selectedRow.purpose}
              </p>
              <p className="dialogue">
                <strong>Type of Trip:</strong> {selectedRow.type}
              </p>
              <p className="dialogue">
                <strong>Passengers:</strong> {selectedRow.passengers}
              </p>
              <p className="dialogue">
                <strong>Drivers:</strong> {selectedRow.driver}
              </p>
              <p className="dialogue">
                <strong>Vehicle:</strong> {selectedRow.vehicle}
              </p>
              <p className="dialogue">
                <strong>Remarks:</strong> {selectedRow.remarks}
              </p>
              <p className="dialogue">
                <strong>Status:</strong> {selectedRow.status}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataTable;
