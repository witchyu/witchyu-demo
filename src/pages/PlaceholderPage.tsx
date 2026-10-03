type PlaceholderPageProps = {
  title: string
  description: string
}

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
    <div className="rounded-full border border-[#a77dff]/40 bg-[#1d1830] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#d8c4f2]">
      Phase 1
    </div>
    <h1 className="mt-5 text-2xl font-semibold text-white">{title}</h1>
    <p className="mt-3 max-w-xs text-sm leading-6 text-[#b5afc7]">{description}</p>
  </div>
)
