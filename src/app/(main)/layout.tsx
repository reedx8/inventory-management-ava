import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/contexts/auth-context'; // Logged in user details (name, role, etc)
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                {/* <SidebarTrigger /> */}
                <div className='w-full min-h-screen mx-3'>
                    <SidebarTrigger />
                    {/* <div className="w-full min-h-screen mx-3 bg-[url('../../public/leaves.png')] bg-no-repeat bg-[right_-100px_bottom_-100px] bg-fixed"> */}
                    {children}
                </div>
                <Toaster />
            </SidebarProvider>
        </AuthProvider>
    );
}
