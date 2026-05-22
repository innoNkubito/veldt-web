"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useClientStore } from "@/stores/clientStore";
import { useItineraryStore } from "@/stores/itineraryStore";
import { T } from "@/lib/theme";
import * as S from "./page.styled";

// ── Static mock data (matches the design exactly) ─────────────
const STATS = [
  {
    label: "Active Trips",
    value: "8",
    delta: "+2 from last month",
    accent: T.terra,
    icon: "M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3",
  },
  {
    label: "MTD Revenue",
    value: "$142k",
    delta: "↑ 18% vs target",
    accent: T.gold,
    icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    label: "Total Clients",
    value: "47",
    delta: "3 new this month",
    accent: T.sage,
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    label: "Pax Traveling",
    value: "18",
    delta: "Across 3 active trips",
    accent: T.teal,
    icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  },
];

const TRIPS = [
  {
    name: "Serengeti Migration Safari",
    client: "The Hartmann Group",
    dates: "May 2 – 10",
    pax: 6,
    nights: 8,
    status: "Confirmed",
    region: "Tanzania",
  },
  {
    name: "Okavango Delta Fly-Camp",
    client: "Reyes & Associates",
    dates: "May 7 – 14",
    pax: 4,
    nights: 7,
    status: "Traveling",
    region: "Botswana",
  },
  {
    name: "Kenya Highlands Circuit",
    client: "Sato Family",
    dates: "May 12 – 22",
    pax: 8,
    nights: 10,
    status: "Confirmed",
    region: "Kenya",
  },
  {
    name: "Namibia Desert & Coast",
    client: "Müller Expedition",
    dates: "May 18 – 28",
    pax: 2,
    nights: 10,
    status: "Planning",
    region: "Namibia",
  },
  {
    name: "Gorilla Trek Uganda",
    client: "Chen-Williams",
    dates: "Jun 2 – 9",
    pax: 3,
    nights: 7,
    status: "Planning",
    region: "Uganda",
  },
];

const PIPELINE = [
  { label: "Leads", count: 12, color: T.muted },
  { label: "Planning", count: 7, color: T.gold },
  { label: "Confirmed", count: 5, color: T.sage },
  { label: "Traveling", count: 3, color: T.terra },
  { label: "Completed", count: 24, color: T.teal },
];
const PIPELINE_TOTAL = PIPELINE.reduce((a, p) => a + p.count, 0);

const ACTIVITY = [
  {
    text: "Itinerary PDF shared with client",
    trip: "Serengeti Migration",
    time: "2h ago",
    type: "share",
  },
  {
    text: "50% deposit payment received",
    trip: "Okavango Delta",
    time: "5h ago",
    type: "payment",
  },
  {
    text: "New enquiry submitted via portal",
    trip: "Gorilla Trek Uganda",
    time: "Yesterday",
    type: "enquiry",
  },
  {
    text: "Day 3 supplier confirmed",
    trip: "Kenya Highlands",
    time: "Yesterday",
    type: "confirm",
  },
  {
    text: "Ground transport booked",
    trip: "Namibia Desert",
    time: "2d ago",
    type: "book",
  },
];

const TASKS = [
  {
    task: "Send final itinerary PDF",
    trip: "Serengeti Migration",
    urgent: true,
  },
  { task: "Confirm lodge availability", trip: "Namibia Desert", urgent: false },
  { task: "Chase visa docs", trip: "Kenya Highlands", urgent: false },
];

const STATUS_META: Record<string, { color: string; bg: string }> = {
  Traveling: { color: T.terra, bg: T.terraLt },
  Confirmed: { color: T.sage, bg: T.sageLt },
  Planning: { color: T.gold, bg: T.goldLt },
};

const ACTIVITY_COLORS: Record<string, string> = {
  share: T.teal,
  payment: T.sage,
  enquiry: T.gold,
  confirm: T.sage,
  book: T.terra,
};

// ── Sub-components ────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { color: T.muted, bg: T.dim };
  return (
    <S.StatusBadgeSpan $bg={m.bg} $color={m.color}>
      {status}
    </S.StatusBadgeSpan>
  );
}

function StatCard({ label, value, delta, accent, icon }: (typeof STATS)[0]) {
  return (
    <S.StatCardWrap $accent={accent}>
      <S.StatTop>
        <S.StatLabel>{label}</S.StatLabel>
        <S.StatIcon
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={icon} />
        </S.StatIcon>
      </S.StatTop>
      <S.StatValue>{value}</S.StatValue>
      <S.StatDelta $accent={accent}>{delta}</S.StatDelta>
    </S.StatCardWrap>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { signOut } = useClerk();
  const client = useClientStore((s) => s.client);
  const { fetchItineraries } = useItineraryStore();

  useEffect(() => {
    if (client) fetchItineraries();
  }, [client]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* ── Page header ── */}
      <S.PageHeader>
        <div>
          <S.Greeting>
            {greeting}, <em>Sarah</em>
          </S.Greeting>
          <S.SubHeader>
            <span>{today}</span>
            <S.Dot />
            <S.DepartureHighlight>3 departures this week</S.DepartureHighlight>
          </S.SubHeader>
        </div>

        <S.QuickActions>
          {["+ Itinerary", "+ Client", "+ Enquiry"].map((q) => (
            <S.QuickBtn key={q}>{q}</S.QuickBtn>
          ))}
          <S.QuickBtn onClick={() => signOut({ redirectUrl: "/sign-in" })}>
            Sign out
          </S.QuickBtn>
        </S.QuickActions>
      </S.PageHeader>

      {/* ── Stats row ── */}
      <S.StatsGrid>
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </S.StatsGrid>

      {/* ── Main grid ── */}
      <S.MainGrid>
        {/* Left column */}
        <S.Column>
          {/* Upcoming Departures */}
          <S.Card>
            <S.CardHeader>
              <S.SectionLabel>Upcoming Departures</S.SectionLabel>
              <S.ViewAllLink>View all →</S.ViewAllLink>
            </S.CardHeader>

            <S.TableHead>
              {["Trip", "Client", "Dates", "Pax", "Status"].map((h) => (
                <S.TableHeadCell key={h}>{h}</S.TableHeadCell>
              ))}
            </S.TableHead>

            {TRIPS.map((t, i) => {
              const active = hovered === `trip-${i}`;
              return (
                <S.TripRow
                  key={t.name}
                  $last={i === TRIPS.length - 1}
                  onMouseEnter={() => setHovered(`trip-${i}`)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <S.TripCell>
                    <S.StatusBar
                      $color={STATUS_META[t.status]?.color ?? T.muted}
                    />
                    <div>
                      <S.TripName $hovered={active}>{t.name}</S.TripName>
                      <S.TripMeta>
                        {t.region} · {t.nights} nights
                      </S.TripMeta>
                    </div>
                  </S.TripCell>
                  <S.TripClient>{t.client}</S.TripClient>
                  <S.TripDates>{t.dates}</S.TripDates>
                  <S.TripPax>{t.pax}</S.TripPax>
                  <StatusBadge status={t.status} />
                </S.TripRow>
              );
            })}
          </S.Card>

          {/* Pipeline */}
          <S.Card>
            <S.CardHeader>
              <S.SectionLabel>Itinerary Pipeline</S.SectionLabel>
              <S.PipelineTotal>{PIPELINE_TOTAL} total</S.PipelineTotal>
            </S.CardHeader>

            <S.PipelineBar>
              {PIPELINE.map((p) => (
                <S.PipelineSegment
                  key={p.label}
                  $flex={p.count}
                  $color={p.color}
                  title={`${p.label}: ${p.count}`}
                >
                  {p.count}
                </S.PipelineSegment>
              ))}
            </S.PipelineBar>

            <S.Legend>
              {PIPELINE.map((p) => (
                <S.LegendItem key={p.label}>
                  <S.LegendSwatch $color={p.color} />
                  {p.label}
                  <S.LegendCount>{p.count}</S.LegendCount>
                </S.LegendItem>
              ))}
            </S.Legend>
          </S.Card>
        </S.Column>

        {/* Right column */}
        <S.Column>
          {/* Activity feed */}
          <S.ActivityCard>
            <S.SectionLabel>Recent Activity</S.SectionLabel>
            <S.ActivityList>
              {ACTIVITY.map((a, i) => (
                <S.ActivityRow key={i} $last={i === ACTIVITY.length - 1}>
                  <S.ActivityIcon $color={ACTIVITY_COLORS[a.type]}>
                    <S.ActivityDot $color={ACTIVITY_COLORS[a.type]} />
                  </S.ActivityIcon>
                  <div style={{ flex: 1 }}>
                    <S.ActivityText>{a.text}</S.ActivityText>
                    <S.ActivityMeta>
                      <S.ActivityTrip>{a.trip}</S.ActivityTrip>
                      <S.Dot $size={2} />
                      {a.time}
                    </S.ActivityMeta>
                  </div>
                </S.ActivityRow>
              ))}
            </S.ActivityList>
            <S.ActivityFooter>
              <S.ViewAllLink>View full activity log →</S.ViewAllLink>
            </S.ActivityFooter>
          </S.ActivityCard>

          {/* Tasks due today */}
          <S.TasksCard>
            <S.SectionLabel>Due Today</S.SectionLabel>
            <S.TaskList>
              {TASKS.map((t, i) => (
                <S.TaskRow key={i} $last={i === TASKS.length - 1}>
                  <S.Checkbox $urgent={t.urgent} />
                  <div style={{ flex: 1 }}>
                    <S.TaskName>{t.task}</S.TaskName>
                    <S.TaskTrip>{t.trip}</S.TaskTrip>
                  </div>
                  {t.urgent && <S.UrgentBadge>URGENT</S.UrgentBadge>}
                </S.TaskRow>
              ))}
            </S.TaskList>
          </S.TasksCard>
        </S.Column>
      </S.MainGrid>
    </>
  );
}
