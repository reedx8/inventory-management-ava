'use client'; // for shadcn navigation menu
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

const PAGE_NAMES = [
    '/home',
    '/store',
    '/bakery',
    '/orders',
    '/manage',
    '/contact',
] as const;
interface NavItem {
    title: string;
    url: string;
}

const storePages : NavItem[] = [
    {
        title: 'Orders Due',
        url: PAGE_NAMES[1],
    },
    {
        title: 'Stock Due',
        url: PAGE_NAMES[1] + '/stock',
    },
    // { TODO
    //     title: "Pars",
    //     url: "/store/pars"
    // },
    /* TODO
        title: "Overview",
        url: "/stores/overview"
    */
];

const orderPages : NavItem[] = [
    {
        title: 'Orders',
        url: '/orders',
    },
    {
        title: 'Milk & Bread',
        url: '/orders/milkbread',
    },
]

const managePages : NavItem[] = [
    {
        title: 'Inventory',
        url: '/manage',
    },
    {
        title: 'Reports',
        url: '/manage/reports',
    },
    {
        title: 'Stores',
        url: '/manage/stores',
    },
    {
        title: 'History',
        url: '/manage/history',
    }
]

const contactPages : NavItem[] = [
    {
        title: 'Vendors',
        url: '/contact',
    },
    {
        title: 'Staff',
        url: '/contact/staff',
    }
]

export default function PagesNavBar() {
    const [currentPage, setCurrentPage] = useState('/');
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const pathname = usePathname();
    useEffect(() => {
        setCurrentPage(pathname);
        if (pathname.split('/')[1] === 'orders') {
            setNavItems(orderPages);
        } else if (pathname.split('/')[1] === 'store') {
            setNavItems(storePages);
        } else if (pathname.split('/')[1] === 'manage') {
            setNavItems(managePages); 
        } else if (pathname.split('/')[1] === 'contact') {
            setNavItems(contactPages);
        } else {
            setNavItems([]);
        }
    }, [pathname, navItems]);

    // console.log(currentPage);

    return (
        <NavigationMenu className='my-2 border rounded-sm p-2 mb-4'>
            <NavigationMenuList>
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        <Link href={item.url} legacyBehavior passHref>
                            <Button variant={currentPage === item.url ? 'myTheme2' : 'outline'}>
                                {/* <NavigationMenuLink className={currentPage === item.url ? `${navigationMenuTriggerStyle()} bg-myBrown` : navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink> */}
                                {/* <NavigationMenuLink
                                    className={
                                        currentPage === item.url
                                            ? 'bg-myBrown rounded-sm p-2 text-sm'
                                            : 'rounded-sm p-2 hover:bg-gray-100 text-sm hover:text-gray-800'
                                    }
                                > */}
                                    <NavigationMenuLink>
                                    {item.title}
                                </NavigationMenuLink>
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
