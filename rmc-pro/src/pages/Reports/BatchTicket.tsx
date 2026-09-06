import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import BatchTicketHeader from "../../components/batch-ticket/BatchTicketHeader";
import BatchTicketInfo from "../../components/batch-ticket/BatchTicketInfo";
import BatchTicketTable from "../../components/batch-ticket/BatchTicketTable";
import BatchTicketSummary from "../../components/batch-ticket/BatchTicketSummary";
import BatchTicketFooter from "../../components/batch-ticket/BatchTicketFooter";

import { getBatchById } from "../../services/batch.service";

export default function BatchTicket() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [batch, setBatch] = useState<any>(null);

    useEffect(() => {
        if (id) {
            loadBatch(Number(id));
        }
    }, [id]);

    async function loadBatch(batchId: number) {
        try {
            setLoading(true);

            const data = await getBatchById(batchId);

            setBatch(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner text="Loading Batch Ticket..." />
            </DashboardLayout>
        );
    }

    if (!batch) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <h2 className="text-2xl font-semibold text-red-600">
                        Batch not found
                    </h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <PageHeader
                title="Batch Ticket"
                subtitle="Delivery Batch Report"
            />

            <div className="bg-white rounded-2xl shadow-lg p-8 border">
                <BatchTicketHeader batch={batch} />

                <BatchTicketInfo batch={batch} />

                <BatchTicketTable batch={batch} />

                <BatchTicketSummary batch={batch} />

                <BatchTicketFooter />

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                        Print
                    </button>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
                        Export PDF
                    </button>

                </div>

            </div>

        </DashboardLayout>
    );
}