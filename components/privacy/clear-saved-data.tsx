"use client";

import { useEffect, useRef, useState } from "react";
import { clearAllLocal } from "@/lib/persistence";

export function ClearSavedData() {
  const [phase, setPhase] = useState<"idle" | "confirm" | "cleared">("idle");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const didConfirm = useRef(false);

  useEffect(() => {
    if (phase === "confirm") {
      didConfirm.current = true;
      cancelRef.current?.focus();
      return;
    }
    if (phase === "idle" && didConfirm.current) triggerRef.current?.focus();
  }, [phase]);

  return (
    <div className="clear-panel">
      <p className="clear-records">Budget · Net Worth · Debt Snowball</p>
      <p>
        Optional on-device saves can be deleted here, by clearing this site’s data in your browser, or by using the browser’s storage settings.
      </p>
      {phase === "cleared" ? (
        <p role="status" className="mt-4 font-semibold text-foreground">Saved data cleared</p>
      ) : phase === "confirm" ? (
        <div className="clear-confirm" role="alertdialog" aria-labelledby="clear-title" aria-describedby="clear-desc">
          <p id="clear-title">Clear saved MoneyBasis data?</p>
          <p id="clear-desc">
            This removes locally saved Budget, Net Worth and Debt Snowball records from this browser. It does not affect any server account because MoneyBasis does not upload these records.
          </p>
          <div className="clear-actions">
            <button ref={cancelRef} type="button" className="trust-button-secondary" onClick={() => setPhase("idle")}>
              Cancel
            </button>
            <button
              type="button"
              className="trust-button clear-danger"
              onClick={() => {
                clearAllLocal();
                setPhase("cleared");
              }}
            >
              Clear data
            </button>
          </div>
        </div>
      ) : (
        <button ref={triggerRef} type="button" className="trust-button mt-4" onClick={() => setPhase("confirm")}>
          Clear saved data
        </button>
      )}
    </div>
  );
}
