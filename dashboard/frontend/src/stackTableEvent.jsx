import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import { useState } from "react";
  import DownloadBtn from "./DownloadBtn";
  import DebouncedInput from "./DebouncedInput";
  import { SearchIcon } from "./Icons/Icons";
  import {useLocation} from 'react-router-dom';
  import background from "./photo.jpg";


  const TanStackTableEvent = () => {

    const myStyle = {
        backgroundImage: `url(${background})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",

    };

    const location = useLocation();
    const clientData = location.state.clientData.data

    console.log(clientData)

    const columnHelper = createColumnHelper();


    const columns = [

        columnHelper.accessor("", {
            id: "S.No",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
      
        }),

        columnHelper.accessor("UserName", {
            cell: (info) => <span>{info.getValue()}</span>,
            header: "UserName",
          }),

        columnHelper.accessor("clientDescription", {
            cell: (info) => <span>{info.getValue()}</span>,
            header: "Device Description",
          }),

          columnHelper.accessor("deviceName", {
            cell: (info) => <span>{info.getValue()}</span>,
            header: "AP Name",
          }),

          columnHelper.accessor("occurredAt", {
            cell: (info) => <span>{info.getValue()}</span>,
            header: "Event Occurrence GMT+5:30",
          }),

          columnHelper.accessor("description", {
            cell: (info) => <span>{info.getValue()}</span>,
            header: "Event",
          }),


      ];

    const [data] = useState(() => [...clientData]);
    const [globalFilter, setGlobalFilter] = useState("");
  
    const table = useReactTable({
      data,
      columns,
      state: {
        globalFilter,
      },
      getFilteredRowModel: getFilteredRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });
  
    return (
      <div className="p-20 max-w-8xl text-white fill-gray-400" style={myStyle}>
        <div className="flex justify-between mb-2 " >
          <div className="w-full flex items-center gap-2">
            <SearchIcon />
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-green-500 " 
              placeholder="Search all columns..."
            />
          </div>
          <DownloadBtn data={data} fileName={"AttendanceData"} />
        </div>
        <table className="border border-gray-700 w-full text-left" >
          <thead className="bg-sky-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="capitalize px-3.5 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`
                  ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3.5 py-2" >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={12}>No Recoard Found!</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* pagination */}
        <div className="flex items-center justify-end mt-2 gap-2">
          <button
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {">"}
          </button>
  
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16 bg-transparent"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="p-2 bg-transparent"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  
  export default TanStackTableEvent