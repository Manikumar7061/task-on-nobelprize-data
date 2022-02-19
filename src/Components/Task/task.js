import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function DataGridFormat() {
  const [pageSize, setPageSize] = useState(5);
  const [apiData, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let storedArr = [];
        let moreNobel = [];
        let res = await axios.get("http://api.nobelprize.org/v1/prize.json");

        let data = res.data.prizes;
        console.log("data fetched is::==", res, data);
        data.forEach((item) => {
          if (item.laureates && item.laureates.length) {
            item.laureates.forEach((winner) => {
              moreNobel.push(winner);
              storedArr.push(
                createData(
                  winner.id,
                  item.year,
                  item.category,
                  winner.motivation,
                  winner.firstname,
                  winner.surname
                )
              );
              //console.log(winner.id,item.name,item.year,item.category,winner.firstname , winner.surname)
            });
          }
        });
        setData(storedArr);
      } catch (e) {
        console.log("error is :::", e);
      }
    })();
  }, []);

  function createData(id, year, category, motivation, firstname, lastname) {
    id = Number(id);
    year = Number(year);
    const name = firstname + " " + lastname;
    return { id, name, year, category, motivation };
  }

  let rows = [];
  if (apiData && apiData) {
    console.log("API DATA in testing:==", apiData);
    rows = apiData;
  }
  const columns = [
    { field: "id", headerName: "ID", filterable: false, width: 200 },
    {
      field: "name",
      headerName: "NAME",
      sortable: false,
      filterable: true,
      width: 250,
      disableColumnMenu: false,
    },
    {
      field: "year",
      headerName: "IN YEAR",
      width: 250,
      type: "singleSelect",
      valueOptions: Array(2018 - 1899)
        .fill(0)
        .map((e, i) => i + 1 + 1899),
      align: "left",
    },
    {
      field: "category",
      headerName: "CATEGORY",
      width: 250,
      type: "singleSelect",
      valueOptions: [...new Set(apiData.map((item) => item.category))],
      sortable: false,
      align: "left",
    },
    {
      field: "motivation",
      headerName: "MOTIVATION",
      width: 500,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "left",
    },
  ];

  return (
    <>
      <h1> List of the Nobel Prize Winners </h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          {...rows}
          disableColumnSelector
        />
      </div>
    </>
  );
}
