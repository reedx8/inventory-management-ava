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
import {createClient} from '@/app/utils/supabase/client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

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
    
    // redirect if already logged in
    async function checkIfLoggedIn() {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!error) {
            redirect('/');
        }
    }

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
      <div className="fixed h-screen w-screen overflow-hidden top-0 left-0 -z-10">
        {/* <Image src={loginbg} alt="login background" className="w-full h-full object-cover layout-fill -z-10"/> */}
        <div className="flex flex-col items-center justify-center h-screen z-100">
          <Image src={menuLogo} alt="login logo" height={130}/>
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
                            <FormItem>
                                <FormLabel htmlFor={field.name}>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter your email'
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
                            <FormItem>
                                <FormLabel htmlFor={field.name}>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter your password'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Log in</Button>
                </form>
            </Form>
        </div>
        {/* <Image src={loginbg} alt="login background" className="left-0 top-0 w-full h-full object-cover z-0"/> */}
        </div>
    );
}
