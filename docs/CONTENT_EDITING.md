# Content Editing Guide

All website content is centralized in one file for easy editing without touching code.

---

## 📝 Where to Edit Content

**Main File:** `src/lib/businessData.ts`

This is the ONLY file you need to edit to update:
- Headlines & descriptions
- Problem statements & pain points
- Market opportunity stats
- Solution pillars
- Revenue streams
- Traction metrics
- Roadmap & milestones
- Financial projections
- Team information
- CTAs & contact details

---

## 📊 Content Structure

The data is organized in sections that match the website flow:

```
BUSINESS_DATA
├── name                      // Company name
├── tagline                   // One-liner
├── elevator                  // Elevator pitch
├── hero                      // Hero section
├── problem                   // Problem statement
├── opportunity               // Market opportunity
├── solution                  // Solution pillars
├── businessModel             // Revenue model
├── traction                  // Proof of traction
├── roadmap                   // 12-month plan
├── team                      // Team info
├── financialProjection       // Revenue projections
└── cta                       // Call to action
```

---

## 🎯 How to Update Each Section

### 1. Hero Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.hero`

```typescript
hero: {
  headline: "Your main value prop (short & punchy)",
  subheadline: "Supporting statement that clarifies the headline",
  cta: "Button text here",
},
```

**Tips:**
- Headline: 8-12 words max
- Subheadline: 1-2 sentences
- CTA: Action-oriented verb (e.g., "Book a Call", "Get Started")

### 2. Problem Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.problem`

```typescript
problem: {
  title: "Section heading",
  description: "Problem overview (2-3 sentences)",
  painPoints: [
    {
      title: "Pain point #1",
      description: "Why this matters for your audience",
    },
    // ... up to 4 pain points
  ],
},
```

**Tips:**
- Focus on customer pain, not your solution
- Use emotional language (lost, frustrated, wasting time)
- Make it specific to your target audience

### 3. Opportunity Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.opportunity`

```typescript
opportunity: {
  title: "Market opportunity heading",
  stats: [
    {
      label: "Statistic name",
      value: "123M", // Big number
      description: "What this stat means",
    },
    // ... up to 4 stats
  ],
},
```

**Tips:**
- Stats should be impressive but realistic
- Include source if possible
- Format: ₹123L (Indian rupees), 5M (millions), 50% (percentage)

### 4. Solution Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.solution`

```typescript
solution: {
  title: "How you solve the problem",
  pillars: [
    {
      title: "Pillar #1",
      description: "One-liner benefit",
      details: "Why this approach works",
    },
    // ... 3 pillars
  ],
},
```

**Tips:**
- 3 pillars max (more is clutter)
- Each pillar should be a distinct approach
- Make pillars concrete, not abstract

### 5. Business Model Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.businessModel`

```typescript
businessModel: {
  title: "How you make money",
  streams: [
    {
      name: "Revenue stream name",
      price: "₹5K–₹50K",
      cycle: "One-time / Monthly / Quarterly",
      example: "Real use case from your clients",
      margin: "70% gross margin",
    },
    // ... 2-3 streams
  ],
},
```

**Tips:**
- Show actual pricing, not ranges
- Margin = (Revenue - COGS) / Revenue
- Example should be a real client type

### 6. Traction Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.traction`

```typescript
traction: {
  title: "Proof you're executing",
  highlights: [
    {
      metric: "12 Clients",
      description: "Type of clients or achievement",
    },
    // ... 5 key metrics
  ],
},
```

**Tips:**
- Only include real metrics you can defend
- Focus on: revenue, customers, retention, growth rate
- Each metric should have context

### 7. Roadmap Section
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.roadmap`

```typescript
roadmap: {
  title: "12-month execution plan",
  phases: [
    {
      quarter: "Q1 (Jan-Mar)",
      goals: [
        "Hit specific milestone",
        "Hire role X",
        "Launch feature Y",
        // ... 3-4 goals per quarter
      ],
    },
    // ... Q2, Q3, Q4
  ],
},
```

**Tips:**
- Make goals measurable (not "grow" but "hit ₹50L ARR")
- 3-4 goals per quarter
- Include both revenue and operational goals
- Be ambitious but realistic

### 8. Financial Projection
**File:** `src/lib/businessData.ts` → `BUSINESS_DATA.financialProjection`

```typescript
financialProjection: {
  title: "Revenue forecast",
  months: [
    {
      month: "Jan",
      arr: 800000,        // Annual Recurring Revenue in rupees
      gmv: 1200000,       // Gross Merchandise Volume
      customers: 12,      // Number of customers
    },
    // ... 12 months total
  ],
},
```

**Tips:**
- Use conservative growth rates (15% MoM is ambitious)
- ARR = monthly revenue × 12
- Track both revenue and customer count
- Show realistic path to profitability

---

## 🔄 Common Updates

### Update Statistics
Find the stat in `BUSINESS_DATA.opportunity.stats`:
```typescript
stats: [
  {
    label: "MSMEs in India",
    value: "63M+",        // ← Change this
    description: "Millions of small businesses desperate for help",
  },
],
```

### Add New Traction Metric
Add to `BUSINESS_DATA.traction.highlights`:
```typescript
highlights: [
  // ... existing metrics
  {
    metric: "New achievement",
    description: "Why this matters",
  },
],
```

### Update Revenue Projection
Update `BUSINESS_DATA.financialProjection.months`:
```typescript
months: [
  { month: "Jan", arr: 800000, gmv: 1200000, customers: 12 },
  { month: "Feb", arr: 920000, gmv: 1380000, customers: 14 }, // ← Update
  // ...
],
```

### Adjust Roadmap Milestone
Find the specific quarter and goal:
```typescript
{
  quarter: "Q1 (Now)",
  goals: [
    "Old goal" // ← Change this
    "New goal",
  ],
},
```

---

## 📸 Editing Workflow

### Step 1: Open the File
```bash
code src/lib/businessData.ts
```

### Step 2: Find the Section
Use Ctrl+F to search for section name:
- "hero" → Hero section
- "problem" → Problem section
- "opportunity" → Market opportunity
- etc.

### Step 3: Update the Data
Edit the text directly. Example:
```typescript
// Before:
headline: "From Manual WhatsApp to AI-Powered Automation",

// After:
headline: "Stop Manual Work. Start Selling Smarter.",
```

### Step 4: Save & Test
- Save file (Ctrl+S)
- Website auto-reloads in browser
- Check that changes appear

---

## ✅ Content Checklist

Before sharing the website:

- [ ] **Hero Section**
  - [ ] Headline is compelling
  - [ ] Subheadline explains value prop
  - [ ] CTA button text is action-oriented

- [ ] **Problem**
  - [ ] 4 real pain points identified
  - [ ] Customer quotes or data supporting each
  - [ ] Emotional resonance (not just features)

- [ ] **Opportunity**
  - [ ] 4 market stats with sources
  - [ ] Clearly shows market size
  - [ ] Justifies why NOW is the right time

- [ ] **Solution**
  - [ ] 3 pillars that differentiate you
  - [ ] Each pillar has concrete example
  - [ ] Shows clear path from problem → solution

- [ ] **Business Model**
  - [ ] 2-3 revenue streams
  - [ ] Actual pricing data (not guesses)
  - [ ] Margins are realistic
  - [ ] Examples are real or representative

- [ ] **Traction**
  - [ ] 5 key metrics you can defend
  - [ ] Growth trajectory is clear
  - [ ] Numbers are current (within 30 days)

- [ ] **Roadmap**
  - [ ] 12 months of quarters
  - [ ] Measurable goals per quarter
  - [ ] Clear path to ₹1Cr+ ARR
  - [ ] Hiring plan visible

- [ ] **Financials**
  - [ ] 12 months of projections
  - [ ] Growth rate is consistent
  - [ ] Shows path to profitability
  - [ ] Supports claims in roadmap

- [ ] **Team**
  - [ ] Founder/CEO info included
  - [ ] Relevant credentials/experience shown
  - [ ] "Why you'll win" is clear

---

## 🎯 Pro Tips

### Make Numbers "Pop"
❌ "Our clients save time"
✅ "Our clients recover 10 hours/week" (specific number)

### Use Specificity
❌ "We're growing fast"
✅ "Growing 15% month-over-month" (concrete metric)

### Show Real Examples
❌ "Clients in different industries"
✅ "12 clients: FMCG distributor, logistics firm, retail chain, service provider"

### Quantify Impact
❌ "Clients are happy"
✅ "90% of clients renew (vs. 40% industry average)"

---

## 🚨 Common Mistakes

❌ **Vague claims** → ✅ *Specific metrics*
"We help businesses grow" → "Clients see 30% revenue increase"

❌ **Jargon** → ✅ *Plain language*
"Leverage AI-powered synergies" → "Automate WhatsApp replies"

❌ **Generic stats** → ✅ *Sourced numbers*
"Millions of businesses" → "₹63M MSMEs in India (SIDBI data)"

❌ **Aspirational goals** → ✅ *Realistic roadmap*
"Reach unicorn status" → "Hit ₹1Cr ARR in 12 months"

---

## 📲 Testing Changes

After editing content:

1. **Save the file** → Changes auto-reload
2. **Scroll through website** → Verify all sections appear
3. **Test on mobile** → Screen size: 375px
4. **Test contact form** → Submit test message
5. **Check for typos** → Proofread all text

---

## 🔄 Version Control

Keep track of changes:
```bash
# See what you changed
git diff src/lib/businessData.ts

# Commit changes with message
git commit -m "Update Q2 roadmap goals"

# Push to deploy
git push origin main
```

---

## Questions?

Each property in `BUSINESS_DATA` is clearly named. Hover over it in VS Code to see descriptions.

If something isn't clear, check the TypeScript types:
`src/lib/types.ts`

