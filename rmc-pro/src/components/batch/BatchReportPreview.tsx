  import React from "react";

  import type { BatchReportData } from "../../types/batchReport";


  type Props = {
    batch: BatchReportData;
  };


  export default function BatchReportPreview({
    batch,
  }: Props) {

 

const rows = Array.isArray(batch.rows)
  ? batch.rows
  : [];

/* ================================================= */
/* CALCULATE TOTALS FROM INDIVIDUAL BATCH ROWS      */
/* ================================================= */

const totSet = [
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.sand_set || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.mm20_set || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.mm10_set || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.cement_set || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.flyash_set || 0),
    0
  ),
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.water_set || 0),
    0
  ),
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.admix_set || 0),
    0
  ),
  0,
];

const totAct = [
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.sand_act || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.mm20_act || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.mm10_act || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.cement_act || 0),
    0
  ),
  rows.reduce(
    (sum, row) => sum + Number(row.flyash_act || 0),
    0
  ),
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.water_act || 0),
    0
  ),
  0,
  rows.reduce(
    (sum, row) => sum + Number(row.admix_act || 0),
    0
  ),
  0,
];

/* ================================================= */
/* AVERAGES                                          */
/* ================================================= */

const avgSet = totSet.map((value) =>
  rows.length
    ? value / rows.length
    : 0
);

const avgAct = totAct.map((value) =>
  rows.length
    ? value / rows.length
    : 0
);

/* ================================================= */
/* VARIANCE                                          */
/* ================================================= */

const variance = totAct.map(
  (value, index) =>
    value - totSet[index]
);

const variancePercent = variance.map(
  (value, index) =>
    totSet[index]
      ? (value / totSet[index]) * 100
      : 0
);

const summaryRows = [
  {
    name: "Tot Act",
    values: totAct,
  },
  {
    name: "Tot Set",
    values: totSet,
  },
  {
    name: "Avg Set",
    values: avgSet,
  },
  {
    name: "Avg Act",
    values: avgAct,
  },
  {
    name: "Variance",
    values: variance,
  },
  {
    name: "Variance %",
    values: variancePercent,
  },
];
  return (

  <div
    className="
      bg-white
      border
      border-black
      p-0
      text-[10px]
    "
    style={{
      position: "relative",

      width: "100%",
      paddingTop: "5px",
      boxSizing: "border-box",
      fontFamily: "Verdana, sans-serif",
      
    }}
    data-report-container
  >
    





  {/* TITLE */}

  <div
    className="
      text-center
      font-bold
      text-base
      pb-1
      mb-0
      border-b
      border-black
      
    "
  style={{
    height: "35px",
    width: "100%",
    fontSize: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
  >
    BATCH REPORT - DELIVERY
  </div>





  {/* HEADER SECTION */}

  <div
    className="grid text-[11px]"
    style={{
      gridTemplateColumns: "310px 270px 250px",
      columnGap: "85px",
      height:"105px",
    }}
  >



  {/* LEFT */}

  <div className="leading-4.5"  style={{
      marginLeft: "5px",
      fontSize:"12px",
      
    }}>


  <div className="grid grid-cols-[120px_1fr] ">
  <span>Customer Name</span>
  <span>: <b >{batch.customer}</b></span>
  </div>


  <div className="grid grid-cols-[120px_1fr]">
  <span>Site Name</span>
  <span>: <b>{batch.site}</b></span>
  </div>


  <div className="grid grid-cols-[120px_1fr]">
  <span>Vehicle No.</span>
  <span>: <b>{batch.vehicle_no}</b></span>
  </div>


  <div className="grid grid-cols-[120px_1fr]">
  <span>Driver Name</span>
  <span>: <b>{batch.driver_name}</b></span>
  </div>


  <div className="grid grid-cols-[120px_1fr]">
  <span>Start Time</span>
  <span>: <b>{
  new Date(`2000-01-01T${batch.batch_time}`)
  .toLocaleTimeString("en-US",{
  hour:"2-digit",
  minute:"2-digit",
  second:"2-digit",
  hour12:true
  })
  .replace("am","AM")
  .replace("pm","PM")
  }
  </b></span>
  </div>


  <div className="grid grid-cols-[120px_1fr]" >
  <span>End Time</span>
  <span>: <b>{
  new Date(`2000-01-01T${batch.end_time}`)
  .toLocaleTimeString("en-US",{
  hour:"2-digit",
  minute:"2-digit",
  second:"2-digit",
  hour12:true
  })
  .replace("am","AM")
  .replace("pm","PM")
  }</b></span>
  </div>


  </div>


  {/* CENTER */}

  <div
    className="leading-4.5"
    style={{
      marginLeft: "70px",
      fontSize:"12px",
    }}
  >

    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Recipe Name
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>{batch.recipe_name}</b>
    </div>


    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Recipe No.
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>{batch.recipe_no}</b>
    </div>


    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Slump
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>{batch.slump}</b>
    </div>


    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Strength
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>{batch.strength}</b>
    </div>


    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Total Meter Cube
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>{batch.order_qty}</b>
    </div>


    <div className="flex items-center">
      <span
        style={{
          width: "157px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        Date
      </span>

      <span
        style={{
          width: "10px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        :
      </span>

      <b>
        {batch.batch_date
          ? new Date(batch.batch_date).toLocaleDateString("en-GB")
          : "-"}
      </b>
    </div>

  </div>




  {/* RIGHT */}
  <div
    className="leading-4.5"
    style={{
      marginLeft: "120px",
      fontSize:"12px",
    }}
  >

    {[
      ["Order No.", batch.order_no],
      ["Order Qty.", batch.order_qty],
      ["Ticket Qty.", batch.ticket_qty],
      ["Order Qty.Left", batch.order_qty_left],
      ["Delivery No.", batch.delivery_no],
      ["Ticket No.", batch.ticket_no],
    ].map(([label, value], index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: "110px",
            textAlign: "right",
            display: "inline-block",
          }}
        >
          {label}
        </span>

        <span
          style={{
            width: "10px",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          :
        </span>

        <b
          style={{
            width: "40px",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {value}
        </b>
      </div>
    ))}

  </div>
  </div>



  {/* MATERIAL TABLE */}

  <div className="overflow-x-auto">


  <table
  className="
  w-full
  border-collapse
  mt-1
  text-[11px]
  table-fixed
  "
  style={{
    tableLayout: "fixed",
    width: "100%",
    borderLeft: "1px solid white",
    borderRight: "1px solid white",

  }}
  >



  <colgroup>
    <col style={{ width: "20px" }} />
    {Array(27).fill(0).map((_, index) => (
      <col
        key={index}
        style={{ width: "17px" }}
      />
    ))}
  </colgroup>
  <thead>


  <tr style={{ height: "21px", fontSize: "10px" }}>

  <th
  className="
  border-t
  border-r
  border-b
  border-black
  text-left  
  "
  style={{
    borderLeft: "1px solid white",
    fontSize: "8px", 

  }}
  >
  CHANNEL
  </th>


  <th
  colSpan={12}
  className="
  border
  border-black
  text-center
  "
  style={{
    fontSize: "10px", 
  }}
  >
  Aggregate (kg)
  </th>


  <th
  colSpan={6}
  className="
  border
  border-black
  text-center
  "
  style={{
    fontSize: "10px", 
  }}
  >
  Cement (kg)
  </th>


  <th
    colSpan={5}
    className="
    border
    border-black
    text-center
  "
  style={{
    fontSize: "10px", 
  }}
  >
  Water (ltr/kg)
  </th>

  <th
    colSpan={4}
    className="
      border
      border-black
      
      text-center
    " style={{
    fontSize: "10px", 
      borderRight: "1px solid white",
    }}
  >
    Additive (gm)
  </th>


  </tr>





  <tr style={{ height: "21px", fontSize: "10px" }}>


  <th
  className="
  border-t
  border-b
  border-r
  border-black
  text-left

  "
  style={{
    borderLeft: "1px solid white",
    fontSize: "8px",
  }}   
  >
  M.NAME
  </th>


  {[
    { name: "10mm", span: 3 },
    { name: "Sand", span: 3 },
    { name: "20mm", span: 3 },
    { name: "10mm", span: 3 },

    { name: "Cement", span: 2 },
    { name: "FLYASH", span: 2 },
    { name: "Cmt-3", span: 2 },

    { name: "Water", span: 3 },
    { name: "Wtr-2", span: 2 },

    { name: "Add-1", span: 2 },
    { name: "Admix-2", span: 2 },
  ].map((item,index)=>(

  <td
    key={index}
    colSpan={item.span}
    className="border border-black text-center"
    style={{
      fontSize: "10px",
      ...(index === 10
        ? { borderRight: "1px solid white" }
        : {})
    }}
  >
    {item.name}
  </td>

  ))}


  </tr>





  <tr style={{ height: "21px", fontSize: "10px" }}>


  <th
  className="
  border-t
  border-b
  border-r
  border-black
  text-left

  "
  style={{
    borderLeft: "1px solid white",
    fontSize: "8px",
  }}
  >
  RECP/M3
  </th>


  {[
  0,
  batch.sand,
  batch.mm20,
  batch.mm10,
  batch.cement,
  batch.flyash,
  0,
  batch.water,
  0,
  batch.admix,
  0

  ].map((value,index)=>(


  <td

  key={index}

  colSpan={
  index <= 3
  ? 3
  : index === 7
  ? 3
  : 2
  }

  className="
  border
  border-black
  text-center
  "
  style={{
    fontSize: "10px",
    ...(index === 10
      ? { borderRight: "1px solid white" }
      : {})
  }}
  >

  {Number(value) === 0 ? "" : Number(value).toFixed(0)}

  </td>


  ))}


  </tr>





  <tr style={{ height: "21px", fontSize: "10px" }}>


  <th

  className="
  border-t
  border-b
  border-r
  border-black

  " 
  style={{
    borderLeft: "1px solid white",
    
  }}     
  >

  <span style={{ display: "block",textAlign: "left" ,fontSize:"8px" }}>BATCH</span>
  <span style={{ display: "block",lineHeight: "8px" ,fontSize:"8px",}}>SIZE</span>

  </th>


  {Array(11)
    .fill(0)
    .map((_, index) => (

      <React.Fragment key={index}>

        <th className="border border-black text-center">
          SET
        </th>

        <th
          className="border border-black text-center"
          style={ 
            index === 10
              ? { borderRight: "1px solid white" }
              : {}
          }
        >
          ACT
        </th>

        {index <= 3 && (
          <th className="border border-black text-center">
            % Ms
          </th>
        )}

        {index === 7 && (
          <th className="border border-black text-center">
            ADJ
          </th>
        )}

      </React.Fragment>

  ))}


  </tr>


  </thead>





  <tbody
    style={{
      fontSize: "10px",
      fontFamily: "Verdana, sans-serif",
    }}
  >


 {rows.map((row, index) => (

  /*Material values*/ 
  <tr
    key={index}
    style={{
      height: "21px",
      fontSize: "11px",
    }}
  >


  <td
  className="
  border-t
  border-b
  border-r
  border-black
  text-center
  "
  style={{
    borderLeft: "1px solid white",
    
  }}
  >
  {Number(row.batch_size || 0).toFixed(2)}
  </td>




  {/* 10mm */}

  <td className="border border-black text-center">
    0
  </td>

  <td className="border border-black text-center">
    0
  </td>

  <td className="border border-black text-center">
  0.0
  </td>




  {/* Sand */}

  <td className="border border-black text-center">
    {Number(row.sand_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.sand_act || 0)}
  </td>

  <td className="border border-black text-center">
  0.0
  </td>




  {/* 20mm */}

  <td className="border border-black text-center">
    {Number(row.mm20_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.mm20_act || 0)}
  </td>

  <td className="border border-black text-center">
  0.0
  </td>




  {/* 10mm */}

  <td className="border border-black text-center">
    {Number(row.mm10_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.mm10_act || 0)}
  </td>

  <td className="border border-black text-center">
  0.0
  </td>




  {/* Cement */}

  <td className="border border-black text-center">
    {Number(row.cement_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.cement_act || 0)}
  </td>




  {/* Flyash */}

  <td className="border border-black text-center">
    {Number(row.flyash_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.flyash_act || 0)}
  </td>




  {/* Cmt-3 */}

  <td className="border border-black text-center">
  0
  </td>

  <td className="border border-black text-center">
  0
  </td>




  {/* Water */}

  <td className="border border-black text-center">
    {Number(row.water_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.water_act || 0)}
  </td>

  <td className="border border-black text-center">
  0
  </td>




  {/* Wtr-2 */}

  <td className="border border-black text-center">
  0
  </td>

  <td className="border border-black text-center">
  0
  </td>




  {/* Add-1 */}

  <td className="border border-black text-center">
    {Number(row.admix_set).toFixed(0)}
  </td>

  <td className="border border-black text-center">
  {Number(row.admix_act || 0)}
  </td>




  {/* Admix-2 */}

  <td className="border border-black text-center">
  0
  </td>

  <td
  className="border border-black text-center"
  style={{ borderRight: "1px solid white" }}
  >
  0
  </td>

  </tr>



  ))}
  {/* SUMMARY TABLE */}

  {summaryRows.map((row, index) => (

  <tr key={index} style={{ height: "19px",  fontSize: "10px", }}>

  <td
    className="
      border-t

      border-r
      border-black
      
      text-left
      pl-[2px]
      align-top
    "
  style={{
    
  fontFamily: "Verdana, sans-serif",
  fontSize: "9px",
    borderBottom: "none",
    borderTop: index === 0 ? "2px solid black" : undefined,
    
  }}
  >
  {row.name === "Variance %" ? (
    <span
      style={{
        fontSize: "9px",
        lineHeight: "8px",
        display: "block",
      }}
    >
      Variance <pre>   %</pre> 
    </span>
    
  ) : (
    row.name
  )}
  </td>

  {/* 10mm */}
  <td
    colSpan={3}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]  "
    style={{
      borderTop: index === 0 ? "2px solid black" : "1px solid black",
    }}
  >
    {index < 2
      ? Number(row.values[0]).toFixed(0)
      : Number(row.values[0]).toFixed(2)}
  </td>

  {/* Sand */}
  <td
    colSpan={3}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[1]).toFixed(0)
      : Number(row.values[1]).toFixed(2)}
  </td>

  {/* 20mm */}
  <td
    colSpan={3}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[2]).toFixed(0)
      : Number(row.values[2]).toFixed(2)}
  </td>

  {/* 10mm */}
  <td
    colSpan={3}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[3]).toFixed(0)
      : Number(row.values[3]).toFixed(2)}
  </td>

  {/* Cement */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[4]).toFixed(0)
      : Number(row.values[4]).toFixed(2)}
  </td>

  {/* Flyash */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[5]).toFixed(0)
      : Number(row.values[5]).toFixed(2)}
  </td>

  {/* Cmt-3 */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[6]).toFixed(0)
      : Number(row.values[6]).toFixed(2)}
  </td>

  {/* Water */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : "1px solid black",
    }}
  >
    {index < 2
      ? Number(row.values[7]).toFixed(0)
      : Number(row.values[7]).toFixed(2)}
  </td>

  {/* Water ADJ */}
  {index === 0 && (
    <td
      className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
      style={{
        borderTop: "2px solid black",
      }}
    >
      0
    </td>
  )}

  {index === 1 && (
    <td
      className="border-l border-r border-t border-black"
      style={{
        borderTop: "1px solid black",
      }}
    >
    </td>
  )}

  {index === 2 && (
    <td
      rowSpan={2}
      className="border-l border-r border-t border-black"
      style={{
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
      }}
    >
    </td>
  )}

  {index === 3 && null}

  {index === 4 && (
    <td
      className="border-l border-r border-t border-black"
      style={{
        borderTop: "1px solid black",
      }}
    >
    </td>
  )}

  {index === 5 && (
    <td
      className="border-l border-r border-black"
      style={{
        borderTop: "1px solid black",
        borderBottom: "1px solid white",
      }}
    >
    </td>
  )}

  {/* Wtr-2 */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[8]).toFixed(0)
      : Number(row.values[8]).toFixed(2)}
  </td>

  {/* Add-1 */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}
  >
    {index < 2
      ? Number(row.values[9]).toFixed(0)
      : Number(row.values[9]).toFixed(2)}
  </td>

  {/* Admix-2 */}
  <td
    colSpan={2}
    className="border-l border-r border-t border-black font-bold text-left pl-[2px]"
    style={{
      borderRight: "1px solid white",
      borderBottom:
      "none",
      borderTop: index === 0 ? "2px solid black" : undefined,
    }}

  >
    {index < 2
      ? Number(row.values[10]).toFixed(0)
      : Number(row.values[10]).toFixed(2)}
  </td>

  </tr>

  ))}

  </tbody>


  </table>


  </div>



  </div>

  );

  }