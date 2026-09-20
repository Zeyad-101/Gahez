# Gahez — Unified Interview Reference Guide

> **Purpose:** This file is the AI's ground truth for two tasks:  
> 1. **Question selection** — what to ask, in what order, at what depth.  
> 2. **Answer evaluation** — how to score a response realistically, per category.  
>
> All scoring logic in `js/ai.js` (`evaluateAnswer`, `mockEvaluation`) must align with the rubrics and behavioral anchors defined here.

---

## Part 1 — Interview Structure & Approach

### 1.1 Recommended Interview Flow (all roles)

| Segment | Duration | Purpose |
|---|---|---|
| Warm-up / Introduction | 2 min | Put the candidate at ease; confirm background in 2 sentences |
| Background & Experience | 5 min | Walk me through your background — relevance, trajectory |
| Motivation | 3 min | Why this role? Why now? What value do you bring? |
| Technical / Role Questions | 10 min | Knowledge depth; at least one situational/case question |
| Behavioral Questions | 5 min | STAR-based; one past failure + one collaboration story minimum |
| Candidate Questions & Close | 2 min | Strategic questions signal high engagement |

> **Egypt / MNC context:** Egyptian MNC interviewers (Smart Village, New Cairo hubs) appreciate both warmth and directness. Open with small talk (1–2 exchanges), then pivot crisply. Over-casualness signals poor professional boundaries; over-formality signals low EQ. Balance both.

---

### 1.2 The STAR Framework (required for behavioral questions)

Every behavioral answer should map to:

| Component | Weight | What to check |
|---|---|---|
| **S – Situation** | 10–15 % | Enough context to understand the stakes |
| **T – Task** | 10–15 % | Clear personal responsibility identified |
| **A – Action** | 55–65 % | "I" statements; specific steps; decision logic |
| **R – Result** | 20–25 % | Concrete outcome; ideally quantified |

**Red flags:**
- Uses "we" throughout — cannot isolate personal contribution
- No result mentioned — answer trails off
- Hypothetical scenario given instead of a real example
- Result is vague ("it went well", "everyone was happy")

**Green flags:**
- Numbers, percentages, time savings, or comparable benchmarks in Result
- Mentions what they *learned* or would *do differently*
- Response runs 60–90 seconds — concise but complete

---

### 1.3 Culturally-Aware Interviewing (Egypt & Regional Context)

**Egyptian market (local companies):**
- Relationship-first culture: brief rapport-building is normal and expected
- Hierarchy awareness: candidates who demonstrate respect for seniority score higher on "professionalism"
- Communication style is often indirect — probe gently when answers are evasive
- "I'm a hard worker / team player" is a cliché — always ask for a specific example

**Egyptian MNC environment (multinationals in Egypt):**
- English proficiency is a near-mandatory filter; code-switching is common
- Candidates are expected to research the company; "I just saw the ad" is a red flag
- Expect STAR-based answers; candidates unfamiliar with STAR need coaching prompts
- Salary anchoring: global roles should not be pegged solely to local market

**International / Remote context:**
- Quantified impact matters more than titles
- Time zone awareness and async communication skills are assessed
- "What does success look like in 90 days?" is the candidate's best closing question

---

## Part 2 — Question Bank (20 Departments + Behavioral)

### 2.1 General / Universal Questions

#### Personal & Background
1. Tell me about yourself.
2. Walk me through your background.
3. What made you choose this field?
4. What interests you most about this field?
5. What is the most valuable experience you have gained so far?
6. What is your biggest achievement?
7. Tell me about a challenge you faced and how you handled it.
8. What are your main strengths?
9. What is one weakness you are currently working on?
10. How do you handle pressure?
11. How do you respond to feedback?
12. Tell me about a disagreement you had with a team member.
13. Do you prefer working individually or as part of a team? Why?
14. How do you organize your time when you have multiple tasks?
15. What motivates you at work?

#### Motivation & Fit
1. Why did you choose our company?
2. Why are you interested in this position?
3. What are your expectations from this role?
4. Where do you see yourself in 3–5 years?
5. Why should we choose you?
6. What value can you add to the team?

---

### 2.2 Human Resources (HR)

**Technical:**
1. What is the difference between HR and Personnel?
2. What are the main HR functions?
3. What is the role of HR in a business?
4. What is the difference between Recruitment and Talent Acquisition?
5. What is the difference between a Job Description and a Job Specification?
6. How can HR contribute to business success?
7. What are some important HR KPIs? *(time to hire, cost per hire, turnover, retention, absenteeism, engagement)*

**Talent Acquisition / Recruitment:**
1. Walk me through the recruitment process.
2. How would you conduct a job analysis?
3. How would you write a job description?
4. How would you source candidates?
5. What is the difference between internal and external recruitment?
6. How do you screen CVs?
7. What do you look for when reviewing a CV?
8. How would you conduct a structured interview?
9. How do you evaluate candidates fairly?
10. What is the difference between behavioral and technical interviews?
11. What is employer branding?
12. How would you attract candidates if the company is not well known?
13. What recruitment KPIs do you know?

**Situational:**
1. You have 100 CVs for one position and very limited time. How would you prioritize?
2. The hiring manager wants a candidate with unrealistic requirements. How would you handle this?
3. A highly qualified candidate expects a salary above the approved budget. What would you do?

---

### 2.3 Finance

**Technical:**
1. What is the difference between revenue and profit?
2. What is the difference between gross profit and net profit?
3. What are the three main financial statements?
4. Explain the Income Statement.
5. Explain the Balance Sheet.
6. What are assets, liabilities, and equity?
7. What is the difference between current and non-current assets?
8. What is the difference between cash flow and profit?
9. What is a budget?
10. What is financial forecasting?
11. What is the difference between fixed and variable costs?
12. What is the break-even point?
13. How would you analyze a company's financial performance?
14. What financial ratios do you know? *(current ratio, quick ratio, gross/net margin, ROA, ROE, D/E ratio)*
15. What is the difference between Accounts Payable and Accounts Receivable?

**Situational:**
1. A company is profitable but does not have enough cash. What could be the reasons?
2. Expenses suddenly increased. How would you investigate the problem?

---

### 2.4 Accounting

**Technical:**
1. What is the difference between Accounting and Finance?
2. Explain debit and credit.
3. What is the accounting cycle?
4. What is the difference between accrued and prepaid expenses?
5. What is the difference between depreciation and amortization?
6. What is bank reconciliation?
7. What is a trial balance?
8. What is the difference between capital and revenue expenditure?
9. What is the difference between cash basis and accrual basis?
10. What accounting standards are you familiar with? *(IFRS, local GAAP)*
11. Why are internal controls important?

**Situational:**
1. You discover that a transaction was recorded incorrectly two months ago. What would you do?

---

### 2.5 Marketing

**General:**
1. What is marketing from your perspective?
2. What is the difference between Marketing and Sales?
3. Explain the Marketing Mix. What are the 4Ps?
4. What is a target audience?
5. How would you conduct market research?
6. How would you create a customer persona?
7. What is the difference between B2B and B2C?
8. What is brand positioning?
9. What is the difference between brand awareness and conversion?

**Digital Marketing:**
1. What is the difference between organic and paid marketing?
2. What is SEO? What is SEM?
3. What is social media marketing?
4. What are important digital marketing KPIs? *(reach, CTR, CPC, CPM, conversion rate, CPA, ROAS)*
5. How would you measure the success of a campaign?
6. What is the difference between reach and engagement?

**Situational:**
1. A campaign spent a large amount of money but generated few conversions. How would you analyze the problem?

---

### 2.6 Sales

**Technical:**
1. What is the difference between Sales and Marketing?
2. Walk me through the sales process.
3. How would you generate leads?
4. How would you approach a prospect who is not interested?
5. What is the difference between a lead, a prospect, and a customer?
6. What is a sales funnel?
7. What are the most important sales KPIs? *(revenue, conversion rate, win rate, pipeline value, average deal size)*
8. How do you handle customer objections?
9. How do you close a deal?
10. What is the most important skill for a salesperson?

**Situational:**
1. A customer says, "Your price is too high." How would you respond?
2. You are near the end of the month and have achieved only 50% of your target. What would you do?

---

### 2.7 Operations

**Technical:**
1. What is Operations?
2. What is the role of Operations in a business?
3. How would you improve a business process?
4. What is the difference between efficiency and effectiveness?
5. What KPIs are relevant to Operations? *(cycle time, productivity, cost per unit, on-time delivery, error rate)*
6. How would you identify the root cause of a process problem?
7. What is process mapping?
8. What is continuous improvement?
9. How can you reduce costs without affecting quality?
10. How would you handle an unexpected operational problem?

**Situational:**
1. Service delivery or production is delayed. How would you handle the situation?

---

### 2.8 Business Development (BD)

**Technical:**
1. What is Business Development?
2. What is the difference between Business Development and Sales?
3. How would you identify a new business opportunity?
4. How would you conduct market analysis?
5. How would you identify potential partners?
6. How would you approach a potential partnership?
7. What is a value proposition?
8. How would you evaluate whether an opportunity is suitable for the company?
9. What are important BD KPIs? *(qualified opportunities, pipeline, revenue, new markets, partner performance, ROI)*
10. How would you enter a new market?

**Situational:**
1. Another company proposes a partnership. What factors would you evaluate before accepting?

---

### 2.9 Procurement / Purchasing

**Technical:**
1. What is the difference between Procurement and Purchasing?
2. Walk me through the procurement cycle.
3. How would you select a supplier?
4. What are the main criteria for evaluating suppliers?
5. How would you negotiate with a supplier?
6. What is the difference between an RFQ and an RFP?
7. What is supplier evaluation?
8. How would you ensure quality while controlling costs?
9. How would you handle a supplier who is consistently late?
10. What are important procurement KPIs? *(cost savings, supplier on-time delivery, quality defects, cycle time)*

**Situational:**
1. One supplier offers the lowest price but lower quality than the others. How would you make the decision?

---

### 2.10 Supply Chain / Logistics

**Technical:**
1. What is Supply Chain Management?
2. What is the difference between Supply Chain and Logistics?
3. Explain the supply chain cycle.
4. What is inventory management?
5. What is safety stock?
6. What is lead time?
7. What can cause a stockout?
8. How would you reduce inventory costs?
9. What are important supply chain KPIs? *(inventory turnover, stockout rate, forecast accuracy, on-time delivery)*
10. How would you handle a shipment delay?

**Situational:**
1. A customer urgently needs an order, but inventory is insufficient. What would you do?

---

### 2.11 Business Analysis

**Technical:**
1. What is a Business Analyst?
2. What is the role of a Business Analyst in a company?
3. How would you identify business requirements?
4. What is the difference between business and functional requirements?
5. Who are stakeholders?
6. How would you gather requirements?
7. What is process mapping?
8. What is SWOT analysis?
9. What is a KPI?
10. How can data support business decision-making?

**Situational:**
1. Management knows there is a problem but cannot identify its root cause. Where would you start?

---

### 2.12 Data Analysis

**Technical:**
1. What is the difference between data and information?
2. What Excel functions can you use?
3. Can you work with Pivot Tables?
4. What are VLOOKUP and XLOOKUP used for?
5. What is data cleaning?
6. What is data visualization?
7. What is the difference between average and median?
8. What is a KPI?
9. How do you validate data accuracy?
10. How do you turn data into business insights?

**Situational:**
1. You receive a dataset containing missing values and duplicates. What would you do before starting the analysis?

---

### 2.13 IT / Technology

**Technical & Behavioral:**
1. What is your technical specialization?
2. What technical projects have you worked on?
3. What tools and technologies do you use?
4. How do you learn a new technology?
5. Tell me about a technical problem you solved.
6. How do you troubleshoot technical issues?
7. How do you deal with security risks?
8. How do you document your technical work?
9. How do you handle technical deadlines?
10. How would you explain a technical problem to a non-technical person?

---

### 2.14 Customer Service

**Technical & Behavioral:**
1. What is Customer Service?
2. What are the most important qualities of a customer service representative?
3. How would you deal with an angry customer?
4. How would you help a customer who does not understand the service?
5. What is the difference between Customer Satisfaction and Customer Experience?
6. What are important customer service KPIs? *(CSAT, first response time, FCR, resolution time)*
7. How do you handle multiple customers at the same time?

**Situational:**
1. A customer is angry and demands a refund, but company policy does not allow refunds. How would you handle the situation?

---

### 2.15 Product Management

**Technical:**
1. What is Product Management?
2. What is the difference between Product Management and Project Management?
3. How would you identify customer needs?
4. How would you conduct product research?
5. What is a product roadmap?
6. What is an MVP?
7. How would you prioritize product features?
8. What are important product KPIs? *(activation, adoption, retention, conversion, churn, NPS)*
9. How would you decide whether a feature should be developed?

**Situational:**
1. You have 10 proposed features, but resources are available for only 3. How would you prioritize them?

---

### 2.16 Project Management

**Technical & Behavioral:**
1. What is Project Management?
2. What are the stages of the project life cycle?
3. How would you create a project plan?
4. How would you define project scope?
5. How would you manage deadlines?
6. How would you manage project risks?
7. What is stakeholder management?
8. What are important project KPIs? *(schedule variance, cost variance, scope changes, milestone completion)*
9. How would you deal with a team member who is not meeting commitments?

---

### 2.17 Legal

1. What is your legal specialization?
2. What experience do you have with contracts?
3. How would you review a contract?
4. What risks would you look for in a contract?
5. How would you monitor legal compliance?
6. What would you do if a contract contains an unclear clause?
7. How do you stay updated with changes in laws and regulations?

---

### 2.18 Administration / Office Management

1. What is the role of Administration in a company?
2. How do you organize and manage documents?
3. How do you manage appointments and schedules?
4. How do you handle confidential documents?
5. How do you support management in organizing their time?
6. How do you prioritize multiple administrative tasks?
7. How would you handle an unexpected administrative problem?

---

### 2.19 Public Relations (PR)

1. What is Public Relations?
2. What is the difference between PR and Marketing?
3. How would you build relationships with media?
4. How would you organize a corporate event?
5. How would you handle negative publicity?
6. What are the main PR channels?
7. How would you measure the success of a PR campaign?

**Situational:**
1. A negative comment about the company goes viral on social media. How would you respond?

---

### 2.20 Design / Creative

1. What design tools do you use?
2. Walk me through your design process.
3. How do you understand a creative brief?
4. How do you handle feedback?
5. How do you balance creativity with business requirements?
6. Tell me about a design challenge you faced.
7. How do you evaluate whether a design is successful?

**Situational:**
1. A client rejects a design after you have spent significant time working on it. How would you handle the situation?

---

### 2.21 Behavioral Questions — Universal (All Roles)

These apply regardless of department. Always request a specific real example.

1. Tell me about a time when you failed and what you learned from it.
2. Tell me about a time when you worked under pressure.
3. Tell me about a difficult problem you solved.
4. Tell me about a conflict you had with a colleague and how you handled it.
5. Tell me about a time when you took initiative.
6. Tell me about a mistake you made and how you handled it.
7. Tell me about a time when you had to do something for the first time.
8. Tell me about a time when you received negative feedback.
9. Tell me about a time when you had to make a quick decision.
10. Tell me about a time when you worked with a difficult person.
11. Tell me about an achievement you are proud of.
12. Tell me about a time when you did not achieve the result you expected.

---

## Part 3 — Model Answer Framework (per department)

### How to use model answers
Model answers below are **baselines, not scripts**. A strong candidate adapts them to their actual experience. The AI should use these as the *expected answer content* when scoring. Answers that hit the core concepts score at least 60/100; answers that also include specifics, examples, and quantified results should score 85–100.

### Key model answer concepts per role

**HR:**
- Personnel = admin (payroll, records, attendance) vs. HR = strategic (talent, engagement, org design)
- Recruitment process: workforce need → JD → sourcing → screening → interviews → selection → offer → onboarding
- Screening: must-haves first, eliminate irrelevant factors, compare like-for-like
- Employer branding: how the org presents itself as an employer; EVP (Employee Value Proposition)

**Finance:**
- Revenue vs. profit: revenue = total income before costs; profit = what remains after costs
- Three statements: Income Statement (P&L), Balance Sheet (snapshot), Cash Flow Statement
- Cash vs. profit: a company can be profitable but cash-poor (e.g., slow receivables, high capex)
- Break-even: fixed costs ÷ (price per unit − variable cost per unit)

**Accounting:**
- Debit/credit: assets and expenses increase on debit; liabilities, equity, revenue increase on credit
- Accounting cycle: journal entries → ledger → trial balance → adjustments → statements → closing
- Internal controls: protect assets, ensure data accuracy, reduce fraud and error

**Marketing:**
- 4Ps: Product, Price, Place, Promotion
- B2B vs. B2C: longer buying cycle + multiple decision-makers (B2B) vs. shorter + emotional (B2C)
- Campaign failure diagnosis: targeting → creative → offer → landing page → funnel drop-offs → tracking

**Sales:**
- Sales process: prospect → qualify → discover → present → handle objections → negotiate → close → follow-up
- Price objection: don't discount immediately — unpack what they're comparing to and communicate total value
- 50% target with 2 weeks left: triage pipeline by probability, prioritize hot leads, increase outreach intensity

**Operations:**
- Efficiency (min waste) vs. effectiveness (hitting the goal) — both matter; prioritize effectiveness first
- Root cause: define → map → 5 Whys or fishbone → validate → solve
- Cost reduction without quality loss: eliminate waste, automate, target real cost drivers (not arbitrary cuts)

**Business Analysis:**
- Business requirements = what the org needs; functional requirements = what the solution must do
- Requirements gathering: interviews, workshops, observation, document analysis, process mapping
- SWOT: Strengths, Weaknesses (internal) / Opportunities, Threats (external)

**Data Analysis:**
- Data vs. information: raw facts vs. interpreted, meaningful output
- Data cleaning: remove duplicates, handle missing values, standardize formats, fix inconsistencies
- Turning data into insights: define question → clean → analyze → find patterns → recommend action

**Customer Service:**
- Angry customer: listen → acknowledge → clarify → solve → follow up (never argue, never blame policy first)
- CSAT vs. CX: satisfaction = rating of a specific interaction; experience = entire journey across touchpoints

---

## Part 4 — Realistic Scoring Rubric

### 4.1 Five Scoring Dimensions (0–100 each)

These map to the five categories in `ai.js`: `relevance`, `clarity`, `structure`, `specificity`, `confidence`.

---

#### Dimension 1 — Relevance (Does the answer address the actual question?)

| Score | Label | Behavioral Anchor |
|---|---|---|
| 85–100 | Strong | Directly and completely addresses the question. Every sentence serves the answer. |
| 65–84 | Good | Addresses the question with minor tangents or a small gap in coverage. |
| 45–64 | Partial | Partially addresses the question or answers a related but different question. |
| 25–44 | Weak | The answer exists but largely misses the point of the question. |
| 0–24 | Off-track | Does not address the question; vague or unrelated response. |

> **AI heuristic:** Does the candidate use the key term(s) from the question? Does the response stay on-topic? Does it ignore a core requirement (e.g., asks about "root cause" but candidate just describes symptoms)?

---

#### Dimension 2 — Clarity (Is the answer easy to follow?)

| Score | Label | Behavioral Anchor |
|---|---|---|
| 85–100 | Strong | Simple, jargon-free language; logical flow from start to finish; easy to follow. |
| 65–84 | Good | Mostly clear, minor ambiguity, one or two unclear transitions. |
| 45–64 | Partial | Some clear parts but confusing or disorganized overall; reader has to work to follow it. |
| 25–44 | Weak | Hard to follow; contradictory or rambling. |
| 0–24 | Poor | Incomprehensible or single-word response. |

> **AI heuristic:** Check sentence structure, transition words, and logical ordering of ideas. Does the response have a beginning, middle, and end?

---

#### Dimension 3 — Structure (Is the answer well-organized?)

For behavioral questions: maps to STAR completeness.  
For technical questions: maps to logical sequencing of concepts.

| Score | Label | STAR (behavioral) | Logical flow (technical) |
|---|---|---|---|
| 85–100 | Strong | All four STAR components present; time allocation balanced; clear personal ownership | Concepts presented in logical order; complete; nothing important omitted |
| 65–84 | Good | 3 of 4 STAR components clearly present | Mostly logical; one gap or wrong order |
| 45–64 | Partial | Only Situation+Action or only Action+Result | Key concept mentioned but not sequenced clearly |
| 25–44 | Weak | Only describes situation or task; no action/result | Fragmented or reversed order |
| 0–24 | Poor | No structure at all; stream of consciousness | No apparent organization |

> **AI heuristic for behavioral:** Count STAR signals. Look for "I" statements (Action), a time-anchored setup (Situation), a clear goal (Task), and an outcome word (Result: "resulted in", "outcome was", "we achieved", "I improved").

---

#### Dimension 4 — Specificity (Is the answer concrete and evidence-based?)

This is the most discriminating dimension. Generic answers consistently score ≤ 45 here.

| Score | Label | Behavioral Anchor |
|---|---|---|
| 85–100 | Strong | Specific numbers, names, timeframes, or measurable outcomes; isolates personal contribution clearly |
| 65–84 | Good | Concrete example given; one specific detail (even if no number); personal role clear |
| 45–64 | Partial | Some specificity but missing key concrete details; role blurry or outcome vague |
| 25–44 | Weak | Mostly generalizations ("I always", "we usually"); no concrete example |
| 0–24 | Poor | Pure abstraction; buzzword-only response ("I'm a team player", "I'm a hard worker") |

> **Red flag words that drop Specificity to ≤ 44:** "always", "usually", "generally", "I tend to", "typically I", "we normally", "everyone", "in general"  
> **Green flag words that push Specificity to ≥ 65:** numbers (%, EGP, days, users), named tools, named roles, named outcomes, specific team sizes, dates, "specifically", "in that case", "for example"

---

#### Dimension 5 — Confidence (Does the candidate own their answer?)

Confidence is NOT about assertiveness — it is about intellectual ownership and self-awareness.

| Score | Label | Behavioral Anchor |
|---|---|---|
| 85–100 | Strong | Owns their opinion; admits uncertainty where real but does not crumble; handles gaps professionally ("I don't know X, but I'd approach it by...") |
| 65–84 | Good | Mostly owns the answer; one unnecessary hedging phrase |
| 45–64 | Partial | Excessive hedging ("I think maybe", "I'm not sure but"); defers most judgment |
| 25–44 | Weak | Answers as if seeking approval; changes position without reason when probed |
| 0–24 | Poor | Refuses to answer; says "I don't know" with no follow-through; gives up immediately |

> **Confidence ≠ correct:** A confident wrong answer about a nuanced topic scores higher than a crumbling correct answer. We are testing professional presence, not just factual recall.

---

### 4.2 Overall Score Calculation

```
overall = (relevance × 0.25) + (clarity × 0.20) + (structure × 0.20) + (specificity × 0.25) + (confidence × 0.10)
```

**Weights rationale:**
- Relevance (25%) and Specificity (25%): the two biggest discriminators between weak and strong candidates
- Clarity (20%) and Structure (20%): baseline quality; poor communication makes even correct knowledge invisible
- Confidence (10%): important but not overweighted — a great answer with slight hedging should still score well

---

### 4.3 Score Interpretation Table

| Overall Score | Label | Interviewer Decision Guidance |
|---|---|---|
| 90–100 | Exceptional | Offer immediately; benchmark for role calibration |
| 75–89 | Strong | Proceed to next round; likely a hire |
| 60–74 | Solid | Worth a second look; probe weakest dimension before deciding |
| 45–59 | Below expectations | Significant gaps; consider only if no stronger candidates |
| 30–44 | Weak | Do not advance; lacks the baseline for the role |
| 0–29 | Not qualified | Clear disqualification; end interview early if appropriate |

---

### 4.4 Dimension-Specific Feedback Templates

The AI must provide feedback that maps to the lowest-scoring dimension.

**When Relevance < 60:**
> "Your answer showed some interesting ideas, but it didn't fully address what was asked. The question focused on [X] — try re-reading the question before answering to ensure your response stays on target."

**When Clarity < 60:**
> "Your answer had the right instincts, but it was difficult to follow at times. Try organizing your thoughts into 2–3 clear points before speaking. A simple 'First... Second... Finally...' structure helps enormously."

**When Structure < 60 (behavioral):**
> "I could tell you had a relevant experience in mind, but the STAR structure was incomplete. Make sure to: (1) briefly set the scene, (2) state your specific role, (3) describe exactly what *you* did, and (4) share the outcome."

**When Specificity < 60:**
> "Your answer was too general to give a clear picture of your actual experience. Try replacing phrases like 'I usually' or 'we typically' with a concrete example: a specific situation, a specific action, and a specific result — ideally with numbers."

**When Confidence < 60:**
> "You have good knowledge here, but try to own your answer a bit more. It's fine not to know something — say 'I'd approach it by...' rather than trailing off. Interviewers respect honest self-awareness paired with a constructive attitude."

---

## Part 5 — HR Assessment Framework (Engineering Candidates)

*Source: HR_Interview_Guidelines_Engineering_Candidates.md — preserved and enriched*

### 5.1 Assessment Priority Order (for HR interviewers)

1. **Personality & Communication** — confidence, active listening, professionalism, feedback orientation
2. **Problem-Solving** — structured thinking, root-cause analysis, decision-making under pressure, resourcefulness
3. **Teamwork & Collaboration** — working across differences, professional disagreement, ownership of responsibilities
4. **Responsibility & Commitment** — accountability, reliability, ownership of mistakes, consistency
5. **Learning Agility** — self-directed learning, curiosity, speed of adaptation to new situations
6. **Technical Interest** *(HR only, not deep eval)* — genuine interest vs. pragmatic choice; self-learning outside formal education

> Technical depth is evaluated by the technical interviewer, not HR. HR's job is behavioral fit, mindset, and growth potential.

### 5.2 Evidence Over Impression

Instead of "Do I like this candidate?", ask:  
**"What specifically did the candidate say or do that demonstrates this competency?"**

Collect specific examples from: academic projects, internships, extracurricular activities, part-time work, personal projects.

Reject generic claims without evidence:
- "I am a good team player." → Ask: "Tell me about a time you had to work with a very different personality."
- "I handle pressure well." → Ask: "Tell me about the most pressured deadline you faced. What happened?"
- "I am a fast learner." → Ask: "Tell me about something you taught yourself. How did you approach it?"

### 5.3 Adaptability & Resilience Signals

Engineering environments involve changing requirements, ambiguity, and failure.

**Strong signals:**
- Describes a specific plan that failed; explains what they changed
- Mentions learning something new in < 2 weeks (with a real example)
- Uses language like "I adjusted", "I realized", "the original approach didn't work so..."

**Weak signals:**
- Claims they "always" adapt without a specific example
- Describes only successes; when asked about failure, deflects
- Treats unexpected changes as someone else's fault

---

## Part 6 — Common Red Flags & Green Flags

### Red Flags (auto-lower scores)

| Red Flag | Affected Dimension | Typical Score Impact |
|---|---|---|
| Uses "we" throughout with no "I" | Specificity | −20 to −30 |
| No result or outcome stated | Structure | −15 to −25 |
| Hypothetical answer to behavioral Q | Specificity + Structure | −30 to −40 |
| "I'm a perfectionist" as weakness | Specificity + Confidence | −15 |
| Badmouths previous employer | Confidence | −20 |
| No knowledge of company when asked why | Relevance | −25 |
| Answer < 30 words for a behavioral Q | All dimensions | −30 to −50 |
| "I don't know" with no follow-up attempt | Confidence | −30 |

### Green Flags (auto-raise scores)

| Green Flag | Affected Dimension | Typical Score Impact |
|---|---|---|
| Quantified result (%, EGP, days, users) | Specificity | +15 to +20 |
| Mentions what they learned / would do differently | Structure + Confidence | +10 |
| Asks clarifying question before answering | Confidence | +5 to +10 |
| Uses industry-correct terminology naturally | Relevance | +10 |
| Answer is 60–90 words for a behavioral Q | Clarity + Structure | +5 to +10 |
| Connects answer directly back to the role | Relevance | +15 |

---

## Part 7 — Question-Asking Guidelines (for the AI)

### 7.1 Probing & Follow-up Prompts

When a candidate gives a vague answer, the AI should prompt with one of:

**For missing specificity:**
- "Can you give me a specific example of when that happened?"
- "What was the actual result in that case?"
- "How did you personally contribute to that outcome?"

**For missing structure:**
- "Walk me through what you did step by step."
- "What was the situation, and what was your specific role?"

**For missing result:**
- "And how did it turn out in the end?"
- "What was the outcome of that decision?"

### 7.2 Seniority Calibration

Adjust expectations based on candidate level:

| Level | Expected Answer Quality | Specificity Expectation |
|---|---|---|
| Intern / Fresh Graduate | Conceptual awareness + one example from university/personal | Academic projects acceptable; "I would..." answers allowed for situational Qs |
| Junior (0–2 yrs) | Can apply concepts; one work example | Work or internship example required for behavioral Qs |
| Mid-level (2–5 yrs) | Solid practical knowledge; quantified results expected | Real work examples with outcomes; numbers expected |
| Senior (5+ yrs) | Strategic thinking; cross-functional impact; team/org-level results | Significant quantified impact; mentoring and leadership signals expected |

### 7.3 Question Sequencing Best Practice

1. Start with an **open, low-pressure question** (Tell me about yourself / Walk me through your background)
2. Transition to **motivation** (Why this role?)
3. Move to **technical knowledge** (2–3 questions specific to role)
4. Add **one situational question** (What would you do if...)
5. End with **behavioral** (Tell me about a time when...)
6. Close with **candidate questions** — always allow this; strategic questions signal high engagement

---

## Part 8 — Egypt-Specific Context Notes

### 8.1 Local Market Patterns

- **Common HR cliché answers in Egypt:** "I'm a hard worker", "I'm passionate", "I love challenges" — always probe past these
- **University project answers:** Acceptable at fresh-graduate level; probe for personal contribution vs. team
- **Arabic-to-English translation lag:** Candidates often think in Arabic and translate — brief filler ("hmm", "so") is normal; excessive stumbling drops Clarity
- **Hierarchy sensitivity:** Candidates may soften conflict answers — probe: "Were there ever professional disagreements?" rather than "Did you ever fight with your boss?"

### 8.2 Egyptian MNC Expectations (Smart Village, New Cairo, 6th of October, Maadi hubs)

- English answer quality is evaluated implicitly — grammatical errors in technical terms drop Clarity
- Research-readiness: candidates should know the company's sector, recent news, and competitors
- Salary question best practice: candidates should anchor to market data, not just "what I need"
- Follow-up questions from candidate: "What does success look like in 90 days?" signals strong MNC-readiness

### 8.3 Salary Benchmarks (for context, not for AI scoring)

*Approximate 2025 ranges for Egypt market:*

| Role | Junior (EGP/month) | Mid (EGP/month) | Senior (EGP/month) |
|---|---|---|---|
| Finance Analyst | 8,000–14,000 | 15,000–28,000 | 30,000–55,000 |
| HR Specialist | 7,000–12,000 | 13,000–25,000 | 26,000–50,000 |
| Marketing Specialist | 8,000–15,000 | 16,000–30,000 | 32,000–60,000 |
| Sales Representative | 6,000–12,000 + commission | 13,000–25,000 + commission | variable |
| Business Analyst | 10,000–18,000 | 19,000–35,000 | 36,000–65,000 |
| Operations | 8,000–14,000 | 15,000–28,000 | 30,000–55,000 |
| Software Engineer | 15,000–30,000 | 31,000–65,000 | 70,000–150,000+ |
| Product Manager | 20,000–35,000 | 36,000–70,000 | 75,000–130,000 |

---

## Part 9 — AI Question Generation Guidelines

### 9.1 What to ask (per 5-question session)

A balanced 5-question session should contain:

| Q# | Type | Purpose |
|---|---|---|
| Q1 | Icebreaker / motivation | Warm-up; assess communication |
| Q2 | Technical (core concept) | Knowledge depth |
| Q3 | Technical (applied / situational) | Problem-solving |
| Q4 | Behavioral (past experience) | STAR-based; assess competency evidence |
| Q5 | Growth / self-awareness | Strength/weakness or learning |

### 9.2 Topic weighting

Do not repeat the same topic twice. Prefer questions that reveal:
1. Whether the candidate understands their field's fundamentals
2. How they handle real challenges (not theoretical)
3. Whether they take ownership of outcomes

### 9.3 Question phrasing standards

**Behavioral questions must start with:**
- "Tell me about a time when..."
- "Describe a situation where..."
- "Give me an example of..."

**Technical questions should be open-ended:**
- NOT: "Do you know what a KPI is?" (yes/no)
- YES: "What is a KPI and how have you used one?"

**Situational questions must specify a constraint:**
- NOT: "How do you handle pressure?"
- YES: "You have three urgent tasks due at the same time and no one to delegate to. What do you do?"

---

*Last updated: 2026-09-20. Sources: Business Interview Questions PDF, Business Interview Questions & Model Answers PDF, HR Interview Guidelines for Engineering Candidates MD, Egypt MNC interview research, STAR scoring rubric research, AI interview evaluation best practices.*
