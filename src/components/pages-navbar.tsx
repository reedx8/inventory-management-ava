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

interface NavItem {
    title: string;
    url: string;
}

const storePages : NavItem[] = [
    {
        title: 'Orders Due',
        url: '/store',
    },
    {
        title: 'Stock Due',
        url: '/store/stock',
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

export default function PagesNavBar() {
    const [currentPage, setCurrentPage] = useState('/');
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const pathname = usePathname();
    useEffect(() => {
        setCurrentPage(pathname);
        if (pathname.split('/')[1] === 'orders') {
            setNavItems(orderPages);
        } else {
            setNavItems(storePages);
        }
    }, [pathname, navItems]);

    // console.log(currentPage);

    return (
        <NavigationMenu className='my-4 border rounded-sm p-2'>
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
