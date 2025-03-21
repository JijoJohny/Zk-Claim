import Sidebar from "./components/Sidebar";
import { DIDProvider } from "@/context/DIDContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DIDProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-10">{children}</div>
      </div>
    </DIDProvider>
  );
}
