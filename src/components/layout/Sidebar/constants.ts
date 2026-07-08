export interface NavSubItem {
  label: string
  href: string
}

export interface NavItemConfig {
  label: string
  href: string
  icon: string
  /** If present, clicking toggles sub-list instead of navigating directly */
  subItems?: NavSubItem[]
}

export interface NavSectionConfig {
  section: string
  items: NavItemConfig[]
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    section: "Operations",
    items: [
      {
        label: "Itineraries",
        href: "/itineraries",
        icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
    ],
  },
  {
    section: "Library",
    items: [
      {
        label: "Home",
        href: "/library",
        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      },
      {
        label: "Content",
        href: "/library",
        icon: "M4 6h16M4 10h16M4 14h10",
        subItems: [
          { label: "Properties",         href: "/library/properties" },
          { label: "Areas",              href: "/library/areas" },
          { label: "Activities",         href: "/library/activities" },
          { label: "About Us",           href: "/library/about-us" },
          { label: "Introductory Notes", href: "/library/introductory-notes" },
          { label: "Terms & Conditions", href: "/library/terms-and-conditions" },
        ],
      },
    ],
  },
]
