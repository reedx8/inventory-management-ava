'use client';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { useState } from 'react';

export default function SearchBar() {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        // console.log(query);
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
        }
    };

    return (
        <div className='flex flex-col gap-2 items-center mt-4'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className='h-8 w-60 bg-gray-50 text-neutral-500'
                        variant='outline'
                    >
                        <Search /> Search...
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{`Search Ava's Items`}</DialogTitle>
                        {/* <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </DialogDescription> */}
                    </DialogHeader>
                    <Input
                        placeholder='Type an item name...'
                        className='w-full'
                        onChange={(e) => handleChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                        // variant='outline'
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
