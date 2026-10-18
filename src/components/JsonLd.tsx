import { ReactNode } from "react"

interface JsonLdProps {
  data: Record<string, unknown>
  children?: ReactNode
}

/**
 * Component to inject JSON-LD structured data into page head
 * Usage: <JsonLd data={organizationSchema} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Multiple JSON-LD schemas wrapper
 */
export function JsonLdCollection({
  items,
}: {
  items: Record<string, unknown>[]
}) {
  return (
    <>
      {items.map((item, index) => (
        <JsonLd key={index} data={item} />
      ))}
    </>
  )
}
