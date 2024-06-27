// DataTable.jsx
import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "./data.css";

const DataTable = () => {
  const [rows, setRows] = useState([]);


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
      field: "status",
      headerName: "Status",
      width: 120,
    }
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/approved", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      // Map the data fields to match the columns and generate auto ids
      const mappedRows = data.map((item, index) => {
        const formattedFromDateTime = moment(item.FROM_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedToDateTime = moment(item.TO_DATETIME).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return {
          id: index + 1, // Generate auto id
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
          status: 'Approved',
          key: item.ID, // Assign the key field
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
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
      />
    </div>
  );
};

export default DataTable;
