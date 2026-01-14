export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className || 'py-8'}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
