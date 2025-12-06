import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import { DialogTitle } from "@headlessui/react";

export function dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
    </DialogPrimitive.Root>
  );
}

export function DialogContent({children}) {
    <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50"/>
                <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">{children}</div>
                </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
}

export function DialogHeader({ children }) {
    return <div className="border-b pb-2 mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>
}
