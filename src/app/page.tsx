export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      {/* Testing the dark-surface color, the white background,
        and the custom dropdown shadow
      */}
      <main className="shadow-dropdown dark:bg-dark-surface flex w-full max-w-3xl flex-col items-center gap-8 rounded-lg bg-white p-12 sm:items-start">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          {/* Testing Custom Typography (Heading L) */}
          <h1 className="text-heading-l text-dark-text font-bold dark:text-white">
            Design System Test
          </h1>

          {/* Testing Custom Typography (Body) and Neutral Colors */}
          <p className="text-body text-neutral-400 dark:text-neutral-200">
            If you can read this in League Spartan, and the colors match the
            design system, your Tailwind config is working perfectly!
          </p>
        </div>

        {/* Testing Primary and Danger colors and their hover states */}
        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          <button className="bg-primary text-heading-s hover:bg-primary-hover rounded-full px-6 py-4 font-bold text-white transition-colors">
            Primary Button
          </button>

          <button className="bg-danger text-heading-s hover:bg-danger-hover rounded-full px-6 py-4 font-bold text-white transition-colors">
            Danger Button
          </button>
        </div>
      </main>
    </div>
  )
}
