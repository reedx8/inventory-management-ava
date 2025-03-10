'use client';
import { Button } from '@/components/ui/button';
import { Beef, Coffee, Dessert, Milk, Search, Wheat } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import redDot from '/public/icons/redDot.png';
import greenDot from '/public/icons/greenDot.png';
// import ava from '/public/ava.png';
import avaCircle from '/public/avaCircle.png';
import verticalLine from '/public/verticalLine.png';
import { QueryResults } from '@/components/types';

export default function SearchBar() {
    const [query, setQuery] = useState<string>('');
    const [data, setData] = useState<QueryResults[] | undefined>();
    const { toast } = useToast();

    const searchItems = async () => {
        try {
            const response = await fetch('/api/v1/search-items?query=' + query);
            const data = await response.json();

            if (!response.ok) {
                const msg = `Failed to fetch items`;
                throw new Error(msg);
            }
            setData(data);
        } catch (error) {
            // console.error('Error fetching bakerys orders:', error);
            const err = error as Error;

            toast({
                title: 'Error Searching Items',
                description: err.message,
                variant: 'destructive',
            });
        }
        // setQuery('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (e.target.value.trim() === '') {
            setData(undefined);
        }
        // console.log(query);
    };

    // async function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    //     if (e.key === 'Enter') {
    //         console.log('Enter key pressed');
    //     }
    // }

    async function handleSearch() {
        // console.log(query);
        if (query.trim() === '') {
            setData(undefined);
            setQuery('');
            return;
        }
        searchItems();
    }

    function selectIcon(categ: string) {
        const iconStyle = 'text-myBrown';
        if (categ === 'MILK') {
            return <Milk className={iconStyle} />;
        } else if (categ === 'PASTRY') {
            return <Dessert className={iconStyle} />;
        } else if (categ === 'RETAILBEANS') {
            return <Coffee className={iconStyle} />;
        } else if (categ === 'MEATS') {
            return <Beef className={iconStyle} />;
        } else if (categ === 'BREAD') {
            return <Wheat className={iconStyle} />;
        } else {
            return <Utensils className={iconStyle} />;
        }
    }
    // console.log(query);
    // console.log(data);

    return (
        <div>
            <Dialog
                onOpenChange={() => {
                    setTimeout(() => {
                        setQuery('');
                        setData(undefined);
                    }, 600);
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        className='h-8 bg-gray-50 text-neutral-500'
                        variant='outline'
                    >
                        <Search />
                    </Button>
                </DialogTrigger>
                <DialogContent className='bg-neutral-100'>
                    <DialogHeader>
                        <DialogTitle className='font-normal flex items-center gap-1'>
                            <Image
                                src={avaCircle}
                                alt='ava'
                                width={35}
                                priority={true}
                            />
                            <Image
                                src={verticalLine}
                                alt='vertical line'
                                width={18}
                                priority={true}
                            />{' '}
                            Search AVA Roasteria
                        </DialogTitle>
                        {/* <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </DialogDescription> */}
                    </DialogHeader>
                    <div className='flex items-center gap-2'>
                        <Input
                            placeholder='Type an item name...'
                            className='w-full h-9'
                            onChange={(e) => handleChange(e)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                        />
                        <Button
                            variant='myTheme'
                            className='w-fit'
                            size='sm'
                            onClick={handleSearch}
                        >
                            <Search />
                        </Button>
                    </div>
                    {query.length > 0 && data && data.length === 0 && (
                        <div>
                            <p className='text-center text-neutral-500'>
                                No results found
                            </p>
                        </div>
                    )}
                    {data && data.length > 0 && (
                        <ScrollArea className=' max-h-[100px] sm:max-h-[100px] md:max-h-[50vh]'>
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    className='bg-white p-3 rounded-md mb-2 shadow-md grid grid-cols-8 grid-rows-1 hover:bg-neutral-100 transition-all duration-300 hover:translate-y-[-2px]'
                                >
                                    <div className='flex items-center col-span-1'>
                                        {selectIcon(item.categ as string)}
                                    </div>
                                    <div className='flex flex-col col-span-7'>
                                        <div className='flex justify-between'>
                                            <h2 className='text-sm flex items-center gap-1'>
                                                {item.is_active ? (
                                                    <Image
                                                        src={greenDot}
                                                        alt='green dot'
                                                        width={10}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={redDot}
                                                        alt='red dot'
                                                        width={10}
                                                        height={10}
                                                    />
                                                )}
                                                {item.name}
                                                <Badge
                                                    variant='secondary'
                                                    className='text-xs text-myDarkbrown font-light bg-myBrown'
                                                >
                                                    {item.store_categ ?? ''}
                                                </Badge>
                                            </h2>
                                            <p className='text-xs text-neutral-500'>
                                                {item.units}
                                            </p>
                                        </div>
                                        <div className='text-xs text-neutral-500 flex flex-col justify-between'>
                                            <div>{item.vendor_name ?? ''}</div>
                                            <div>{item.email ?? ''}</div>
                                            <div>{item.phone ?? ''}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
