"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

// Use explicit HTML types instead of Radix ComponentPropsWithoutRef to avoid
// React 19 strict type incompatibilities with the Radix primitive resolution
const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <AccordionPrimitive.Item ref={ref as any} className={cn("border-b", className)} {...(props as any)} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <AccordionPrimitive.Trigger ref={ref as any} className={cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className,
    )} {...(props as any)}>
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <AccordionPrimitive.Content ref={ref as any} className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...(props as any)}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
