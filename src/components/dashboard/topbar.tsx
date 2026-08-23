"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      {/* Mobile Menu & Context */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
          Dashboard
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9 bg-slate-50 border-slate-200 h-9 text-sm focus-visible:ring-indigo-500"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-slate-900"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </Button>

        <Avatar className="w-8 h-8 md:hidden border border-slate-200">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
