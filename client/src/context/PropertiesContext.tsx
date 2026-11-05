import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import { allProperties as sampleProperties } from "../data/propertiesData";
import type { Property } from "../data/propertiesData";

interface PropertiesContextType {
  properties: Property[];
  isLoading: boolean;
  /** "api" when listings come from the server, "sample" when it couldn't be reached. */
  source: "api" | "sample";
  refresh: () => Promise<void>;
  getById: (id: number) => Property | undefined;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<"api" | "sample">("sample");

  const refresh = useCallback(async () => {
    try {
      const { properties } = await api<{ properties: Property[] }>("/properties");
      setProperties(properties);
      setSource("api");
      if (properties.length === 0) {
        console.info("[UrbanStay] No listings in the database yet. Run `npm run seed` in /server.");
      }
    } catch {
      // Backend not running: keep the bundled sample data so the site still works as a demo.
      setProperties(sampleProperties);
      setSource("sample");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getById = useCallback((id: number) => properties.find((p) => p.id === id), [properties]);

  return (
    <PropertiesContext.Provider value={{ properties, isLoading, source, refresh, getById }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
}
