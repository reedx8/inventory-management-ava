"use client";
import Link from 'next/link';
import Logo from '/public/logo.jpeg';
import Image from 'next/image';
import menuLogo from '/public/menuLogo.png';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Store, CookingPot, NotepadText, Settings2 } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                <Avatar>
                    <AvatarImage src={Logo.src} alt='avatar' />
                    <AvatarFallback>AVA</AvatarFallback>
                </Avatar>
            </SidebarFooter>
        </Sidebar>
    );
}
