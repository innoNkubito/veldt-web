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
  /** Only rendered for users with the OWNER role */
  ownerOnly?: boolean
  /** Only rendered for Veldt staff (PlatformAdmin) — not operator users */
  staffOnly?: boolean
}

export interface NavSectionConfig {
  section: string
  items: NavItemConfig[]
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    section: "Admin",
    items: [
      {
        label: "Itineraries",
        href: "/itineraries",
        icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
      {
        label: "Bookings",
        href: "/bookings",
        icon: "M2 9h20M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM6 14h4",
      },
      {
        label: "Task Manager",
        href: "/tasks",
        icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
      },
      {
        label: "Integrations",
        href: "/integrations",
        icon: "M9 2v6M15 2v6M9 22v-4a3 3 0 0 1-3-3V8h12v7a3 3 0 0 1-3 3v4",
        ownerOnly: true,
      },
    ],
  },
  {
    section: "Archive",
    items: [
      {
        label: "Home",
        href: "/library",
        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      },
      {
        label: "Page Content",
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
      {
        label: "Visuals",
        href: "/library/visuals",
        icon: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
      },
    ],
  },
  {
    // Veldt staff only — hidden entirely from operator users
    section: "Veldt Staff",
    items: [
      {
        label: "Onboarding Requests",
        href: "/admin/requests",
        icon: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 0 0 .1M20 8v6M23 11h-6",
        staffOnly: true,
      },
    ],
  },
]
