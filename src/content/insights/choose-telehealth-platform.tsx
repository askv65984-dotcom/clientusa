import Link from "next/link";
import { ArticleFigure, Callout } from "@/components/site/article-figure";
import type { Insight } from "./types";

function Body() {
  return (
    <>
      <p>
        Choosing a telehealth platform looks like a technology decision, but most of the regret we see afterwards is
        operational: the platform does not fit how the practice schedules, documents or follows up. A structured
        selection process takes a little longer up front and saves months of workarounds later. Here is the approach we
        use with clients.
      </p>

      <h2 id="care-model">Start with the care model, not the vendor list</h2>
      <p>
        Before looking at any product, write down which services you will deliver virtually, for which patients, by
        which clinicians, and how virtual visits fit alongside in-person care. A behavioral health practice running
        scheduled 50-minute sessions needs something very different from an urgent care service handling on-demand
        visits. The care model determines which requirements matter.
      </p>

      <h2 id="requirements">Write requirements in five groups</h2>
      <h3>Clinical workflow</h3>
      <ul>
        <li>Scheduled and on-demand visits, virtual waiting rooms and rooming by staff</li>
        <li>Adding a family member, interpreter or second clinician to a visit</li>
        <li>Screen sharing, and a fallback to audio when video fails</li>
      </ul>
      <h3>Patient experience</h3>
      <ul>
        <li>Joining from a phone browser without downloading an app</li>
        <li>Clear, accessible screens and support for patients&rsquo; preferred languages</li>
        <li>Simple pre-visit tech checks</li>
      </ul>
      <h3>Integration and data</h3>
      <ul>
        <li>Scheduling and documentation flow with your EHR and practice management system</li>
        <li>How visit details reach billing</li>
        <li>Access to your data, and how you get it back if you leave</li>
      </ul>
      <h3>Security, privacy and compliance</h3>
      <ul>
        <li>Willingness to sign a business associate agreement (BAA)</li>
        <li>Access controls, audit logs and encryption</li>
        <li>Recording policies, if recording is offered at all</li>
      </ul>
      <h3>Administration and support</h3>
      <ul>
        <li>User management, reporting and support hours that match your clinic hours</li>
        <li>Implementation help and training for staff</li>
      </ul>
      <p>
        Mark each requirement as must-have or nice-to-have. A short list of real must-haves is more useful than a long
        list where everything is critical.
      </p>

      <h2 id="shortlist">Shortlist three or four vendors</h2>
      <p>
        Include the telehealth module your EHR vendor offers, if there is one, alongside standalone platforms. Built-in
        modules often win on integration, while standalone platforms may offer a better patient experience. Seeing both
        side by side makes the tradeoff visible.
      </p>

      <ArticleFigure image="in-platform-2" caption="Scripted demos let everyone on the selection team compare vendors on the same scenarios." />

      <h2 id="demos">Run scripted demos</h2>
      <p>
        Do not let vendors run their standard presentation. Give each one the same three to five scenarios drawn from
        your care model, such as &ldquo;a new patient joins from a phone, the video fails and the clinician switches to
        audio, then sends a prescription and books a follow-up&rdquo;. Have clinicians, front-desk staff and billing
        watch the same scenarios and score them independently.
      </p>

      <h2 id="test">Test with real users</h2>
      <p>
        Before signing, ask for a sandbox or a short pilot. Include patients who are not comfortable with technology, as
        well as staff who will run the virtual front desk. Many problems only appear when someone joins from an older
        phone on a weak connection.
      </p>

      <h2 id="scorecard">Score consistently</h2>
      <p>A weighted scorecard keeps the decision anchored to your priorities rather than the best presentation:</p>
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Example weight</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Clinical workflow fit</td>
            <td>25%</td>
          </tr>
          <tr>
            <td>Patient experience</td>
            <td>20%</td>
          </tr>
          <tr>
            <td>Integration with EHR and billing</td>
            <td>20%</td>
          </tr>
          <tr>
            <td>Security and compliance</td>
            <td>15%</td>
          </tr>
          <tr>
            <td>Total cost of ownership</td>
            <td>10%</td>
          </tr>
          <tr>
            <td>Vendor support and stability</td>
            <td>10%</td>
          </tr>
        </tbody>
      </table>
      <p>Adjust the weights to your situation; the point is to agree on them before the demos, not after.</p>

      <h2 id="total-cost">Look past the license price</h2>
      <p>
        Compare total cost over several years: licenses or per-visit fees, implementation, integration work, interpreter
        services, training, support tiers and the staff time needed to run the platform. A cheaper license with weak
        integration can cost more in manual work than it saves.
      </p>

      <h2 id="contracts">Check the contract carefully</h2>
      <p>
        Review data ownership and export, service levels for uptime and support, price increases at renewal, the BAA
        and termination terms. Involve your attorney or compliance lead; we organize the operational questions, and
        your counsel advises on the legal ones.
      </p>

      <h2 id="mistakes">Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Letting vendors run the demo.</strong> A polished standard presentation shows the product at its best,
          not how it handles your scenarios.
        </li>
        <li>
          <strong>Leaving out the front desk and billing.</strong> Clinicians are not the only users. Schedulers, medical
          assistants and billing staff live with the platform every day.
        </li>
        <li>
          <strong>Choosing only for today.</strong> Think about where the program will be in two or three years: more
          services, more clinicians, perhaps more states.
        </li>
        <li>
          <strong>Underestimating training.</strong> Budget time for staff training and patient instructions, not just
          the technical setup.
        </li>
        <li>
          <strong>Forgetting the exit.</strong> Know how you would get your data and records out if you ever switched
          platforms.
        </li>
      </ul>

      <Callout title="Before you sign">
        Ask each finalist for two references from organizations similar to yours, and ask those references what they
        would do differently if they chose again.
      </Callout>

      <p>
        Choosing the platform is only the start. Our guide to{" "}
        <Link href="/insights/telehealth-workflow-design">telehealth workflow design</Link> covers what comes next, and
        our <Link href="/services/telehealth-consulting">telehealth consulting</Link> team can run the selection process
        with you. If you are early in planning, a <Link href="/book">video consultation</Link> is a good first step.
      </p>
    </>
  );
}

export const chooseTelehealthPlatform: Insight = {
  slug: "choose-telehealth-platform",
  shortTitle: "Choosing a telehealth platform",
  title: "How to choose a telehealth platform: requirements, demos and a scorecard",
  metaTitle: "How to Choose a Telehealth Platform: Buyer's Checklist",
  description:
    "A practical guide to choosing a telehealth platform: define requirements, check EHR integration and privacy, run scripted demos and score vendors consistently.",
  category: "Telehealth",
  serviceSlug: "telehealth-consulting",
  image: "in-platform",
  published: "2026-10-10",
  updated: "2026-10-10",
  readMinutes: 8,
  keyTakeaways: [
    "Define your virtual care model before looking at vendors.",
    "Group requirements into workflow, patient experience, integration, security and support.",
    "Compare your EHR's built-in module with standalone platforms side by side.",
    "Use scripted demos and a weighted scorecard agreed in advance.",
    "Compare total cost of ownership and review the contract with counsel.",
  ],
  toc: [
    { id: "care-model", title: "Start with the care model, not the vendor list" },
    { id: "requirements", title: "Write requirements in five groups" },
    { id: "shortlist", title: "Shortlist three or four vendors" },
    { id: "demos", title: "Run scripted demos" },
    { id: "test", title: "Test with real users" },
    { id: "scorecard", title: "Score consistently" },
    { id: "total-cost", title: "Look past the license price" },
    { id: "contracts", title: "Check the contract carefully" },
    { id: "mistakes", title: "Common mistakes to avoid" },
  ],
  faqs: [
    {
      question: "Do we need a telehealth platform that integrates with our EHR?",
      answer:
        "Integration usually saves significant staff time on scheduling, documentation and billing. Weigh it against patient experience, and compare your EHR's built-in module with standalone options.",
    },
    {
      question: "Should a telehealth vendor sign a business associate agreement?",
      answer:
        "If the platform will create, receive, store or transmit protected health information on your behalf, a business associate agreement is expected. Confirm the specifics with your compliance lead or attorney.",
    },
    {
      question: "How long does it take to choose a telehealth platform?",
      answer:
        "It depends on the number of services, integrations and decision makers involved. A focused process with clear requirements and scripted demos keeps it from dragging on.",
    },
  ],
  tags: ["telehealth platform", "vendor selection", "EHR integration", "virtual care"],
  Body,
};
