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
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [driverLicense, setDriverLicense] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "Contact",
      headerName: "Contact",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "Address",
      headerName: "Address",
      width: 380,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
      const response = await fetch("http://localhost:8000/api/driverdata", {
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
        name: item.NAME,
        Contact: item.PHONENUMBER,
        Address: item.ADDRESS,
        key: item.ID,
        driverLicensePath: item.LICENSE, // Store license path for each row
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
    setDriverLicense(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!driverName || !phoneNumber || !address || !driverLicense) {
      alert("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("driverLicense", driverLicense);

    try {
      const response = await fetch("http://localhost:8000/api/uploadDriverDetails", {
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
    setDriverName('');
    setPhoneNumber('');
    setAddress('');
    setDriverLicense(null);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  return (
    <div style={{ gap: "20px", display: "flex", flexDirection: "column", marginTop: "40px" }}>
      <div onClick={() => setOpen(true)}>
        <button className='adddriver'>
          Add Driver<i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label>
                <h5>Driver Name</h5>
                <Input value={driverName} onChange={(e) => setDriverName(e.target.value)} />
              </label>
              <label>
                <h5>Phone number</h5>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </label>
            </div>
            <label>
              <h5>Address</h5>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label>
              <h5>Driver License</h5>
              <div className="upload-box">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  id="driverLicenseUpload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="driverLicenseUpload" className="upload-label">
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
            <p>Driver details uploaded successfully!</p>
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
          {selectedDriver && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{overflowY: "hidden"}}>
                <h5>Driver Name</h5>
                <p>{selectedDriver.name}</p>
              </div>
              <div>
                <h5>Phone number</h5>
                <p>{selectedDriver.Contact}</p>
              </div>
              <div>
                <h5>Address</h5>
                <p>{selectedDriver.Address}</p>
              </div>
              <div>
                <h5>Driver License</h5>
                {selectedDriver.driverLicensePath ? (
                  <img
                    src={`http://localhost:8000${selectedDriver.driverLicensePath}`}
                    alt="Driver License"
                    style={{ maxWidth: "100%", maxHeight: 400 }}
                  />
                ) : (
                  <p>No license uploaded</p>
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
