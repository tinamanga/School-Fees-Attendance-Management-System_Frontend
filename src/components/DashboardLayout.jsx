
import NavBar from "./NavBar";
import Sidebar from "./SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-accent h-screen overflow-hidden">
      <NavBar />
      <Sidebar />
      <main className="ml-64 pt-20 p-6 h-[calc(100vh-4rem)] overflow-auto">
        {children}
      </main>
    </div>
  );
}
