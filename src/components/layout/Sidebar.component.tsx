'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

export const Sidebar = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <aside className="dark:bg-dark-surface z-50 flex h-18 w-full items-center bg-[#373B53] md:h-20 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-25.75 lg:flex-col lg:rounded-r-[20px]">
      <div className="bg-primary relative flex h-full w-18 items-center justify-center overflow-hidden rounded-r-[20px] md:w-20 lg:h-25.75 lg:w-25.75">
        <div className="absolute bottom-0 h-1/2 w-full rounded-tl-[20px] bg-[#9277FF]" />
        <div className="relative z-10">
          <Image
            src="/assets/logo.svg"
            alt="Logo"
            width={28}
            height={26}
            className="block h-auto w-7 transition-all duration-200 md:w-8 lg:w-10"
          />
        </div>
      </div>

      <div className="flex h-full flex-1 items-center justify-end lg:w-full lg:flex-col lg:justify-end">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="focus-visible:outline-primary mr-8 mb-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 lg:mr-0 lg:mb-8"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          type="button"
        >
          {/* MOON ICON: Hidden in dark mode, block in light mode */}
          <div className="dark:hidden">
            <Image
              src="/assets/icon-moon.svg"
              alt="Dark Mode"
              width={20}
              height={20}
            />
          </div>

          {/* SUN ICON: Hidden in light mode, block in dark mode */}
          <div className="hidden dark:block">
            <Image
              src="/assets/icon-sun.svg"
              alt="Light Mode"
              width={20}
              height={20}
            />
          </div>
        </button>

        <div className="h-full w-px bg-[#494E6E] lg:h-px lg:w-full" />

        <div className="flex items-center justify-center px-6 lg:px-0 lg:py-6">
          <div className="relative h-8 w-8 overflow-hidden rounded-full lg:h-10 lg:w-10">
            <Image
              src="/assets/image-avatar.jpg"
              alt="User avatar"
              width={50}
              height={50}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
