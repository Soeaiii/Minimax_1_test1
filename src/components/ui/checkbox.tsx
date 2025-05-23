'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center',
            'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
            'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600',
            className
          )}
          data-state={props.checked ? 'checked' : 'unchecked'}
        >
          {props.checked && (
            <Check className="h-3 w-3 text-white" />
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox }; 