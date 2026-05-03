import { createContext, useContext, useState, ReactNode } from "react";

interface SavedPropertiesContextType {
  savedProperties: number[];
  toggleSaveProperty: (propertyId: number) => void;
  isPropertySaved: (propertyId: number) => boolean;
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

export function SavedPropertiesProvider({ children }: { children: ReactNode }) {
  const [savedProperties, setSavedProperties] = useState<number[]>([]);

  const toggleSaveProperty = (propertyId: number) => {
    setSavedProperties((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const isPropertySaved = (propertyId: number) => {
    return savedProperties.includes(propertyId);
  };

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
