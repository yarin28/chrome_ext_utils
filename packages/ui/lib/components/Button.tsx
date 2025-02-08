import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils';
import { buttonVariants } from './buttonVariants';

export type ButtonProps = {
  theme?: 'light' | 'dark';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'custom';
  size?: 'default';
} & ComponentPropsWithoutRef<'button'>;

export function Button({ theme, className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  );
}
