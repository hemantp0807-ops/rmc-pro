import rmcLogo from "../../assets/rmc-logo.jpeg";
type Props = {
  batch: any;
  copyType?: string;
};

export default function DeliveryChallanPreview({
  batch,
  copyType = "ORIGINAL COPY",
}: Props) {

  /*
    Calculate cumulative quantity.

    If your backend already provides cumulative_qty,
    that value will be used.

    Otherwise previous_quantity + current quantity
    will be used.
  */
  const quantity = Number(batch?.quantity || 0);

  const cumulativeQty = Number(
  batch?.cumulative_qty || 0
);


  return (
   <div
  className="delivery-challan-preview"
  style={{
    width: "100%",
    minHeight: "135mm",
    height: "185mm",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #000",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "10px",
    lineHeight: "1.25",
  }}
>
{/* ================================================= */}
{/* HEADER */}
{/* ================================================= */}

<div
  style={{
    position: "relative",
    minHeight: "125px",

  }}
>

  {/* ========================= */}
  {/* CENTERED TITLE */}
  {/* ========================= */}

  <div
    style={{
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: "1",
      whiteSpace: "nowrap",
    }}
  >
    DELIVERY CHALLAN
  </div>


  {/* ========================= */}
  {/* COPY TYPE */}
  {/* ========================= */}

  <div
    style={{
      position: "absolute",
      top: "25px",
      right: "10px",
      display: "inline-block",
      border: "1px solid #000",
      padding: "2px 7px",
      fontSize: "8px",
      fontWeight: "700",
      background: "#fff",
    }}
  >
    {copyType}
  </div>


  {/* ========================= */}
  {/* LEFT HEADER */}
  {/* ========================= */}

  <div
    style={{
      position: "absolute",
      left: "0",
      top: "45px",
      width: "50%",
      padding: "8px 10px",
      boxSizing: "border-box",
    }}
  >

   {/* ========================= */}
{/* LOGO + LEAD RMC */}
{/* ========================= */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    marginTop: "-8px",
    marginBottom: "4px",
  }}
>
  <img
    src={rmcLogo}
    alt="RMC Pro"
    style={{
      width: "60px",
      height: "auto",
      display: "block",
      objectFit: "contain",
    }}
  />

  <div
    style={{
      paddingTop:"23px",
      marginLeft: "8px",
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "1",
    }}
  >
    LEAD RMC
  </div>
</div>


{/* ========================= */}
{/* COMPANY DETAILS */}
{/* ========================= */} 
<div style={{fontSize:"11px", 
  fontFamily: "Arial, Helvetica, sans-serif",
  paddingLeft:"4px"
  }}> 

<div>Sr.No.307/1A/1B,</div>
<div>D Y Patil Road,</div>
<div>Lohegaon,Pune-47</div>
<div>Email:leadrmc02@gmail.com</div>
<div>7710870202</div>
</div>
  </div>


  {/* ========================= */}
  {/* RIGHT HEADER */}
  {/* ========================= */}

  <div
    style={{
      position: "absolute",
      right: "0",
      top: "92px",
      width: "50%",
      padding: "8px 10px",
      boxSizing: "border-box",
      textAlign: "right",
    }}
  >

    {/* CHALLAN DETAILS */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "115px 12px 90px",
        justifyContent: "end",
        textAlign: "left",
        rowGap: "4px",
        fontSize: "10px",
      }}
    >

      <span style={{ fontWeight: "700" }}>
        Challan No.
      </span>

      <span>:</span>

      <strong>
        DC/{batch?.delivery_no || "-"}
      </strong>


      <span style={{ fontWeight: "700" }}>
        Challan Date
      </span>

      <span>:</span>

      <strong>
        {formatDate(batch?.batch_date)}
      </strong>


      <span style={{ fontWeight: "700" }}>
        Time of Dispatch
      </span>

      <span>:</span>

      <b>
        {
          new Date(`2000-01-01T${batch.end_time}`)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .replace("am", "AM")
            .replace("pm", "PM")
        }
      </b>


      <span style={{ fontWeight: "700" }}>
        Type of loading
      </span>

      <span>:</span>

      <strong>
        {batch?.type_of_loading || "Pump"}
      </strong>

    </div>

  </div>

</div>


{/* ================================================= */}
{/*    + DELIVERY DETAILS */}
{/* ================================================= */}


      <div
  style={{
    marginTop: "60px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "start",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
  }}
>

        {/* CUSTOMER DETAILS */}

       <div
  style={{
    borderRight: "1px solid #000",
    padding: "7px 10px",
    minHeight: "125px",
    boxSizing: "border-box",
  }}
>

          <SectionTitle>
            Customer Details
          </SectionTitle>

          <Detail
            label="Customer Name"
            value={batch?.customer}
          />

          <Detail
            label="Site Name"
            value={batch?.site}
          />

          <Detail
            label="GSTIN"
            value={batch?.party_gst_no}
          />

          <Detail
            label="Contact Person"
            value={batch?.contact_person}
          />

          <Detail
            label="Contact No."
            value={batch?.contact_no}
          />

          <Detail
            label="PO / Ref No."
            value={batch?.party_po_no}
          />

        </div>


        {/* DELIVERY DETAILS */}

        <div
  style={{
    padding: "7px 10px",
    minHeight: "125px",
    boxSizing: "border-box",
  }}
>

          <SectionTitle>
            Delivery Details
          </SectionTitle>

          <Detail
            label="Order No."
            value={batch?.order_no}
          />

        

          <Detail
            label="Ticket No."
            value={batch?.ticket_no}
          />

          <Detail
            label="Vehicle No."
            value={batch?.vehicle_no}
          />

          <Detail
            label="Driver Name"
            value={batch?.driver_name}
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* CONCRETE TABLE */}
      {/* ================================================= */}
        <div style={{paddingTop:"5px"}}>  
   
    <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  }}
>

        <thead>

          <tr>

            <th
  style={{
    ...cellStyle,
    width: "9%",
    borderLeft: "1px solid #fff",
  }}
>
  Sr. No.
</th>

            <th
              style={{
                ...cellStyle,
                width: "32%",
              }}
            >
              Description
            </th>

            <th
              style={{
                ...cellStyle,
                width: "16%",
              }}
            >
              Grade
            </th>

            <th
              style={{
                ...cellStyle,
                width: "21%",
              }}
            >
              Quantity (m³)
            </th>

                  <th style={{
    ...cellStyle,
    borderRight: "1px solid #fff",
  }}>
              Cumulative Qty. (m³)
            </th>

          </tr>

        </thead>


        <tbody>

          <tr>

            <td style={{
    ...cellStyle,
    width: "9%",
    borderLeft: "1px solid #fff",
  }}>
              1
            </td>

            <td style={cellStyle}>
              Ready Mix Concrete
            </td>

            <td style={cellStyle}>
              {batch?.grade || "-"}
            </td>

            <td style={cellStyle}>
              {quantity.toFixed(2)}
            </td>

              <td style={{
      ...cellStyle,
      width: "9%",
      borderRight: "1px solid #fff",
    }}>
              {cumulativeQty.toFixed(2)}
            </td>

          </tr>

        </tbody>

      </table>
</div>

     {/* REMARKS */}
<div
  style={{
    border: "1px solid #000",
    marginTop:"5px",
    margin: "10px",
    padding: "7px 10px",
    fontSize: "9.5px",
    fontWeight: "600",
  }}
>
  <div
    style={{
      fontWeight: "700",
      marginBottom: "6px",
    }}
  >
    Remarks :
  </div>

  <div style={{ marginBottom: "4px" }}>
    1. Waiting charge of ₹1200 /hour will be applicable after
    2 hours from the reaching on-site.
  </div>

  <div style={{ marginBottom: "4px" }}>
    2. Material supplied as per order and specification.
  </div>

  <div style={{ marginBottom: "4px" }}>
    3. Unloading after 30 minutes from arrival will be treated
    as waiting time.
  </div>

  <div style={{ marginBottom: "4px" }}>
    4. Do not add water at site. Company is not responsible
    for slump and strength if water is added.
  </div>

  <div style={{ marginBottom: "4px" }}>
    5. Customer is responsible for centering, shuttering,
    scaffolding and reinforcement.
  </div>

  <div>
    6. Please check quantity before unloading.
  </div>

</div>

      {/* ================================================= */}
      {/* SIGNATURES */}
      {/* ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          margin: "0 10px",
          border: "1px solid #000",
          height: "105px",
        }}
      >

        <div
          style={{
            borderRight: "1px solid #000",
            textAlign: "center",
            paddingTop: "5px",
            fontWeight: "700",
          }}
        >
          Authorised Signature And Stamp
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: "5px",
            fontWeight: "700",
          }}
        >
          Customer Signature And Stamp
        </div>

      </div>


      {/* ================================================= */}
      {/* THANK YOU */}
      {/* ================================================= */}

      <div
        style={{
          paddingTop:"36px",
          textAlign: "center",
          fontWeight: "700",
          fontStyle: "italic",
          padding: "8px 0 6px",
          fontSize: "10px",
        }}
      >
        Thank you for your business!
      </div>


      

    </div>
  );
}


/* ================================================= */
/* DETAIL ROW */
/* ================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "105px 12px 1fr",
        alignItems: "baseline",
        marginBottom: "3px",
        fontSize: "10px",
      }}
    >

      <span>
        {label}
      </span>

      <span>
        :
      </span>

      <strong
        style={{
          overflowWrap: "anywhere",
        }}
      >
        {value || "-"}
      </strong>

    </div>
  );
}


/* ================================================= */
/* SECTION TITLE */
/* ================================================= */

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "16px",
        lineHeight: "16px",
        textAlign: "center",
        fontWeight: "700",
        fontSize: "11px",
        margin: "0 0 7px 0",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}


/* ================================================= */
/* TABLE CELL */
/* ================================================= */

const cellStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "5px 4px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "9.5px",
  verticalAlign: "middle",
};


/* ================================================= */
/* DATE FORMAT */
/* ================================================= */

function formatDate(value: any) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}


/* ================================================= */
/* TIME FORMAT */
/* ================================================= */
