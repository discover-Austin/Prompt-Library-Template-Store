'use client'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { PromptVariable } from '@/types'

interface VariableInputProps {
  variable: PromptVariable
  value: string
  onChange: (value: string) => void
}

export function VariableInput({ variable, value, onChange }: VariableInputProps) {
  const isLong = variable.description.length > 50 || (variable.default && variable.default.length > 100)

  return (
    <div className="space-y-2">
      <Label htmlFor={variable.name} className="text-sm font-medium">
        {variable.name}
      </Label>
      <p className="text-xs text-muted-foreground">{variable.description}</p>
      {isLong ? (
        <Textarea
          id={variable.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.default || `Enter ${variable.name}...`}
          className="min-h-[100px]"
        />
      ) : (
        <Input
          id={variable.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.default || `Enter ${variable.name}...`}
        />
      )}
    </div>
  )
}
