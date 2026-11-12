# Feature Specification: Car Insurance Quote Form

**Feature Branch**: none yet (parked draft; originally drafted on `001-quote-creation-form` before that feature was rescoped to the application shell)

**Created**: 2026-11-12

**Status**: Parked draft, to become a later feature

**Input**: User description: "Web application where a user enters their car, driver and cover details in a structured form and receives an instant car insurance quote or an underwriter referral. One car, several named drivers. The application has a left-hand navigation with Home, Quote, Policy, Underwriter and Claims."

## Clarifications

### Session 2026-11-12

- Q: Which country and currency should the product use for locations, licence rules and premiums? → A: United Kingdom, GBP. Locations are UK postcode areas, minimum licensing age 17, licence types full UK, provisional, EU/international.
- Q: What should the AI agent do in this feature? → A: Nothing. This feature has no AI step; underwriting rules and rating are deterministic. The agent arrives in a later feature.
- Q: Which conditions send an application to a human underwriter? → A: Six rules: any driver under 21; any driver with licence held less than 1 year; any driver with 2+ claims in last 5 years; any driver with 1+ motoring convictions in last 5 years; car value above £50,000; main use is business.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Get an Instant Car Insurance Quote (Priority: P1)

A car owner opens the quote page and fills in a structured form in four parts: their own details
(name, date of birth, contact email, home location, licence held), the car (make, model, year,
category, estimated value, annual mileage band, overnight parking, main use), the cover they want
(cover level, voluntary excess, optional extras, policy start date), and the drivers to be named on
the policy. They submit the form and, when every driver and the car fall within the automatic
underwriting rules, immediately see an indicative quote: total annual premium, a breakdown showing
how the premium was built up, a quote reference and the date the quote expires.

**Why this priority**: This is the core value of the feature. Every later feature (accepting a
quote, payment, policy issue) starts from a quote that exists.

**Independent Test**: Can be fully tested by submitting a complete, low-risk application for one
car and one driver and confirming that a quote with a reference, total premium and breakdown is
shown, and that resubmitting identical details produces an identical premium.

**Acceptance Scenarios**:

1. **Given** the quote form is open, **When** the user completes every required field with valid
   values for a low-risk car and driver and chooses a cover level, **Then** the system shows a
   quote with a reference, total annual premium, a premium breakdown and an expiry date.
2. **Given** a quote has been produced, **When** the same car, driver and cover details are
   submitted again, **Then** the premium shown is identical to the first quote.
3. **Given** the quote form is open, **When** the user submits with a required field empty or an
   invalid value (for example a car year in the future or a negative mileage), **Then** the system
   highlights each problem field with a plain-language message and does not produce a quote.
4. **Given** a quote is shown, **When** the user changes the cover level or voluntary excess and
   resubmits, **Then** a new quote with a new reference is shown and the premium reflects the
   change in a way the breakdown explains.
5. **Given** a quote is shown, **When** the user reads it, **Then** the quote states that it is
   indicative and not yet a bound policy, and states the date it expires.

---

### User Story 2 - Add Several Named Drivers (Priority: P2)

The policyholder adds one or more additional drivers to the application. For each driver they
give name, date of birth, relationship to the policyholder, years the licence has been held, and
claims and motoring convictions in the last five years. They nominate which driver is the main
driver. The quote accounts for every named driver and the breakdown shows the effect each driver
has on the premium.

**Why this priority**: The chosen scope is one car with several drivers, and most households
insure more than one driver. It is second because a single-driver quote (Story 1) already delivers
a complete, demonstrable product.

**Independent Test**: Can be tested by creating a quote for one driver, then adding a second
driver with a different risk profile and confirming the premium changes, the breakdown names each
driver's contribution, and the underwriting rules were evaluated against both drivers.

**Acceptance Scenarios**:

1. **Given** the form is open, **When** the user adds an additional driver with valid details,
   **Then** the driver appears in the drivers list and can be edited or removed before submission.
2. **Given** two or more drivers are listed, **When** the user submits, **Then** the quote
   breakdown shows a line for each named driver.
3. **Given** the maximum number of drivers is reached, **When** the user tries to add another,
   **Then** the form explains the limit and does not add the driver.
4. **Given** two drivers have the same name and date of birth, **When** the user submits, **Then**
   the form flags the duplicate and asks the user to correct it.
5. **Given** no main driver is nominated, **When** the user submits, **Then** the form asks the
   user to choose one; the policyholder is offered as the default.

---

### User Story 3 - Referred to an Underwriter (Priority: P3)

An applicant whose car or any named driver triggers a high-risk underwriting rule submits the form
and, instead of a premium, sees a clear message that the application has been referred to a human
underwriter, with a referral reference and what happens next. The system records the referral with
the specific rules and reasons that triggered it, including which driver or which vehicle detail
caused each one.

**Why this priority**: Automated quoting is only acceptable if risky cases always reach a person.
This story makes Stories 1 and 2 safe to ship. It depends on the application capture they build.

**Independent Test**: Can be tested by submitting an application that matches a known refer rule
(for example a driver with several recent convictions or a car above the automatic value limit)
and confirming no premium is shown, a referral reference is shown, and the stored referral lists
the triggered rule identifiers, reasons and the driver or vehicle detail each applies to.

**Acceptance Scenarios**:

1. **Given** the quote form is open, **When** the user submits an application in which any driver
   or the car matches at least one refer rule, **Then** the system shows a referral message with a
   referral reference and does not show any premium.
2. **Given** an application has been referred, **When** the referral record is inspected, **Then**
   it contains the application reference and, for every triggered rule, its identifier, a
   plain-language reason, and the driver or vehicle detail it applies to.
3. **Given** an application matches several refer rules across different drivers, **When** it is
   submitted, **Then** all matching rules are recorded, not only the first.
4. **Given** an application has been referred, **When** the user views the outcome, **Then** the
   system never states that the application was declined; it states that an underwriter will
   review it.

---

### User Story 4 - Retrieve a Quote by Reference (Priority: P4)

An applicant who closed the page returns later, enters their quote reference and the email
address they gave on the form, and sees the same quote again, including whether it is still valid
or has expired.

**Why this priority**: Users rarely buy on the first visit, and the next feature (accepting a quote
and paying) needs a way to get back to a quote. It is lowest priority because the other stories
deliver value without it.

**Independent Test**: Can be tested by creating a quote, then retrieving it with its reference and
email and confirming the displayed premium, breakdown and expiry match the original.

**Acceptance Scenarios**:

1. **Given** a quote exists, **When** the user enters its reference and the matching email address,
   **Then** the original quote is shown unchanged.
2. **Given** a quote exists, **When** the user enters its reference with a non-matching email
   address, **Then** the system shows a generic "not found" message and reveals nothing about the
   quote.
3. **Given** a quote has passed its expiry date, **When** it is retrieved, **Then** it is shown
   clearly marked as expired and the user is invited to request a new quote.

---

### User Story 5 - Navigate the Application (Priority: P5)

A visitor opens the application and sees a persistent navigation panel on the left listing the
areas of the product: Home, Quote, Policy, Underwriter and Claims. Home gives a short introduction
and a link to start a quote. Quote opens the quote form. Policy, Underwriter and Claims open
placeholder pages that say the area is coming in a later release. The current area is highlighted
in the navigation.

**Why this priority**: The navigation is the frame every later feature plugs into, and it lets a
demo audience see the shape of the whole product. It is lowest priority because the quote journey
works without it.

**Independent Test**: Can be tested by opening each navigation item and confirming the matching
page opens, the item is highlighted, and the navigation stays visible on every page.

**Acceptance Scenarios**:

1. **Given** the application is open, **When** the visitor looks at the left panel, **Then** it
   lists Home, Quote, Policy, Underwriter and Claims in that order.
2. **Given** the visitor is on any page, **When** they choose Quote, **Then** the quote form opens
   and Quote is highlighted as the current area.
3. **Given** the visitor chooses Policy, Underwriter or Claims, **When** the page opens, **Then** it
   states that the area is not yet available and the navigation remains visible.
4. **Given** the visitor opens the application at a web address that matches no area, **When** the
   page loads, **Then** a "page not found" message is shown with the navigation still visible.

---

### Edge Cases

- What happens when a driver's date of birth makes them younger than the minimum licensing age on
  the policy start date? The form rejects the driver before submission.
- What happens when the policy start date is in the past or more than 30 days ahead? The form
  rejects the date and explains the allowed window.
- What happens when a numeric value sits exactly on a rule boundary (for example car value equal to
  the automatic-quote limit)? Each rule states whether its boundary is inclusive, and the outcome
  matches that statement.
- What happens when the user double-submits (double click, browser back and resubmit)? The system
  does not create two applications for one submission; the second attempt returns the first
  outcome.
- What happens when the underwriting rules cannot be evaluated (rule set missing or malformed)? The
  application is referred to an underwriter with a reason of "rules unavailable", never
  auto-quoted.
- What happens when the calculated premium is zero, negative or above a sanity ceiling? The
  application is referred with a reason of "premium outside valid range".
- What happens when the home location is outside the supported territory? The form says the
  location is not supported before the user fills in the rest of the form.
- What happens when the car category is not in the supported list (for example a motorcycle or
  van)? The form offers only supported categories and explains that other vehicles are not covered.
- What happens when the user removes the driver nominated as main driver? The form clears the main
  driver choice and asks the user to nominate another before submission.
- What happens when the user refreshes the page mid-form? Entered values are lost; this is accepted
  for the first version and noted in Assumptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a structured quote form that captures the policyholder's full
  name, date of birth, contact email, home location (a UK postcode area chosen from a fixed list),
  licence type (full UK, provisional, or EU/international) and years the licence has been held.
- **FR-002**: System MUST capture one car: make, model, year of manufacture, category (from a fixed
  list of supported private car categories), estimated current value, annual mileage band (from a
  fixed list), overnight parking (garage, driveway, street) and main use (social only, social and
  commuting, business).
- **FR-003**: System MUST let the user choose exactly one cover level from a fixed list (third
  party only; third party, fire and theft; comprehensive), one voluntary excess from a fixed set of
  amounts, zero or more optional extras from a fixed list (breakdown cover, legal protection,
  courtesy car), and a policy start date between today and 30 days ahead.
- **FR-004**: System MUST treat the policyholder as a named driver and let the user add up to four
  additional named drivers, each with full name, date of birth, relationship to the policyholder,
  years licence held, number of claims in the last five years, and number of motoring convictions
  in the last five years. Drivers MUST be editable and removable before submission.
- **FR-005**: System MUST require exactly one named driver to be nominated as the main driver,
  offering the policyholder as the default.
- **FR-006**: System MUST validate every field before accepting a submission: required fields
  present, numbers non-negative and within stated ranges, dates valid and within allowed windows,
  email well-formed, no duplicate drivers, each driver at least 17 years old (the UK minimum
  licensing age) on the start date. Each problem MUST be shown next to the field in plain language.
- **FR-007**: System MUST evaluate every accepted application against a published underwriting
  rule set in which each rule has a unique identifier, a plain-language description, the subject
  it applies to (car, a driver, or the application as a whole) and an outcome of either "proceed"
  or "refer". Driver rules MUST be evaluated against every named driver. The first version's
  rule set contains exactly these six refer rules (boundaries as stated, ages measured on the
  policy start date):
  - **R-001** (driver): the driver is younger than 21.
  - **R-002** (driver): the driver has held their licence for less than 1 year.
  - **R-003** (driver): the driver has 2 or more claims in the last 5 years.
  - **R-004** (driver): the driver has 1 or more motoring convictions in the last 5 years.
  - **R-005** (car): the estimated car value is greater than £50,000 (exactly £50,000 proceeds).
  - **R-006** (application): the car's main use is business.
- **FR-008**: System MUST produce exactly one of two outcomes for every accepted application: an
  instant quote, or a referral to a human underwriter. The system MUST NOT decline an application.
- **FR-009**: System MUST refer any application that triggers at least one "refer" rule, that is
  missing information the rules need, or whose rules cannot be evaluated.
- **FR-010**: System MUST record, for every referral, the application reference and, for every
  triggered rule, its identifier, a plain-language reason, and the driver or vehicle detail it
  applies to.
- **FR-011**: System MUST calculate the premium for auto-quoted applications using a fixed,
  repeatable rating method so that identical inputs always produce an identical premium.
- **FR-012**: System MUST show each quote with a unique reference, total annual premium in pounds
  sterling (GBP), a breakdown that itemises the car, each named driver, the cover level, the voluntary excess
  adjustment and each optional extra, the inputs the quote was based on, an expiry date 30 days
  after creation, and a statement that the quote is indicative and not a bound policy.
- **FR-013**: System MUST persist every application, its underwriting decision, and any quote or
  referral so they can be retrieved later by reference.
- **FR-014**: Users MUST be able to retrieve a quote by entering its reference together with the
  email address given on the application; any mismatch MUST return a generic not-found response.
- **FR-015**: System MUST show expired quotes as expired and MUST NOT present an expired premium as
  current.
- **FR-016**: System MUST treat a repeated submission of the same form within one session as the
  same application and return the original outcome rather than creating a duplicate.
- **FR-017**: System MUST keep a record of every underwriting decision (outcome, rule set version,
  rules evaluated, rules triggered) so that each decision can be explained afterwards.
- **FR-018**: System MUST NOT display or store any real personal data in demonstration and test
  material; all sample people, cars and locations MUST be synthetic.
- **FR-019**: System MUST present a persistent left-hand navigation on every page listing, in
  order, Home, Quote, Policy, Underwriter and Claims, and MUST highlight the current area.
- **FR-020**: Home MUST introduce the product and link to the quote form. Policy, Underwriter and
  Claims MUST open placeholder pages stating the area is not yet available. Unknown addresses MUST
  show a "page not found" message with the navigation visible.

### Key Entities *(include if feature involves data)*

- **Application**: One submission of the quote form. Holds the policyholder details, the car, the
  cover selection, the list of named drivers with the main driver nominated, a unique reference and
  the time it was submitted.
- **Policyholder**: The person applying, who is always also a named driver.
- **Vehicle**: The single car to be insured, with the attributes listed in FR-002.
- **Named Driver**: A person permitted to drive the car under the policy, with the attributes in
  FR-004 and a flag for whether they are the main driver. An application has one to five.
- **Cover Selection**: The chosen cover level, voluntary excess, optional extras and start date.
- **Underwriting Rule**: A published rule with an identifier, description, subject (car, driver or
  application), condition and outcome (proceed or refer). The rule set is versioned so a decision
  can name the version it used.
- **Underwriting Decision**: The result of evaluating an application: outcome, rule set version,
  rules evaluated, and rules triggered with reasons and the subject each applied to.
- **Quote**: The priced outcome of a proceed decision: reference, total annual premium, itemised
  breakdown, inputs used, creation and expiry dates, and status (valid or expired).
- **Referral**: The outcome of a refer decision: reference, the application it belongs to, the
  triggered rules with reasons and subjects, and a status that starts as "awaiting underwriter".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can complete the form for one car and two drivers and reach a
  quote or referral outcome in under 7 minutes.
- **SC-002**: 100% of submissions with identical inputs produce an identical premium.
- **SC-003**: 100% of applications in which the car or any driver matches a refer rule are
  referred; none receives an automatic quote.
- **SC-004**: 100% of referrals record at least one triggered rule identifier, a reason and the
  subject it applies to.
- **SC-005**: 95% of valid submissions show their outcome within 10 seconds of submitting.
- **SC-006**: 100% of invalid submissions are stopped before an outcome is produced, with every
  invalid field identified.
- **SC-007**: 100% of quotes can be retrieved by reference and email and match the original quote.
- **SC-008**: Every quote breakdown accounts for the full premium: the itemised lines sum to the
  total shown.
- **SC-009**: Every underwriting decision can be explained after the fact by listing the rules it
  evaluated and triggered.
- **SC-010**: 100% of navigation items open their matching page with the item highlighted, and the
  navigation is visible on every page including "page not found".

## Assumptions

- The product is UK private car insurance priced in GBP. Supported locations are UK postcode
  areas; the form rejects any location outside the UK. Minimum licensing age is 17 and licence
  types are full UK, provisional and EU/international.
- One car per application. Multi-car policies are out of scope.
- Up to five named drivers in total (policyholder plus four). The policyholder is always a named
  driver.
- Three cover levels, a small fixed set of voluntary excess amounts and three optional extras are
  offered. More products and extras are out of scope.
- Users do not need an account. A quote is retrieved with its reference plus the email given on the
  form.
- The underwriting rule set (R-001 to R-006) and the rating tables for the first version are
  synthetic and published inside the project; they exist to demonstrate the flow, not to price
  real risk.
- Quotes are indicative. Accepting a quote, payment and policy issue are separate later features.
- This feature contains no AI or agent step. Underwriting decisions and premiums come entirely
  from the published rule set and rating method. AI-assisted underwriting (for example explaining
  decisions or extracting details from free text) is a later feature.
- The underwriter's own review screen is out of scope; this feature only records the referral. The
  Underwriter, Policy and Claims navigation items open placeholders only.
- No sign-in is required for any navigation area in this feature. Access control for the
  Underwriter area is deferred to the feature that builds its review screen.
- Vehicle details are typed by the user; looking a car up by registration plate is out of scope.
- Saving a half-completed form is out of scope; refreshing the page clears it.
- Users have a modern web browser and a stable connection; mobile layout is supported but not
  optimised.
- Performance targets assume demonstration-scale usage (tens of users), not production load.
