/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Headless confirm dialog built with a plain React portal.
 * No Radix Dialog dependency — avoids the tslib/Vite 8 issue.
 *
 * Usage:
 *   const { dialog, confirm } = useConfirm();
 *   ...
 *   const ok = await confirm({ title: "Delete course?", description: "..." });
 *   if (ok) doDelete();
 *   ...
 *   return <>{dialog}</>
 */

const ConfirmContext = React.createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = React.useState(null); // { title, description, resolve }

  const confirm = React.useCallback(
    ({ title, description }) =>
      new Promise((resolve) => {
        setState({ title, description, resolve });
      }),
    [],
  );

  const handleClose = (result) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => handleClose(false)}
          />
          {/* Dialog */}
          <div
            className={cn(
              "relative z-10 bg-white rounded-2xl shadow-xl border border-gray-200",
              "w-full max-w-sm mx-4 p-6 flex flex-col gap-4",
              "animate-in fade-in-0 zoom-in-95 duration-150",
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900">
                  {state.title}
                </h2>
                {state.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {state.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleClose(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const confirm = React.useContext(ConfirmContext);
  if (!confirm)
    throw new Error("useConfirm must be used inside ConfirmProvider");
  return confirm;
};
