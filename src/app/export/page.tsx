import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar } from "lucide-react";

export default function ExportPage() {
  return (
    <AdminLayout pageTitle="Audit & Reporting">
        <div className="mx-auto max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Generate PDF Report</CardTitle>
                    <CardDescription>Export session logs, bot detections, and alerts for a selected time period.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="date-range" className="font-medium">Date Range</label>
                        <Button id="date-range" variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>December 1, 2023 - December 25, 2023</span>
                        </Button>
                    </div>

                    <Button className="w-full text-lg">
                        <FileText className="mr-2 h-5 w-5" />
                        Generate & Download Report
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Report generation may take a few moments.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
}
