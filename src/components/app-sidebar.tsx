'use client';
import Link from 'next/link';
import Image from 'next/image';
import menuLogo from '/public/menuLogo.png';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Home,
    Store,
    CookingPot,
    // NotepadText,
    Settings2,
    LogOut,
    ChevronUp,
    User,
    ConciergeBell,
    Contact,
} from 'lucide-react';
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
import { createClient } from '@/app/utils/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';

type Item = {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<any> & React.RefAttributes<any>>;
};

const storePages : Item[] = [
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
        title: 'Contact',
        url: '/contact',
        icon: Contact,
    },
];

const bakeryPages : Item[] = [
    {
        title: 'Home',
        url: '/',
        icon: Home,
    },
    {
        title: 'Bakery',
        url: '/bakery',
        icon: CookingPot,
    },
    {
        title: 'Contact',
        url: '/contact',
        icon: Contact,
    },
];

const orderPages : Item[] = [
    {
        title: 'Home',
        url: '/',
        icon: Home,
    },
    {
        title: 'Orders',
        url: '/orders',
        icon: ConciergeBell,
        // icon: NotepadText,
    },
    {
        title: 'Contact',
        url: '/contact',
        icon: Contact,
    },
];

const adminPages : Item[] = [
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
        title: 'Orders',
        url: '/orders',
        icon: ConciergeBell,
        // icon: NotepadText,
    },
    {
        title: 'Manage',
        url: '/manage',
        icon: Settings2,
    },
    {
        title: "Contact",
        url: "/contact",
        icon: Contact,

    }
];

export function AppSidebar() {
    const { userName, userRole } = useAuth();
    // const [userName, setUserName] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState('/');
    const pathname = usePathname();
    useEffect(() => {
        // console.log('useeffect Appsidebar ------------------')
        setCurrentPage(pathname);
        if (userRole === 'admin') {
            setItems(adminPages);
        } else if (userRole === 'store_manager') {
            setItems(storePages);
        } else if (userRole === 'bakery_manager') {
            setItems(bakeryPages);
        } else if (userRole === 'order_manager') {
            setItems(orderPages);
        }
    }, [pathname, userRole]);

    async function signOut() {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out: ', error);
        } else {
            redirect('/login');
        }
    }

    // console.log("Role: " + userRole);
    // console.log("Store: " + userStore);



    // useEffect(() => {
        // async function getUserName() {
        //     const supabase = createClient();
        //     // const { data, error } = await supabase.auth.getUser();
        //     const { data, error } = await supabase.auth.getSession();
        //     if (error) {
        //         console.error('Error getting user:', error);
        //     } else {
        //         // console.log('User data here:', data);
        //         const name = data.session?.user?.email ?? '';
        //         // const name = data.user?.email ?? '';
        //         if (name.includes('@')) {
        //             const formattedName = name.split('@')[0];
        //             setUserName(
        //                 formattedName[0].toUpperCase() + formattedName.slice(1)
        //             );
        //         } else if (name === '') {
        //             setUserName('Account');
        //         } else {
        //             setUserName(name);
        //         }
        //     }
        // }

        // getUserName();
    // }, []);

    return (
        <Sidebar collapsible='icon' variant='floating'>
            <SidebarHeader>
                <Link href='/' className='pointer-events-none'>
                    <Image src={menuLogo} alt='menu logo' priority />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {items?.length > 0 && items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                // isActive={currentPage === item.url}
                                isActive={
                                    currentPage.split('/')[1] ===
                                    item.url.split('/')[1]
                                }
                                variant='myTheme'
                                className='h-10'
                                // className={`hover:bg-myBrown ${currentPage === item.url ? 'text-brown' : ''}`}
                            >
                                <Link href={item.url}>
                                    {/* <item.icon/> */}
                                    {React.createElement(item.icon, {
                                        strokeWidth:
                                            currentPage.split('/')[1] ===
                                            item.url.split('/')[1]
                                                ? 2
                                                : 1,
                                    })}
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
                                <SidebarMenuButton variant='myTheme'>
                                    <User />
                                    <span>{userName}</span>
                                    <ChevronUp className='ml-auto' />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side='top'
                                className='w-[--radix-popper-anchor-width]'
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
