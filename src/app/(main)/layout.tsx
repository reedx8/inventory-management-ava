import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="w-full h-full mx-3">
          {children}
        </div>
      </SidebarProvider>
    );
  }