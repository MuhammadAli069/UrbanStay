import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface SavedPropertiesContextType {
  savedProperties: number[];
  toggleSaveProperty: (propertyId: number) => void;
  isPropertySaved: (propertyId: number) => boolean;
}

const STORAGE_KEY = "urbanstay_saved";

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

function loadSaved(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function SavedPropertiesProvider({ children }: { children: ReactNode }) {
  const [savedProperties, setSavedProperties] = useState<number[]>(loadSaved);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProperties));
    } catch {
      /* storage unavailable */
    }
  }, [savedProperties]);

  const toggleSaveProperty = (propertyId: number) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isPropertySaved = (propertyId: number) => savedProperties.includes(propertyId);

  return (
    <SavedPropertiesContext.Provider value={{ savedProperties, toggleSaveProperty, isPropertySaved }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties() {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error("useSavedProperties must be used within a SavedPropertiesProvider");
  }
  return context;
}
