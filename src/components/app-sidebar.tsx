"use client";
import Link from 'next/link';
// import Logo from '/public/logo.jpeg';
import Image from 'next/image';
import menuLogo from '/public/menuLogo.png';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Store, CookingPot, NotepadText, Settings2, LogOut, ChevronUp, CircleUserRound, CircleUser, UserRound, User } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { supabase } from '@/app/utils/supabase/client';
import { createClient } from '@/app/utils/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const items = [
    {
        title: 'Home',
        url: '/',
        icon: Home,
    },
    {
        title: 'Store',
        url: '/store',
        icon: Store,
    },
    {
        title: 'Bakery',
        url: '/bakery',
        icon: CookingPot,
    },
    {
        title: 'Reports',
        url: '/reports',
        icon: NotepadText,
    },
    {
        title: 'Manage',
        url: '/manage',
        icon: Settings2,
    },
];
export function AppSidebar() {
  const [currentPage, setCurrentPage] = useState('/');
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname])

  async function signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
        redirect('/login');
    }
  }

    return (
        <Sidebar>
            <SidebarHeader>
                <Image src={menuLogo} alt='menu logo' />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={currentPage === item.url}>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User/>
                                    <span>Account</span>
                                    <ChevronUp className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
