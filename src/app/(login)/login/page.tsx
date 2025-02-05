'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { login } from './actions';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import menuLogo from '/public/menuLogo.png';
// import loginbg from '/public/loginbg.jpg';
import Image from 'next/image';
import { createClient } from '@/app/utils/supabase/client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('password', values.password);
        await login(formData);
    }

    useEffect(() => {
        // redirect if already logged in
        async function checkIfLoggedIn() {
            const supabase = await createClient();
            const { data, error } = await supabase.auth.getUser();

            if (!error) {
                redirect('/');
            }
        }
        checkIfLoggedIn();
    }, []);

    return (
        <div className='relative min-h-screen w-full overflow-hidden bg-black'>
            <video
                autoPlay
                loop
                muted
                playsInline
                className='absolute top-0 left-0 w-full h-full object-cover'
            >
                <source
                    src='https://pfgxgvbovzogwfhejjus.supabase.co/storage/v1/object/public/media//bgvid.mp4'
                    type='video/mp4'
                />
                <Image src='/public/fallback.jpg' alt='login background' fill />
            </video>

            {/* Overlay */}
            <div className='absolute top-0 left-0 w-full h-full bg-black/30' />

            {/* <div className="flex flex-col items-center justify-center h-screen z-10000"> */}
            <div className='relative flex flex-col items-center justify-center min-h-screen'>
                <div className='w-full max-w-sm bg-myDarkbrown/50 p-8 rounded-xl shadow-xl backdrop-blur-lg'>
                    <div className='mb-8 flex flex-col justify-center gap-1'>
                        <div>
                            <Image
                                src={menuLogo}
                                alt='login logo'
                                height={130}
                            />
                        </div>
                        <div>
                            <h1 className='text-myBrown/90 text-sm font-semibold text-center'>
                                Inventory Management System
                            </h1>
                            <p className='text-white/90 text-xs font-semibold text-center'>
                                Sign in to your account
                            </p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form
                            className='flex flex-col gap-4'
                            onSubmit={form.handleSubmit(onSubmit)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                }
                            }}
                        >
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='text-xs text-white/90'>
                                        <FormLabel htmlFor={field.name}>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className='focus:border-none text-white/80 bg-white/20 border-none font-semibold'
                                                placeholder='Janedoe@gmail.com'
                                                type='email'
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem className='text-xs text-white/90'>
                                        <FormLabel htmlFor={field.name}>
                                            Account Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className='focus:border-none text-white/80 bg-white/20 border-none font-semibold'
                                                placeholder='Password'
                                                type='password'
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* <div className='items-top flex space-x-2'>
                                <Checkbox id='remember'  className='border-white/60 rounded-sm' />
                                <label
                                    htmlFor='remember'
                                    className='text-xs text-white/90 font-semibold'
                                >
                                    Remember for 30 days
                                </label>
                            </div> */}
                            <Button
                                type='submit'
                                // variant='outline'
                                className='w-full bg-white mt-2 hover:bg-white/90 text-black/90 font-semibold'
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className='animate-spin' />
                                )}
                                Sign in
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
