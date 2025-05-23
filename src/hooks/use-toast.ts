import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];
let toastId = 0;
let listeners: Array<(toasts: Toast[]) => void> = [];

export function useToast() {
  const [, forceUpdate] = useState({});

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = (toastId++).toString();
      const newToast: Toast = { id, title, description, variant };
      
      toasts.push(newToast);
      listeners.forEach((listener) => listener([...toasts]));
      
      // 自动移除toast
      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
          listeners.forEach((listener) => listener([...toasts]));
        }
      }, 5000);
      
      return id;
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    const index = toasts.findIndex((t) => t.id === toastId);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach((listener) => listener([...toasts]));
    }
  }, []);

  // 注册监听器以强制重新渲染
  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toast,
    dismiss,
    toasts: [...toasts],
    subscribe,
  };
} 