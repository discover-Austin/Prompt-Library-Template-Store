'use client'

import { Lock, Eye, Copy, Bookmark } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CATEGORIES, PLATFORMS } from '@/lib/prompts'
import { PromptWithPack } from '@/lib/prompts'
import { cn } from '@/lib/utils'

interface PromptCardProps {
  prompt: PromptWithPack
  onClick?: () => void
  hasAccess?: boolean
  onSave?: () => void
  isSaved?: boolean
}

export function PromptCard({ prompt, onClick, hasAccess = false, onSave, isSaved }: PromptCardProps) {
  const category = CATEGORIES.find((c) => c.value === prompt.category)
  const isLocked = prompt.tier !== 'free' && !hasAccess

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-lg',
        isLocked && 'border-amber-200 dark:border-amber-900'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{category?.icon}</span>
              <Badge variant="secondary" className="text-xs">
                {category?.label}
              </Badge>
              {prompt.featured && (
                <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
              {prompt.title}
            </CardTitle>
          </div>
          {isLocked && (
            <Lock className="h-5 w-5 text-amber-500 flex-shrink-0" />
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {prompt.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {prompt.platforms.slice(0, 3).map((platform) => {
            const platformInfo = PLATFORMS.find((p) => p.value === platform)
            return (
              <Badge key={platform} variant="outline" className="text-xs">
                {platformInfo?.label}
              </Badge>
            )
          })}
          {prompt.platforms.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{prompt.platforms.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {prompt.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Copy className="h-4 w-4" />
            {prompt.copyCount}
          </span>
        </div>
        {onSave && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onSave()
            }}
            className="ml-auto"
          >
            <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
