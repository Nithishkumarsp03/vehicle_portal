import React, { useState, useCallback, useEffect } from 'react';
import Input from "@mui/joy/Input";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog } from '@mui/material';
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { CloudUpload } from "@mui/icons-material";
import './data.css';

export default function Driver() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState('');
  const [vehicleRc, setvehicleRc] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "vehicleName",
      headerName: "Name",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "regNumber",
      headerName: "Reg.Number",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "fuel",
      headerName: "fuel",
      width: 120,
      headerClassName: "bold-header",
    },
    {
      field: "mileage",
      headerName: "Mileage",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleViewDetails(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/vehicledata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const mappedRows = data.map((item, index) => ({
        id: index + 1,
        vehicleName: item.NAME,
        regNumber: item.NUMBER,
        fuel: item.FUEL,
        mileage: item.MILEAGE,
        key: item.ID,
        vehicleRc: item.IMAGE, // Store license path for each row
      }));
      setRows(mappedRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload = (event) => {
    setvehicleRc(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!vehicleName || !regNumber || !fuel || !mileage || !vehicleRc) {
      alert("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("vehicleName", vehicleName);
    formData.append("regNumber", regNumber);
    formData.append("fuel", fuel);
    formData.append("mileage", mileage);
    formData.append("vehicleRc", vehicleRc);

    try {
      const response = await fetch("http://localhost:8000/api/uploadvehicleDetails", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload driver details");
      }
      setSuccessDialogOpen(true); // Open success dialog
      setOpen(false); // Close upload dialog
      fetchData(); // Fetch updated data
    } catch (error) {
      console.error("Error uploading driver details:", error);
      alert("Failed to upload driver details");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setVehicleName('');
    setRegNumber('');
    setFuel('');
    setMileage('');
    setvehicleRc(null);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleViewDetails = (driver) => {
    setSelectedVehicle(driver);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  return (
    <div style={{ gap: "20px", display: "flex", flexDirection: "column" }}>
      <div onClick={() => setOpen(true)}>
        <button className='adddriver'>
          Add Vehicle<i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div>
        {/* <Input /> */}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vehicle Details</DialogTitle>
        <DialogContent>
          <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label>
                <h5>Vehicle Name</h5>
                <Input value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
              </label>
              <label>
                <h5>Registration number</h5>
                <Input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
              </label>
            </div>
            <label>
              <h5>Fuel</h5>
              <Input value={fuel} placeholder='Petrol or Diesel' onChange={(e) => setFuel(e.target.value)} />
            </label>
            <label>
              <h5>Avg Mileage</h5>
              <Input value={mileage} type='number' onChange={(e) => setMileage(e.target.value)} />
            </label>
            <label>
              <h5>Vehicle RC</h5>
              <div className="upload-box">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  id="VehicleRcUpload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="VehicleRcUpload" className="upload-label">
                  <CloudUpload style={{ marginRight: 8 }} />
                  Upload here
                </label>
              </div>
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} startIcon={<CloudUpload />}>
            Upload
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <div>
            <p>Vehicle details uploaded successfully!</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          <div>
          {selectedVehicle && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{overflowY: "hidden"}}>
                <h5>Driver Name</h5>
                <p>{selectedVehicle.vehicleName}</p>
              </div>
              <div>
                <h5>Registration number</h5>
                <p>{selectedVehicle.regNumber}</p>
              </div>
              <div>
                <h5>Fuel</h5>
                <p>{selectedVehicle.fuel}</p>
              </div>
              <div>
                <h5>Mileage</h5>
                <p>{selectedVehicle.mileage}</p>
              </div>
              <div>
                <h5>Vehicle Rc</h5>
                {selectedVehicle.vehicleRc ? (
                  <img
                    src={`http://localhost:8000${selectedVehicle.vehicleRc}`}
                    alt="Vehicle RC"
                    style={{ maxWidth: "100%", maxHeight: 400 }}
                  />
                ) : (
                  <p>No RC uploaded</p>
                )}
              </div>
            </div>
          )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
