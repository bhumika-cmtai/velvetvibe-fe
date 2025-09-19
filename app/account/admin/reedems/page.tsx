'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2, Save, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/redux/store'
import { fetchWalletConfig, updateRewardRule } from '@/lib/redux/slices/adminSlice'

const FIELD_CONFIG = [
  {
    key: 'minSpend',
    label: 'Minimum Spend (₹)',
    placeholder: 'Enter minimum spend amount',
    description: 'Minimum amount customer needs to spend to earn points',
    type: 'number',
    step: '1',
  },
  {
    key: 'pointsAwarded',
    label: 'Points Awarded',
    placeholder: 'Enter points to be awarded',
    description: 'Number of points awarded for minimum spend',
    type: 'number',
    step: '1',
  },
  {
    key: 'rupeesPerPoint',
    label: 'Rupees per Point (₹)',
    placeholder: 'Enter rupee value per point',
    description: 'Value of each point in rupees for redemption',
    type: 'number',
    step: '0.01',
  },
] as const

type RedeemSettings = {
  minSpend: number
  pointsAwarded: number
  rupeesPerPoint: number
}

const RedeemSettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { walletConfig } = useSelector((state: RootState) => state.admin)
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState<RedeemSettings>({
    minSpend: 1000,
    pointsAwarded: 10,
    rupeesPerPoint: 1
  })
  const [tempSettings, setTempSettings] = useState<RedeemSettings>(settings)

  // Fetch wallet config on mount and update settings if available
  useEffect(() => {
    dispatch(fetchWalletConfig())
  }, [dispatch])

  useEffect(() => {
    if (walletConfig) {
      const firstRule = walletConfig.rewardRules?.[0]
      setSettings({
        minSpend: firstRule?.minSpend ?? 1000,
        pointsAwarded: firstRule?.pointsAwarded ?? 10,
        rupeesPerPoint: walletConfig.rupeesPerPoint ?? 1,
      })
      setTempSettings({
        minSpend: firstRule?.minSpend ?? 1000,
        pointsAwarded: firstRule?.pointsAwarded ?? 10,
        rupeesPerPoint: walletConfig.rupeesPerPoint ?? 1,
      })
    }
  }, [walletConfig])

  const handleEdit = () => {
    setTempSettings(settings)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setSettings(tempSettings)
    setIsEditing(false)
    // Save to backend
    await dispatch(updateRewardRule(tempSettings as any))
    // Optionally, refetch config
    dispatch(fetchWalletConfig())
  }

  const handleInputChange = (field: keyof RedeemSettings, value: string) => {
    setTempSettings(prev => ({
      ...prev,
      [field]: field === 'rupeesPerPoint'
        ? parseFloat(value) || 0
        : parseInt(value) || 0
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Redeem Settings</CardTitle>
              <CardDescription>
                Configure your loyalty points and redemption system
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {FIELD_CONFIG.map(field => (
              <div className="space-y-2" key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  step={field.step}
                  value={
                    isEditing
                      ? tempSettings[field.key as keyof RedeemSettings]
                      : settings[field.key as keyof RedeemSettings]
                  }
                  onChange={e =>
                    handleInputChange(field.key as keyof RedeemSettings, e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder={field.placeholder}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {!isEditing && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Current Settings Summary:</h4>
              <div className="space-y-1 text-sm">
                <p>• Minimum spend: ₹{settings.minSpend}</p>
                <p>• Points awarded: {settings.pointsAwarded} points</p>
                <p>• Redemption value: ₹{settings.rupeesPerPoint} per point</p>
                <p className="font-medium text-primary">
                  • Customer gets {settings.pointsAwarded} points for every ₹{settings.minSpend} spent
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RedeemSettingsPage