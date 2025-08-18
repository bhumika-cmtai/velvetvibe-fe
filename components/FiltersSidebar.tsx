"use client"

import { useState } from "react"
import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

interface FiltersSidebarProps {
  filters: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, optionId: string, checked: boolean) => void
  onClearFilters: () => void
  className?: string
}

export function FiltersSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className = "",
}: FiltersSidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(filters.map((f) => f.id))

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, group) => total + group.length, 0)
  }

  const getSelectedFiltersFlat = () => {
    const flat: Array<{ groupId: string; optionId: string; label: string }> = []
    Object.entries(selectedFilters).forEach(([groupId, options]) => {
      options.forEach((optionId) => {
        const group = filters.find((f) => f.id === groupId)
        const option = group?.options.find((o) => o.id === optionId)
        if (group && option) {
          flat.push({ groupId, optionId, label: option.label })
        }
      })
    })
    return flat
  }

  const removeFilter = (groupId: string, optionId: string) => {
    onFilterChange(groupId, optionId, false)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Selected Filters */}
      {getSelectedCount() > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Applied Filters</h3>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {getSelectedFiltersFlat().map((filter) => (
                <motion.div
                  key={`${filter.groupId}-${filter.optionId}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="pr-1 cursor-pointer hover:bg-gray-200"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  >
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeFilter(filter.groupId, filter.optionId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Filter Groups */}
      {filters.map((group) => (
        <div key={group.id} className="space-y-3">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex items-center justify-between w-full text-left font-medium"
          >
            {group.label}
            <motion.div animate={{ rotate: openGroups.includes(group.id) ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <X className="h-4 w-4 rotate-45" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openGroups.includes(group.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.id}-${option.id}`}
                      checked={selectedFilters[group.id]?.includes(option.id) || false}
                      onCheckedChange={(checked) => onFilterChange(group.id, option.id, checked as boolean)}
                    />
                    <Label
                      htmlFor={`${group.id}-${option.id}`}
                      className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                    >
                      {option.label}
                      {option.count && <span className="text-gray-400">({option.count})</span>}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-80 ${className}`}>
        <div
          className="sticky top-24 p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--theme-card)",
            borderColor: "var(--theme-border)",
          }}
        >
          <h2 className="text-lg font-semibold mb-6">Filters</h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters {getSelectedCount() > 0 && `(${getSelectedCount()})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
