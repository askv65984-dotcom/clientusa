import Link from "next/link";
import { ArticleFigure, Callout } from "@/components/site/article-figure";
import type { Insight } from "./types";

function Body() {
  return (
    <>
      <p>
        &ldquo;Patients can&rsquo;t get in&rdquo; is one of the most common complaints a practice hears, and one of the
        hardest to act on without numbers. Patient access metrics turn that complaint into something you can measure,
        assign and improve. This guide covers the measures that matter most, where to find the data, and how to turn
        them into a one-page scorecard your team will actually use.
      </p>

      <h2 id="what-access-means">What patient access really covers</h2>
      <p>
        Access is every step between a patient deciding they need care and being seen: reaching you by phone or online,
        finding an appointment soon enough, completing registration, and arriving for a visit that starts on time. A
        useful set of measures covers each of those steps rather than focusing only on the schedule.
      </p>

      <h2 id="third-next-available">Time to third next available appointment</h2>
      <p>
        This measure counts the days until the third open appointment of a given type. It is preferred over the first
        open slot because the first is often a one-off cancellation that does not reflect real availability. Track it
        separately for new and established patients and for key visit types, and record it on the same day each week
        so the trend is comparable.
      </p>
      <p>
        If the number keeps rising, demand is outpacing capacity somewhere. The usual culprits are templates that no
        longer match demand, too many slots reserved for visit types that go unused, or providers whose schedules are
        blocked for reasons nobody has revisited.
      </p>

      <h2 id="phone-access">Phone access</h2>
      <p>For many practices the phone is still the front door. Three measures tell you whether it works:</p>
      <ul>
        <li>
          <strong>Call abandonment rate:</strong> the share of callers who hang up before reaching someone.
        </li>
        <li>
          <strong>Average speed of answer:</strong> how long callers wait before a person picks up.
        </li>
        <li>
          <strong>Calls by hour:</strong> when demand peaks, so staffing can follow it.
        </li>
      </ul>
      <p>
        Most phone systems report these. Read them by hour of day; a respectable daily average can hide a Monday
        morning when half of callers give up.
      </p>

      <ArticleFigure image="in-metrics-2" caption="A short monthly review of a handful of access measures beats a long report nobody reads." />

      <h2 id="utilization">Schedule utilization and fill rate</h2>
      <p>
        <strong>Fill rate</strong> is the share of available appointment slots that were booked and used. Pair it with
        provider utilization, which compares time spent in visits with scheduled clinic time. A low fill rate alongside
        a long wait for appointments usually points to a template problem: the slots exist, but not of the type or at
        the times patients need.
      </p>

      <h2 id="no-shows">No-show and late cancellation rate</h2>
      <p>
        Track no-shows and late cancellations separately, and break both down by visit type and lead time. If either is
        high, our{" "}
        <Link href="/insights/reduce-patient-no-shows">playbook for reducing patient no-shows</Link> walks through the
        fixes in order.
      </p>

      <h2 id="referrals">Referral-to-appointment time</h2>
      <p>
        For specialty practices, the clock starts when a referral arrives, not when the patient calls. Measure the days
        from referral receipt to first scheduled appointment, and the share of referrals that never convert to a visit.
        Long gaps usually trace back to incomplete referral paperwork, unclear ownership of outreach, or insurance
        checks done one by one.
      </p>

      <h2 id="new-patients">New patient access</h2>
      <p>
        Look at the share of visits that are with new patients and the wait new patients face compared with established
        ones. A practice that is full of follow-ups can quietly close its doors to new patients without anyone deciding
        to.
      </p>

      <h2 id="digital">Digital access</h2>
      <p>
        If you offer online booking or a patient portal, track the share of appointments booked online and how quickly
        portal messages get a response. Online booking only reduces phone volume if the slots patients need are
        actually available online.
      </p>

      <h2 id="mistakes">Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Tracking everything at once.</strong> Twenty measures on a dashboard usually means none of them gets
          acted on. Start small and add measures only when the first ones are stable.
        </li>
        <li>
          <strong>Borrowing someone else&rsquo;s targets.</strong> Published benchmarks rarely match your specialty, patient
          mix and staffing. Set targets from your own baseline and improve from there.
        </li>
        <li>
          <strong>Reporting only averages.</strong> An average wait or answer time hides the worst days and hours, which
          are exactly what patients remember.
        </li>
        <li>
          <strong>Measuring without owners.</strong> A number with nobody responsible for it becomes a report, not a
          management tool.
        </li>
        <li>
          <strong>Changing definitions midstream.</strong> If the way a measure is calculated changes, note it and restart
          the trend, or month-to-month comparisons become meaningless.
        </li>
      </ul>
      <p>
        The aim is a short set of trusted numbers that leads to decisions. If a measure has not changed a decision in
        three months, consider replacing it with one that will.
      </p>

      <h2 id="scorecard">Build a one-page monthly scorecard</h2>
      <p>Pick six to eight measures, not twenty. For each one, write down:</p>
      <ol>
        <li>A plain-language definition everyone agrees on</li>
        <li>Where the number comes from and who pulls it</li>
        <li>A target based on your own baseline, not a borrowed benchmark</li>
        <li>The person who owns improving it</li>
      </ol>
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            <th>Typical source</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Third next available appointment</td>
            <td>Practice management system</td>
            <td>Weekly</td>
          </tr>
          <tr>
            <td>Call abandonment rate</td>
            <td>Phone system</td>
            <td>Weekly</td>
          </tr>
          <tr>
            <td>Fill rate</td>
            <td>Practice management system</td>
            <td>Monthly</td>
          </tr>
          <tr>
            <td>No-show and late cancellation rate</td>
            <td>Practice management system</td>
            <td>Monthly</td>
          </tr>
          <tr>
            <td>Referral-to-appointment days</td>
            <td>Referral log or EHR</td>
            <td>Monthly</td>
          </tr>
        </tbody>
      </table>

      <Callout title="Start small">
        If you have no measures today, start with third next available appointment and call abandonment rate. Together
        they show whether patients can reach you and whether you have room to see them.
      </Callout>

      <p>
        Review the scorecard monthly with the people who can change the numbers, and agree on one action per measure
        that is off track. If you would like help choosing the right measures and setting up the review, see our{" "}
        <Link href="/services/healthcare-operations-consulting">healthcare operations consulting</Link> services or{" "}
        <Link href="/book">book a video consultation</Link>.
      </p>
    </>
  );
}

export const patientAccessMetrics: Insight = {
  slug: "patient-access-metrics",
  shortTitle: "Patient access metrics",
  title: "Patient access metrics every practice should track",
  metaTitle: "Patient Access Metrics Every Practice Should Track",
  description:
    "The patient access metrics that show whether patients can reach you and get seen: third next available, call abandonment, fill rate, no-shows and referrals.",
  category: "Healthcare operations",
  serviceSlug: "healthcare-operations-consulting",
  image: "in-metrics",
  published: "2026-10-10",
  updated: "2026-10-10",
  readMinutes: 7,
  keyTakeaways: [
    "Measure every step of access: phone, schedule, referrals, registration and digital channels.",
    "Third next available appointment shows real availability better than the first open slot.",
    "Read phone measures by hour of day; daily averages hide the worst peaks.",
    "Keep the monthly scorecard to six to eight measures, each with an owner and a baseline target.",
  ],
  toc: [
    { id: "what-access-means", title: "What patient access really covers" },
    { id: "third-next-available", title: "Time to third next available appointment" },
    { id: "phone-access", title: "Phone access" },
    { id: "utilization", title: "Schedule utilization and fill rate" },
    { id: "no-shows", title: "No-show and late cancellation rate" },
    { id: "referrals", title: "Referral-to-appointment time" },
    { id: "new-patients", title: "New patient access" },
    { id: "digital", title: "Digital access" },
    { id: "mistakes", title: "Common mistakes to avoid" },
    { id: "scorecard", title: "Build a one-page monthly scorecard" },
  ],
  faqs: [
    {
      question: "What is third next available appointment?",
      answer:
        "It is the number of days until the third open appointment of a given type. It reflects real availability better than the first open slot, which is often a one-off cancellation.",
    },
    {
      question: "How often should a practice review access metrics?",
      answer:
        "Review fast-moving measures such as phone access and appointment availability weekly, and the full scorecard monthly with the people who can act on it.",
    },
    {
      question: "Which patient access metric should we start with?",
      answer:
        "Start with third next available appointment and call abandonment rate. Together they show whether patients can reach you and whether you have room to see them.",
    },
  ],
  tags: ["patient access", "practice KPIs", "scheduling", "call center"],
  Body,
};
