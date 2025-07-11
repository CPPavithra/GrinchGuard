import { ShieldAlert } from "lucide-react";

export default function FakeOfferPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-destructive text-destructive-foreground">
      <ShieldAlert className="h-24 w-24" />
      <h1 className="mt-8 text-4xl font-bold">ACCESS DENIED</h1>
      <p className="mt-4 text-lg">This resource is restricted. Your activity has been logged.</p>
      <p className="mt-2 font-mono text-sm">IP: 127.0.0.1 | Fingerprint: e5f6g7h8i9j0k1l2</p>
    </div>
  );
}
