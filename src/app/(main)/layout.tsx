import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/contexts/auth-context'; // Logged in user details (name, role, etc)
import { Toaster } from '@/components/ui/toaster';
// import SearchBar from '@/components/searchbar';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarTrigger />
                <div className='w-full min-h-screen ml-2 mr-5 my-5'>
                    {children}
                </div>
                <Toaster />
            </SidebarProvider>
        </AuthProvider>
    );
}
