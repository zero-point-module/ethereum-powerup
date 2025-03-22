"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { STORAGE_KEYS } from "@/constants"

interface InstalledModulesContextType {
  installedModules: number[]
  installModule: (moduleId: number) => void
  uninstallModule: (moduleId: number) => void
  isModuleInstalled: (moduleId: number) => boolean
  clearAllModules: () => void
}

const InstalledModulesContext = createContext<InstalledModulesContextType | undefined>(undefined)

export function InstalledModulesProvider({ children }: { children: ReactNode }) {
  const [installedModules, setInstalledModules] = useState<number[]>([])

  // Load installed modules from localStorage on initial render
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem(STORAGE_KEYS.INSTALLED_MODULES)
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules))
      }
    } catch (error) {
      console.error("Failed to load installed modules:", error)
    }
  }, [])

  // Save installed modules to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTALLED_MODULES, JSON.stringify(installedModules))
    } catch (error) {
      console.error("Failed to save installed modules:", error)
    }
  }, [installedModules])

  // Install a module
  const installModule = useCallback(
    (moduleId: number) => {
      if (!installedModules.includes(moduleId)) {
        setInstalledModules((prev) => [...prev, moduleId])
      }
    },
    [installedModules],
  )

  // Uninstall a module
  const uninstallModule = useCallback((moduleId: number) => {
    setInstalledModules((prev) => prev.filter((id) => id !== moduleId))
  }, [])

  // Check if a module is installed
  const isModuleInstalled = useCallback(
    (moduleId: number) => {
      return installedModules.includes(moduleId)
    },
    [installedModules],
  )

  // Clear all installed modules
  const clearAllModules = useCallback(() => {
    setInstalledModules([])
  }, [])

  const value = {
    installedModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
    clearAllModules,
  }

  return <InstalledModulesContext.Provider value={value}>{children}</InstalledModulesContext.Provider>
}

// Custom hook to use the installed modules context
export function useInstalledModules() {
  const context = useContext(InstalledModulesContext)
  if (context === undefined) {
    throw new Error("useInstalledModules must be used within an InstalledModulesProvider")
  }
  return context
}

