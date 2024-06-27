import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "./data.css";
import DriverSelect from "./Driverselect";
import VehicleSelect from "./Vehicleselect";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [selectedVehicles, setSelectedVehicles] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelDescription, setCancelDescription] = useState("");
  const [currentCancelParams, setCurrentCancelParams] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const updateStatus = async (
    from_datetime,
    status,
    key,
    driver,
    vehicle,
    description = ""
  ) => {
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
          driver,
          vehicle,
          description,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setSuccessMessage("Action was successful!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancelClick = (params) => {
    setCurrentCancelParams(params);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (currentCancelParams) {
      await updateStatus(
        currentCancelParams.row.from_datetime,
        0,
        currentCancelParams.row.key,
        selectedDrivers[currentCancelParams.row.id],
        selectedVehicles[currentCancelParams.row.id],
        cancelDescription
      );
      setOpenCancelDialog(false);
      setCancelDescription("");
    }
  };

  const handleApprove = async () => {
    if (selectedRow) {
      const driver = selectedDrivers[selectedRow.id] || selectedRow.driver;
      const vehicle = selectedVehicles[selectedRow.id] || selectedRow.vehicle;
      await updateStatus(
        selectedRow.from_datetime,
        2, // Approve status code
        selectedRow.key,
        driver,
        vehicle
      );
      setSelectedDrivers((prev) => ({ ...prev, [selectedRow.id]: "" }));
      setSelectedVehicles((prev) => ({ ...prev, [selectedRow.id]: "" }));
      setOpenDetailDialog(false);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Username",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "user_id",
      headerName: "UserID",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 350,
      headerClassName: "bold-header",
    },
    {
      field: "phonenumber",
      headerName: "Contact",
      width: 130,
      headerClassName: "bold-header",
    },
    {
      field: "design",
      headerName: "Designation",
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
      headerName: "StartingPlace",
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
      width: 300,
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
      field: "view",
      headerName: "View",
      width: 130,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          className="view"
          onClick={() => {
            setSelectedRow(params.row);
            setOpenDetailDialog(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/approval", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const mappedRows = data.map((item, index) => {
        const formattedFromDateTime = moment(item.FROM_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedToDateTime = moment(item.TO_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return {
          id: index + 1,
          name: item.NAME,
          user_id: item.USER_ID,
          email: item.EMAIL,
          phonenumber: item.PHONENUMBER,
          design: item.DESIGNATION,
          from_datetime: formattedFromDateTime,
          to_datetime: formattedToDateTime,
          starting_place: item.STARTING_PLACE,
          ending_place: item.ENDING_PLACE,
          purpose: item.PURPOSE,
          type: item.TYPE,
          passengers: item.PASSENGERS,
          driver: item.DRIVER,
          vehicle: item.VEHICLE,
          status: item.STATUS === "1" ? "Waiting for Approval" : "Approved",
          key: item.ID,
        };
      });
      setRows(mappedRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="table">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        rowClassName={(params) => {
          return params.row.status === "Approved" ? "" : "cancelled-row";
        }}
      />
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
      >
        <DialogTitle>Trip Details</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <div>
              <p>
                <strong>ID:</strong> {selectedRow.id}
              </p>
              <p>
                <strong>Username:</strong> {selectedRow.name}
              </p>
              <p>
                <strong>UserID:</strong> {selectedRow.user_id}
              </p>
              <p>
                <strong>Email:</strong> {selectedRow.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRow.phonenumber}
              </p>
              <p>
                <strong>Designation:</strong> {selectedRow.design}
              </p>
              <p>
                <strong>From Date Time:</strong> {selectedRow.from_datetime}
              </p>
              <p>
                <strong>To Date Time:</strong> {selectedRow.to_datetime}
              </p>
              <p>
                <strong>Starting Place:</strong> {selectedRow.starting_place}
              </p>
              <p>
                <strong>Destination:</strong> {selectedRow.ending_place}
              </p>
              <p>
                <strong>Industry/Company:</strong> {selectedRow.purpose}
              </p>
              <p>
                <strong>Type of Trip:</strong> {selectedRow.type}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Passengers:</strong> {selectedRow.passengers}
              </p>
              <div className="full-page-container">
                <DriverSelect
                  className="full-page-select"
                  value={selectedDrivers[selectedRow.id] || selectedRow.driver}
                  onChange={(value) => {
                    console.log("Selected Driver:", value);
                    setSelectedDrivers((prev) => ({
                      ...prev,
                      [selectedRow.id]: value,
                    }));
                  }}
                />
              </div>

              <br />
              <div className="full-page-container">
                <VehicleSelect
                  className="full-page-select"
                  value={
                    selectedVehicles[selectedRow.id] || selectedRow.vehicle
                  }
                  onChange={(value) => {
                    console.log("Selected Vehicle:", value);
                    setSelectedVehicles((prev) => ({
                      ...prev,
                      [selectedRow.id]: value,
                    }));
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
          <Button
            onClick={() => handleCancelClick({ row: selectedRow })}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a description for the cancellation:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cancel-description"
            label="Cancellation Description"
            fullWidth
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleCancelConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTable;
