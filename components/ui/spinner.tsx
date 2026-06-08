import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function Spinner({ size = 'default', className }: SpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', default: 'w-5 h-5', lg: 'w-7 h-7' }
  return (
    <div className={cn('relative', sizeMap[size], className)}>
      <div className={cn(
        'absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin',
      )} />
      <div className={cn(
        'absolute inset-[3px] rounded-full border-2 border-transparent border-t-accent/40 animate-spin',
        'animation-duration-[1.5s]',
      )} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
    </div>
  )
}
