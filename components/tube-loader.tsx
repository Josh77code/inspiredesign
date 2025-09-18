interface TubeLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function TubeLoader({ size = "md", className = "" }: TubeLoaderProps) {
  const sizeClass = size === "sm" ? "tube-loader-sm" : size === "lg" ? "tube-loader-lg" : ""

  return <div className={`tube-loader ${sizeClass} ${className}`} />
}
