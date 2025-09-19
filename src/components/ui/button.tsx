import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-custom-sm hover:shadow-custom-md hover-lift",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-custom-sm hover:shadow-custom-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover-lift",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-custom-sm hover:shadow-custom-md hover-lift",
        ghost: "hover:bg-accent hover:text-accent-foreground hover-lift",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-glow hover:scale-105 font-semibold transition-bounce",
        dashboard: "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover-lift",
        premium: "bg-gradient-to-r from-chart-2 to-chart-5 text-white hover:shadow-glow hover:scale-105 font-semibold transition-bounce",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
