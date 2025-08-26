import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (

        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-1 flex-col ml-64">
          <Header title="Dashboard" />
          <main  className="flex-1 overflow-y-auto bg-gray-100 p-8">
            {children}
          </main>
          </div>
        </div>
      );
}