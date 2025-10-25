"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex flex-1 list-none items-center justify-center gap-2",
        "rounded-xl bg-gradient-to-r from-[#5C83B3]/20 via-[#37649D]/20 to-[#134686]/20 backdrop-blur-md p-1.5",
        "shadow-[inset_0_0_6px_rgba(19,70,134,0.2)] border border-[#37649D]/20",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#37649D] to-[#134686] text-white hover:from-[#5C83B3] hover:to-[#37649D] hover:shadow-[0_0_10px_rgba(92,131,179,0.4)] focus-visible:ring-2 focus-visible:ring-[#5C83B3] focus-visible:ring-offset-2",
        secondary:
          "bg-[#E9EFF7] text-[#134686] border border-[#37649D]/30 hover:bg-[#5C83B3]/20 hover:text-[#134686] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#37649D] focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-full left-0 mt-3 w-60 rounded-lg border border-[#5C83B3]/30 bg-gradient-to-b from-[#EAF1FA] to-[#D7E3F3] shadow-lg shadow-[#134686]/10 p-3",
        "transition-all duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "mt-2 w-full max-w-md rounded-xl border border-[#5C83B3]/30 bg-gradient-to-b from-[#F8FAFD] to-[#E5EEFA] shadow-md shadow-[#134686]/10 transition-all duration-300",
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#134686] transition-all duration-300",
        "hover:bg-[#5C83B3]/15 hover:text-[#37649D] focus-visible:ring-2 focus-visible:ring-[#37649D] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "absolute top-full flex h-2 items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="h-2 w-2 rotate-45 bg-[#37649D] shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
