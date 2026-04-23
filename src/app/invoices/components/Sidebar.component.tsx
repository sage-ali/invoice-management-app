'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

export const Sidebar = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <aside className="dark:bg-dark-surface z-50 flex h-18 w-full items-center bg-[#373B53] lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-25.75 lg:flex-col lg:rounded-r-[20px]">
      <div className="bg-primary relative flex h-full w-18 items-center justify-center overflow-hidden rounded-r-[20px] lg:h-25.75 lg:w-full">
        <div className="absolute bottom-0 h-1/2 w-full rounded-tl-[20px] bg-[#9277FF]" />
        <div className="relative z-10">
          <svg
            width="100%"
            height="100%"
            viewBox="100 100 825 825"
            className="block h-8 w-8 transition-all duration-200 lg:h-15 lg:w-15"
          >
            {/* This references an ID inside an external file */}
            <use href="/assets/pac.svg#pac-logo" />
          </svg>
        </div>
      </div>

      <div className="flex h-full flex-1 items-center justify-end lg:w-full lg:flex-col lg:justify-end">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="focus-visible:outline-primary rounded-full px-6 py-6 transition-colors hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 lg:px-0 lg:py-8"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          type="button"
        >
          {/* SUN ICON: Hidden in dark mode, block in light mode */}
          <div className="dark:hidden">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.373 15.392a8.12 8.12 0 007.364-4.793 8.12 8.12 0 01-8.112.012 8.12 8.12 0 01-4.045-7.14c0-1.502.414-2.907 1.132-4.106a8.12 8.12 0 00-4.062 7.15c0 4.485 3.636 8.12 8.12 8.12c1.42 0 2.748-.364 3.903-1.003a8.12 8.12 0 01-4.303 1.76z"
                fill="#7E88C3"
                fillRule="nonzero"
              />
            </svg>
          </div>

          {/* MOON ICON: Hidden in light mode, block in dark mode */}
          <div className="hidden dark:block">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 0a10 10 0 110 20 10 10 0 010-20zm0 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z"
                fill="#858BB2"
                fillRule="nonzero"
              />
            </svg>
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
