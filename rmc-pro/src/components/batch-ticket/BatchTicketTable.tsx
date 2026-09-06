type Props = {
    batch?: any;
};

export default function BatchTicketTable({
    batch,
}: Props) {
    return (
        <div className="overflow-x-auto">

            <table className="w-full border-collapse border border-black text-[11px]">

                <thead>

                    {/* Main Header */}

                    <tr>

                        <th
                            rowSpan={3}
                            className="border border-black p-1 w-16"
                        >
                            Batch
                            <br />
                            Size
                        </th>

                        <th
                            colSpan={9}
                            className="border border-black"
                        >
                            Aggregate (kg)
                        </th>

                        <th
                            colSpan={4}
                            className="border border-black"
                        >
                            Cement (kg)
                        </th>

                        <th
                            colSpan={3}
                            className="border border-black"
                        >
                            Water (ltr)
                        </th>

                        <th
                            colSpan={2}
                            className="border border-black"
                        >
                            Additive (gm)
                        </th>

                    </tr>

                    {/* Group Header */}

                    <tr>

                        <th
                            colSpan={3}
                            className="border"
                        >
                            10 mm
                        </th>

                        <th
                            colSpan={3}
                            className="border"
                        >
                            Sand
                        </th>

                        <th
                            colSpan={3}
                            className="border"
                        >
                            20 mm
                        </th>

                        <th
                            colSpan={2}
                            className="border"
                        >
                            Cement
                        </th>

                        <th
                            colSpan={2}
                            className="border"
                        >
                            Fly Ash
                        </th>

                        <th
                            colSpan={2}
                            className="border"
                        >
                            Water
                        </th>

                        <th
                            className="border"
                        >
                            Adj.
                        </th>

                        <th
                            colSpan={2}
                            className="border"
                        >
                            Admix
                        </th>

                    </tr>

                    {/* SET / ACT */}

                    <tr>

                        {Array.from({
                            length: 20,
                        }).map((_, index) => (
                            <th
                                key={index}
                                className="border p-1"
                            >
                                {index % 2 === 0
                                    ? "SET"
                                    : "ACT"}
                            </th>
                        ))}

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-1 text-center font-semibold">
                            {batch?.quantity ?? "1.00"}
                        </td>

                        {/* 10 mm */}
                        <td className="border p-1 text-center">
                            {batch?.mm10 ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.mm10 ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            100%
                        </td>

                        {/* Sand */}
                        <td className="border p-1 text-center">
                            {batch?.sand ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.sand ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            100%
                        </td>

                        {/* 20 mm */}
                        <td className="border p-1 text-center">
                            {batch?.mm20 ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.mm20 ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            100%
                        </td>

                        {/* Cement */}
                        <td className="border p-1 text-center">
                            {batch?.cement ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.cement ?? "-"}
                        </td>

                        {/* Fly Ash */}
                        <td className="border p-1 text-center">
                            {batch?.flyash ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.flyash ?? "-"}
                        </td>

                        {/* Water */}
                        <td className="border p-1 text-center">
                            {batch?.water ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.water ?? "-"}
                        </td>

                        {/* Adj */}
                        <td className="border p-1 text-center">
                            -
                        </td>

                        {/* Admix */}
                        <td className="border p-1 text-center">
                            {batch?.admix ?? "-"}
                        </td>

                        <td className="border p-1 text-center">
                            {batch?.admix ?? "-"}
                        </td>

                    </tr>

                    <tr className="bg-slate-100 font-semibold">

                        <td className="border p-1 text-right">
                            Total
                        </td>

                        <td
                            colSpan={19}
                            className="border p-1"
                        >
                            Materials Consumption Summary
                        </td>

                    </tr>


                </tbody>

            </table>

        </div>
    );
}