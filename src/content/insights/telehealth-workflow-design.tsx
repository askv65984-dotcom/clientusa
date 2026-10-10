import Link from "next/link";
import { ArticleFigure, Callout } from "@/components/site/article-figure";
import type { Insight } from "./types";

function Body() {
  return (
    <>
      <p>
        Many telehealth programs were launched in a hurry: a video link added to the existing schedule, with everything
        else left as it was. The visits happen, but staff improvise around gaps, patients struggle to connect and
        follow-up falls through the cracks. Designing the workflow end to end fixes most of that. Here is how to think
        about each stage.
      </p>

      <h2 id="map">Map the virtual visit end to end</h2>
      <p>
        Walk through a single virtual visit from the moment it is booked to the moment follow-up is complete, and write
        down who does what at each step. Do it with the people involved: schedulers, medical assistants, clinicians,
        billing staff and, if possible, a few patients. The gaps usually show up as steps nobody owns.
      </p>

      <h2 id="scheduling">Scheduling: decide which visits can be virtual</h2>
      <p>
        Create clear rules for which visit types are suitable for video, audio-only or in person, and build them into
        scheduling so staff do not have to judge each case. Offer the virtual option when the appointment is booked,
        and capture the patient&rsquo;s preferred contact number in case video fails.
      </p>

      <h2 id="pre-visit">Before the visit: intake, consent and readiness</h2>
      <ul>
        <li>Send intake forms and any consent documents electronically ahead of time.</li>
        <li>Verify insurance as you would for an in-person visit.</li>
        <li>Send the join link with simple instructions and an optional tech check.</li>
        <li>
          Plan to confirm the patient&rsquo;s physical location at the start of each visit, because licensure and some
          other rules depend on where the patient is.
        </li>
      </ul>
      <p>
        Requirements for consent and documentation vary by state and payer, so agree on your approach with your
        compliance lead or attorney.
      </p>

      <ArticleFigure image="in-teleflow-2" caption="Virtual rooming by a medical assistant keeps the clinician's time focused on care." />

      <h2 id="rooming">Virtual rooming</h2>
      <p>
        In a clinic, a medical assistant rooms the patient before the clinician arrives. Virtual visits benefit from the
        same step: a staff member joins a few minutes early, checks audio and video, confirms location, updates
        medications and history, and helps patients who are struggling with the technology. Clinicians then start on
        time with a ready patient.
      </p>

      <h2 id="visit">The visit itself</h2>
      <p>
        Agree on simple standards: a clean background, good lighting, looking at the camera, and narrating what you are
        doing when you look away to document. Decide in advance how clinicians escalate a visit to in-person care and
        how that appointment gets booked, so it does not depend on the patient calling back.
      </p>

      <h2 id="documentation">Documentation and billing</h2>
      <p>
        Visit notes should record the modality (video or audio), the patient&rsquo;s location, who was present and any
        consent obtained. Work with your billing team on coding and payer-specific requirements before launch, since
        these differ between payers and change over time.
      </p>

      <h2 id="prescriptions">Prescriptions, orders and referrals</h2>
      <p>
        Confirm the patient&rsquo;s preferred pharmacy during intake so e-prescriptions go to the right place. Prescribing
        controlled substances by telehealth has its own federal and state requirements that have changed in recent
        years; check the current rules with counsel before building them into your workflow. For lab orders and
        imaging, make sure the patient knows where to go and how results will be shared.
      </p>

      <h2 id="follow-up">Follow-up and continuity</h2>
      <p>
        Book the next step before the visit ends: a follow-up appointment, a lab visit or a referral. Send an after-visit
        summary through the patient portal, and make it clear how patients can reach the care team with questions.
      </p>

      <Callout title="Plan for failure">
        Decide in advance what happens when video fails: who calls the patient, whether the visit continues by phone,
        and how that is documented. A written fallback turns a frustrating moment into a routine one.
      </Callout>

      <h2 id="mistakes">Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Treating telehealth as just a video link.</strong> Without changes to scheduling, rooming and follow-up,
          staff fill the gaps with workarounds.
        </li>
        <li>
          <strong>Nobody owning the virtual front desk.</strong> Someone needs to watch the virtual waiting room, help
          patients who cannot connect and keep clinicians on time.
        </li>
        <li>
          <strong>Copying in-person templates unchanged.</strong> Virtual visits often need a short buffer for
          connection problems, especially early on.
        </li>
        <li>
          <strong>Skipping the location check.</strong> Confirming where the patient is at the start of each visit takes
          seconds and avoids problems later.
        </li>
        <li>
          <strong>Not telling patients what to expect.</strong> Clear instructions on how to join, what to have ready and
          what happens if video fails reduce late starts and no-shows.
        </li>
      </ul>

      <h2 id="measure">Measure and refine</h2>
      <p>
        Track virtual no-show rates, visits that start late, connection failures, visit length and patient feedback.
        Review them monthly in the first few months, and adjust the workflow based on what you learn. Many of the same
        measures appear in our guide to{" "}
        <Link href="/insights/patient-access-metrics">patient access metrics</Link>.
      </p>
      <p>
        If your program still runs on workarounds, our{" "}
        <Link href="/services/telehealth-consulting">telehealth consulting</Link> work can redesign it with your team.
        Still choosing a platform? Start with our{" "}
        <Link href="/insights/choose-telehealth-platform">telehealth platform buyer&rsquo;s checklist</Link>.
      </p>
    </>
  );
}

export const telehealthWorkflowDesign: Insight = {
  slug: "telehealth-workflow-design",
  shortTitle: "Telehealth workflow design",
  title: "Designing telehealth workflows that hold up after launch",
  metaTitle: "Telehealth Workflow Design: From Scheduling to Follow-Up",
  description:
    "How to design telehealth workflows end to end: scheduling rules, intake and consent, virtual rooming, documentation, prescriptions and follow-up care.",
  category: "Telehealth",
  serviceSlug: "telehealth-consulting",
  image: "in-teleflow",
  published: "2026-10-10",
  updated: "2026-10-10",
  readMinutes: 7,
  keyTakeaways: [
    "Map one virtual visit end to end with everyone involved, and give every step an owner.",
    "Build rules for which visit types can be virtual into scheduling.",
    "Virtual rooming by staff lets clinicians start on time with a ready patient.",
    "Document modality, patient location and consent, and agree billing rules before launch.",
    "Write down what happens when video fails.",
  ],
  toc: [
    { id: "map", title: "Map the virtual visit end to end" },
    { id: "scheduling", title: "Scheduling: decide which visits can be virtual" },
    { id: "pre-visit", title: "Before the visit: intake, consent and readiness" },
    { id: "rooming", title: "Virtual rooming" },
    { id: "visit", title: "The visit itself" },
    { id: "documentation", title: "Documentation and billing" },
    { id: "prescriptions", title: "Prescriptions, orders and referrals" },
    { id: "follow-up", title: "Follow-up and continuity" },
    { id: "mistakes", title: "Common mistakes to avoid" },
    { id: "measure", title: "Measure and refine" },
  ],
  faqs: [
    {
      question: "Which visits work well as telehealth?",
      answer:
        "Visits that rely mainly on conversation, such as many follow-ups, medication reviews and behavioral health sessions, often work well. Build clear rules with your clinicians rather than deciding case by case.",
    },
    {
      question: "Do we need separate consent for telehealth visits?",
      answer:
        "Many states and payers have consent or documentation requirements for telehealth. Agree on your approach with your compliance lead or attorney.",
    },
    {
      question: "What should we do when a video visit fails?",
      answer:
        "Have a written fallback: who calls the patient, whether the visit continues by phone, and how the change is documented.",
    },
  ],
  tags: ["telehealth workflow", "virtual visits", "virtual rooming", "telemedicine"],
  Body,
};
