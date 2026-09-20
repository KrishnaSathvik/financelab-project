# MoneyBasis independent test matrix

Audit date: 2026-09-18. Local uncommitted snapshot; production browser execution not verified. Application and existing test-suite files were not changed. See [CALCULATOR_AUDIT.md](CALCULATOR_AUDIT.md) for findings and conventions.

## Execution and interpretation

**Existing suite:** `npm test`, 3 files, 22 passing tests (14 calculator, 3 sharing, 5 SEO). **Audit reference run:** 160 cases, 123 matches, 37 mismatches. This is a comparison report, not a claim that 160 independent production tests have been added or that every accepted model has been approved.

Expected values were generated without importing production calculators: Python Decimal at 50 digits, discounted cash-flow sums for amortizing payments, explicit geometric sums for deposits, and independently specified debt and housing ledgers. A separate temporary Node runner transpiled and called the current TypeScript functions only to obtain observed values. All 54 bracket-boundary cases use independently transcribed IRS2026 tables.

A mismatch may be (a) a defect under current semantics, (b) a proposed model/validation policy, or (c) a currently unsupported input entering an unguarded engine. In particular, V buyer portfolio expectations use the recommended **equal monthly resource budget** model; R12 chooses **today-dollar desired income**; zero-income budget ratios are expected to be unavailable; invalid cases require rejection although no production error object convention is specified yet. Negative-return and fractional-year probes must either work as specified or be explicitly blocked, not silently produce inconsistent answers.

M5 treats the existing all-cash mortgage null result as the current contract; the audit recommends a clearer valid no-loan state. `safeAnnualWithdrawal` and `savingsRate` are current property names retained for traceability, not endorsed labels.

Tolerances: money ±$0.01 normally; counts/booleans/IDs/statuses exact; tax-boundary dollars ±$0.000001 to inspect bracket continuity. Long extreme projections use an explicitly larger absolute tolerance derived from scale. I8 permits $50 on an approximately $494b hypothetical (about 1e-10 relative); it does not claim cent precision at that scale. UI formatting should be tested separately. In the tables, numeric tolerance applies to money; month counts must be exact even if the temporary generic runner compares them with the same small dollar tolerance.

`error:true` means reject before a success result (structured validation preferred); observed `error:null` means no rejection occurred. Paths such as `months.last.balance` and `series.last.value` select returned fields. Null ratio means mathematically undefined, not zero. Infinity is serialized as a string. JSON input list is the **complete argument list**, not a partial scenario. Output numbers are compactly displayed below, with machine precision retained by reproducible scripts.

## Coverage summary

| Module | Normal | Edge | Extreme | Invalid | Boundary / policy | Matches / cases |
|---|---:|---:|---:|---:|---:|---:|
| mortgage | 3 | 5 | 2 | 1 | 0 | 9 / 11 |
| investment | 3 | 5 | 2 | 1 | 0 | 8 / 11 |
| salary | 6 | 3 | 2 | 1 | 54 | 62 / 66 |
| loan-payoff | 3 | 4 | 2 | 1 | 0 | 8 / 10 |
| net-worth | 3 | 3 | 2 | 1 | 0 | 8 / 9 |
| budget | 3 | 3 | 2 | 1 | 0 | 6 / 9 |
| retirement | 3 | 5 | 2 | 1 | 1 | 9 / 12 |
| savings-goal | 3 | 5 | 2 | 1 | 0 | 6 / 11 |
| debt-snowball | 3 | 4 | 2 | 1 | 0 | 3 / 10 |
| rent-vs-buy | 4 | 4 | 2 | 1 | 0 | 4 / 11 |

## mortgage

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| M1 / normal | `calculateMortgage({"homePrice":400000,"downPayment":80000,"annualRatePercent":6.5,"termYears":30})` | `{"loanAmount":320000,"monthlyPayment":2022.61767518,"totalInterest":408142.36306389,"months.last.balance":0}` | `{"loanAmount":320000,"monthlyPayment":2022.61767518,"totalInterest":408142.3630639,"months.last.balance":0}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M2 / normal | `calculateMortgage({"homePrice":300000,"downPayment":60000,"annualRatePercent":5,"termYears":15})` | `{"loanAmount":240000,"monthlyPayment":1897.90470418,"totalInterest":101622.84675235,"months.last.balance":0}` | `{"loanAmount":240000,"monthlyPayment":1897.90470418,"totalInterest":101622.84675235,"months.last.balance":0}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M3 / normal | `calculateMortgage({"homePrice":300000,"downPayment":0,"annualRatePercent":7,"termYears":20})` | `{"loanAmount":300000,"monthlyPayment":2325.89680686,"totalInterest":258215.23364559,"months.last.balance":0}` | `{"loanAmount":300000,"monthlyPayment":2325.89680686,"totalInterest":258215.23364559,"months.last.balance":0.0}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M4 / edge | `calculateMortgage({"homePrice":1200,"downPayment":0,"annualRatePercent":0,"termYears":10})` | `{"loanAmount":1200,"monthlyPayment":10,"totalInterest":0,"months.last.balance":0}` | `{"loanAmount":1200,"monthlyPayment":10,"totalInterest":0,"months.last.balance":0}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M5 / edge | `calculateMortgage({"homePrice":100,"downPayment":100,"annualRatePercent":0,"termYears":10})` | `{"loanAmount":null}` | `{"loanAmount":null}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M6 / edge | `calculateMortgage({"homePrice":100,"downPayment":99.99,"annualRatePercent":5,"termYears":10})` | `{"loanAmount":0.01,"monthlyPayment":0.00010607,"totalInterest":0.00272786,"months.last.balance":0}` | `{"loanAmount":0.01,"monthlyPayment":0.00010607,"totalInterest":0.00272786,"months.last.balance":0}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M7 / extreme | `calculateMortgage({"homePrice":100000000,"downPayment":0,"annualRatePercent":12,"termYears":30})` | `{"loanAmount":100000000,"monthlyPayment":1028612.5969255,"totalInterest":270300534.89318156,"months.last.balance":0}` | `{"loanAmount":100000000,"monthlyPayment":1028612.5969255,"totalInterest":270300534.89318156,"months.last.balance":2.1e-06}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M8 / extreme | `calculateMortgage({"homePrice":1000,"downPayment":0,"annualRatePercent":1e-06,"termYears":30})` | `{"loanAmount":1000,"monthlyPayment":2.7777782,"totalInterest":0.00015042,"months.last.balance":0}` | `{"loanAmount":1000,"monthlyPayment":2.77777797,"totalInterest":6.775e-05,"months.last.balance":8.267e-05}` | ±0.01; **MATCH** | Independent present-value payment; schedule reconciles |
| M9 / invalid | `calculateMortgage({"homePrice":100,"downPayment":-10,"annualRatePercent":5,"termYears":10})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Negative down payment must be rejected |
| M10 / edge | `calculateMortgage({"homePrice":400000,"downPayment":80000,"annualRatePercent":6.5,"termYears":30,"annualPropertyTax":4800,"annualInsurance":2400,"monthlyHoa":100,"monthlyPmi":50})` | `{"estimatedMonthlyCost":2772.61767518}` | `{"estimatedMonthlyCost":2772.61767518}` | ±0.01; **MATCH** | Fees separate from principal and interest |
| M11 / edge | `calculateMortgage({"homePrice":1200,"downPayment":0,"annualRatePercent":0,"termYears":1.5})` | `{"months.length":18,"months.last.balance":0}` | `{"months.length":12,"months.last.balance":400.0}` | ±0.01; **MISMATCH** | If fractional years are accepted, generate all 18 months |

## investment

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| I1 / normal | `calculateInvestment({"startingAmount":10000,"monthlyContribution":500,"annualReturnPercent":7,"years":20,"compoundingFrequency":"monthly"})` | `{"finalValue":300850.71840258,"totalContributed":130000,"interestEarned":170850.71840258}` | `{"finalValue":300850.71840258,"totalContributed":130000,"interestEarned":170850.71840258}` | ±0.01; **MATCH** | Geometric-series oracle; losses stay signed |
| I2 / normal | `calculateInvestment({"startingAmount":10000,"monthlyContribution":0,"annualReturnPercent":5,"years":10,"compoundingFrequency":"annually"})` | `{"finalValue":16288.94626777,"totalContributed":10000,"interestEarned":6288.94626777}` | `{"finalValue":16288.94626777,"totalContributed":10000,"interestEarned":6288.94626777}` | ±0.01; **MATCH** | Geometric-series oracle; losses stay signed |
| I3 / normal | `calculateInvestment({"startingAmount":0,"monthlyContribution":100,"annualReturnPercent":12,"years":1,"compoundingFrequency":"quarterly"})` | `{"finalValue":1267.55654033,"totalContributed":1200,"interestEarned":67.55654033}` | `{"finalValue":1267.55654033,"totalContributed":1200,"interestEarned":67.55654033}` | ±0.01; **MATCH** | Geometric-series oracle; losses stay signed |
| I4 / edge | `calculateInvestment({"startingAmount":1000,"monthlyContribution":100,"annualReturnPercent":0,"years":1,"compoundingFrequency":"monthly"})` | `{"finalValue":2200,"totalContributed":2200,"interestEarned":0}` | `{"finalValue":2200,"totalContributed":2200,"interestEarned":0}` | ±0.01; **MATCH** | Geometric-series oracle; losses stay signed |
| I5 / edge | `calculateInvestment({"startingAmount":0,"monthlyContribution":0,"annualReturnPercent":7,"years":20,"compoundingFrequency":"monthly"})` | `{"finalValue":0,"totalContributed":0,"interestEarned":0}` | `{"finalValue":0,"totalContributed":0,"interestEarned":0}` | ±0.01; **MATCH** | Geometric-series oracle; losses stay signed |
| I6 / edge | `calculateInvestment({"startingAmount":1000,"monthlyContribution":0,"annualReturnPercent":-12,"years":1,"compoundingFrequency":"monthly"})` | `{"finalValue":886.38487172,"totalContributed":1000,"interestEarned":-113.61512828}` | `{"finalValue":886.38487172,"totalContributed":1000,"interestEarned":0}` | ±0.01; **MISMATCH** | Geometric-series oracle; losses stay signed |
| I7 / extreme | `calculateInvestment({"startingAmount":100000000,"monthlyContribution":100000,"annualReturnPercent":15,"years":40,"compoundingFrequency":"monthly"})` | `{"finalValue":41971673945.00032,"totalContributed":148000000,"interestEarned":41823673945.00032}` | `{"finalValue":41971673944.99946,"totalContributed":148000000,"interestEarned":41823673944.99946}` | ±0.041971674; **MATCH** | Geometric-series oracle; losses stay signed |
| I8 / extreme | `calculateInvestment({"startingAmount":1000,"monthlyContribution":1,"annualReturnPercent":40,"years":50,"compoundingFrequency":"daily"})` | `{"finalValue":494046897142.02997,"totalContributed":1600,"interestEarned":494046895542.02997}` | `{"finalValue":494046897141.192,"totalContributed":1600,"interestEarned":494046895541.192}` | ±50; **MATCH** | Geometric-series oracle; losses stay signed |
| I9 / invalid | `calculateInvestment({"startingAmount":100,"monthlyContribution":-5,"annualReturnPercent":5,"years":1})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Negative deposit must reject or become explicit withdrawal mode |
| I10 / edge | `calculateInvestment({"startingAmount":0,"monthlyContribution":100,"annualReturnPercent":0,"years":2,"contributionIncreasePercent":10,"inflationPercent":3})` | `{"finalValue":2520,"realFutureValue":2375.34169102}` | `{"finalValue":2520,"realFutureValue":2375.34169102}` | ±0.01; **MATCH** | Step up after first year and deflate once |
| I11 / edge | `calculateInvestment({"startingAmount":0,"monthlyContribution":100,"annualReturnPercent":0,"years":1.5})` | `{"finalValue":1800}` | `{"finalValue":1200}` | ±0.01; **MISMATCH** | Prevent fractional-year headline/chart mismatch or reject fractional years |

## salary

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| S1 / normal | `calculateSalary({"mode":"salary","annualSalary":75000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":7670,"socialSecurity":4650,"medicare":1087.5,"netAnnual":61592.5,"taxableIncome":58900}` | `{"federalTax":7670,"socialSecurity":4650,"medicare":1087.5,"netAnnual":61592.5,"taxableIncome":58900}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S2 / normal | `calculateSalary({"mode":"salary","annualSalary":150000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":15340,"socialSecurity":9300,"medicare":2175,"netAnnual":123185,"taxableIncome":117800}` | `{"federalTax":15340,"socialSecurity":9300,"medicare":2175,"netAnnual":123185,"taxableIncome":117800}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S3 / normal | `calculateSalary({"mode":"salary","annualSalary":100000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":9588,"socialSecurity":6200,"medicare":1450,"netAnnual":82762,"taxableIncome":75850}` | `{"federalTax":9588,"socialSecurity":6200,"medicare":1450,"netAnnual":82762,"taxableIncome":75850}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S4 / edge | `calculateSalary({"mode":"salary","annualSalary":0,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":0,"socialSecurity":0,"medicare":0,"netAnnual":0,"taxableIncome":0}` | `{"federalTax":0,"socialSecurity":0,"medicare":0,"netAnnual":0,"taxableIncome":0}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S5 / edge | `calculateSalary({"mode":"salary","annualSalary":16100,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":0,"socialSecurity":998.2,"medicare":233.45,"netAnnual":14868.35,"taxableIncome":0}` | `{"federalTax":0,"socialSecurity":998.2,"medicare":233.45,"netAnnual":14868.35,"taxableIncome":0}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S6 / edge | `calculateSalary({"mode":"salary","annualSalary":184500,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":33014,"socialSecurity":11439,"medicare":2675.25,"netAnnual":137371.75,"taxableIncome":168400}` | `{"federalTax":33014,"socialSecurity":11439,"medicare":2675.25,"netAnnual":137371.75,"taxableIncome":168400}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S7 / extreme | `calculateSalary({"mode":"salary","annualSalary":1000000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":320000.25,"socialSecurity":11439,"medicare":21700,"netAnnual":646860.75,"taxableIncome":983900}` | `{"federalTax":320000.25,"socialSecurity":11439,"medicare":14500,"netAnnual":654060.75,"taxableIncome":983900}` | ±0.01; **MISMATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S8 / extreme | `calculateSalary({"mode":"salary","annualSalary":1000000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":280250.5,"socialSecurity":11439,"medicare":21250,"netAnnual":687060.5,"taxableIncome":967800}` | `{"federalTax":280250.5,"socialSecurity":11439,"medicare":14500,"netAnnual":693810.5,"taxableIncome":967800}` | ±0.01; **MISMATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S9 / normal | `calculateSalary({"mode":"salary","annualSalary":75000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":10000,"healthInsurance":2000})` | `{"federalTax":5380,"socialSecurity":4526,"medicare":1058.5,"netAnnual":52035.5,"taxableIncome":46900}` | `{"federalTax":5380,"socialSecurity":4526,"medicare":1058.5,"netAnnual":52035.5,"taxableIncome":46900}` | ±0.01; **MATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S10 / normal | `calculateSalary({"mode":"salary","annualSalary":300000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single","taxYear":2026,"traditional401k":0,"healthInsurance":0})` | `{"federalTax":68134.25,"socialSecurity":11439,"medicare":5250,"netAnnual":215176.75,"taxableIncome":283900}` | `{"federalTax":68134.25,"socialSecurity":11439,"medicare":4350,"netAnnual":216076.75,"taxableIncome":283900}` | ±0.01; **MISMATCH** | Independent IRS bracket slices, SSA cap and Additional Medicare liability |
| S11 / invalid | `calculateSalary({"mode":"salary","annualSalary":75000,"hoursPerWeek":40,"weeksPerYear":0,"filingStatus":"single"})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Zero paid weeks cannot define weekly pay |
| S12 / normal | `calculateSalary({"mode":"hourly","hourlyRate":30,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"annualSalary":62400,"hourlyRate":30}` | `{"annualSalary":62400,"hourlyRate":30}` | ±0.01; **MATCH** | Gross conversion exact |
| SB-single-0--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":28499.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":1239.999}` | `{"federalTax":1239.999}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-0-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":28500,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":1240}` | `{"federalTax":1240}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-0-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":28500.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":1240.0012}` | `{"federalTax":1240.0012}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-1--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":66499.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":5799.9988}` | `{"federalTax":5799.9988}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-1-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":66500,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":5800}` | `{"federalTax":5800}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-1-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":66500.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":5800.0022}` | `{"federalTax":5800.0022}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-2--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":121799.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":17965.9978}` | `{"federalTax":17965.9978}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-2-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":121800,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":17966}` | `{"federalTax":17966}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-2-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":121800.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":17966.0024}` | `{"federalTax":17966.0024}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-3--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":217874.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":41023.9976}` | `{"federalTax":41023.9976}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-3-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":217875,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":41024}` | `{"federalTax":41024}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-3-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":217875.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":41024.0032}` | `{"federalTax":41024.0032}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-4--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":272324.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":58447.9968}` | `{"federalTax":58447.9968}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-4-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":272325,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":58448}` | `{"federalTax":58448}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-4-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":272325.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":58448.0035}` | `{"federalTax":58448.0035}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-5--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":656699.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":192979.2465}` | `{"federalTax":192979.2465}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-5-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":656700,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":192979.25}` | `{"federalTax":192979.25}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-single-5-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":656700.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"single"})` | `{"federalTax":192979.2537}` | `{"federalTax":192979.2537}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-0--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":56999.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":2479.999}` | `{"federalTax":2479.999}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-0-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":57000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":2480}` | `{"federalTax":2480}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-0-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":57000.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":2480.0012}` | `{"federalTax":2480.0012}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-1--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":132999.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":11599.9988}` | `{"federalTax":11599.9988}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-1-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":133000,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":11600}` | `{"federalTax":11600}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-1-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":133000.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":11600.0022}` | `{"federalTax":11600.0022}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-2--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":243599.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":35931.9978}` | `{"federalTax":35931.9978}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-2-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":243600,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":35932}` | `{"federalTax":35932}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-2-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":243600.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":35932.0024}` | `{"federalTax":35932.0024}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-3--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":435749.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":82047.9976}` | `{"federalTax":82047.9976}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-3-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":435750,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":82048}` | `{"federalTax":82048}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-3-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":435750.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":82048.0032}` | `{"federalTax":82048.0032}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-4--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":544649.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":116895.9968}` | `{"federalTax":116895.9968}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-4-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":544650,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":116896}` | `{"federalTax":116896}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-4-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":544650.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":116896.0035}` | `{"federalTax":116896.0035}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-5--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":800899.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":206583.4965}` | `{"federalTax":206583.4965}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-5-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":800900,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":206583.5}` | `{"federalTax":206583.5}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-mfj-5-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":800900.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"mfj"})` | `{"federalTax":206583.5037}` | `{"federalTax":206583.5037}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-0--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":41849.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":1769.999}` | `{"federalTax":1769.999}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-0-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":41850,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":1770}` | `{"federalTax":1770}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-0-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":41850.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":1770.0012}` | `{"federalTax":1770.0012}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-1--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":91599.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":7739.9988}` | `{"federalTax":7739.9988}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-1-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":91600,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":7740}` | `{"federalTax":7740}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-1-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":91600.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":7740.0022}` | `{"federalTax":7740.0022}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-2--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":129849.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":16154.9978}` | `{"federalTax":16154.9978}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-2-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":129850,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":16155}` | `{"federalTax":16155}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-2-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":129850.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":16155.0024}` | `{"federalTax":16155.0024}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-3--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":225899.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":39206.9976}` | `{"federalTax":39206.9976}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-3-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":225900,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":39207}` | `{"federalTax":39207}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-3-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":225900.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":39207.0032}` | `{"federalTax":39207.0032}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-4--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":280349.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":56630.9968}` | `{"federalTax":56630.9968}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-4-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":280350,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":56631}` | `{"federalTax":56631}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-4-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":280350.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":56631.0035}` | `{"federalTax":56631.0035}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-5--0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":664749.99,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":191170.9965}` | `{"federalTax":191170.9965}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-5-0 / boundary | `calculateSalary({"mode":"salary","annualSalary":664750,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":191171}` | `{"federalTax":191171}` | ±1e-06; **MATCH** | Every supported bracket boundary |
| SB-hoh-5-0.01 / boundary | `calculateSalary({"mode":"salary","annualSalary":664750.01,"hoursPerWeek":40,"weeksPerYear":52,"filingStatus":"hoh"})` | `{"federalTax":191171.0037}` | `{"federalTax":191171.0037}` | ±1e-06; **MATCH** | Every supported bracket boundary |

## loan-payoff

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| L1 / normal | `simulateLoan(25000,8,500)` | `{"months":62,"interest":5511.17334448,"totalPaid":30511.17334448}` | `{"months":62,"interest":5511.17334448,"totalPaid":30511.17334448}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L2 / normal | `simulateLoan(10000,12,300)` | `{"months":41,"interest":2224.95258152,"totalPaid":12224.95258152}` | `{"months":41,"interest":2224.95258152,"totalPaid":12224.95258152}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L3 / normal | `simulateLoan(10000,12,400)` | `{"months":29,"interest":1564.88370298,"totalPaid":11564.88370298}` | `{"months":29,"interest":1564.88370298,"totalPaid":11564.88370298}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L4 / edge | `simulateLoan(1000,0,300)` | `{"months":4,"interest":0,"totalPaid":1000}` | `{"months":4,"interest":0,"totalPaid":1000}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L5 / edge | `simulateLoan(1000,12,10)` | `{"months":"Infinity"}` | `{"months":"Infinity"}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L6 / edge | `simulateLoan(0,12,100)` | `{"months":0,"interest":0,"totalPaid":0}` | `{"months":0,"interest":0,"totalPaid":0}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L7 / extreme | `simulateLoan(100000000,20,2000000)` | `{"months":109,"interest":116801925.53749579,"totalPaid":216801925.5374958}` | `{"months":109,"interest":116801925.53749582,"totalPaid":216801925.53749582}` | ±0.01; **MATCH** | Decimal monthly ledger incl capped final payment |
| L8 / extreme | `simulateLoan(1201,0,1)` | `{"months":1201,"interest":0,"totalPaid":1201}` | `{"months":1200,"interest":0,"totalPaid":1200}` | ±0.01; **MISMATCH** | Decimal monthly ledger incl capped final payment |
| L9 / invalid | `simulateLoan(-100,12,100)` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Reject negative principal |
| L10 / edge | `simulateLoan(1000,12,100,{"oneTimeExtra":500,"startMonth":1})` | `{"months":6,"interest":20.81361954,"totalPaid":1020.81361954}` | `{"months":6,"interest":20.81361954,"totalPaid":1020.81361954}` | ±0.01; **MATCH** | Interest then one-time principal payment |

## net-worth

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| N1 / normal | `calculateNetWorth({"assets":150000,"debts":80000,"monthlySavings":1500,"monthlyDebtPaydown":800,"assetReturnPercent":6,"debtInterestPercent":5,"years":30})` | `{"current":70000,"series.last.netWorth":2754958.61719175}` | `{"current":70000,"series.last.netWorth":2754958.61719168}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N2 / normal | `calculateNetWorth({"assets":10000,"debts":1000,"monthlySavings":100,"monthlyDebtPaydown":200,"assetReturnPercent":0,"debtInterestPercent":0,"years":1})` | `{"current":9000,"series.last.netWorth":12600}` | `{"current":9000,"series.last.netWorth":12600}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N3 / normal | `calculateNetWorth({"assets":357000,"debts":240000,"monthlySavings":0,"monthlyDebtPaydown":0,"assetReturnPercent":0,"debtInterestPercent":0,"years":1})` | `{"current":117000,"series.last.netWorth":117000}` | `{"current":117000,"series.last.netWorth":117000}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N4 / edge | `calculateNetWorth({"assets":0,"debts":0,"monthlySavings":0,"monthlyDebtPaydown":0,"assetReturnPercent":0,"debtInterestPercent":0,"years":30})` | `{"current":0,"series.last.netWorth":0}` | `{"current":0,"series.last.netWorth":0}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N5 / edge | `calculateNetWorth({"assets":0,"debts":10000,"monthlySavings":0,"monthlyDebtPaydown":0,"assetReturnPercent":0,"debtInterestPercent":0,"years":30})` | `{"current":-10000,"series.last.netWorth":-10000}` | `{"current":-10000,"series.last.netWorth":-10000}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N6 / edge | `calculateNetWorth({"assets":0,"debts":100,"monthlySavings":0,"monthlyDebtPaydown":200,"assetReturnPercent":0,"debtInterestPercent":0,"years":1})` | `{"current":-100,"series.last.netWorth":2300}` | `{"current":-100,"series.last.netWorth":2300}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N7 / extreme | `calculateNetWorth({"assets":1000000000,"debts":100000000,"monthlySavings":10000,"monthlyDebtPaydown":5000,"assetReturnPercent":10,"debtInterestPercent":0,"years":30})` | `{"current":900000000,"series.last.netWorth":19761804252.54868}` | `{"current":900000000,"series.last.netWorth":19761804252.548466}` | ±0.019761804; **MATCH** | Separate assets/debt cash-flow conservation |
| N8 / extreme | `calculateNetWorth({"assets":0,"debts":10000,"monthlySavings":0,"monthlyDebtPaydown":0,"assetReturnPercent":0,"debtInterestPercent":30,"years":30})` | `{"current":-10000,"series.last.netWorth":-72542336.7462336}` | `{"current":-10000,"series.last.netWorth":-72542336.74623133}` | ±0.01; **MATCH** | Separate assets/debt cash-flow conservation |
| N9 / invalid | `calculateNetWorth({"assets":100,"debts":-100,"monthlySavings":0,"monthlyDebtPaydown":0,"assetReturnPercent":0,"debtInterestPercent":0})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Reject negative liability; permit negative net worth |

## budget

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| B1 / normal | `calculateBudget({"monthlyIncome":5000,"categories":[{"name":"Category 0","amount":1500},{"name":"Category 1","amount":2200}]})` | `{"expenses":3700,"surplus":1300,"savingsRate":26}` | `{"expenses":3700,"surplus":1300,"savingsRate":26}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B2 / normal | `calculateBudget({"monthlyIncome":5000,"categories":[{"name":"Category 0","amount":3000},{"name":"Category 1","amount":2500}]})` | `{"expenses":5500,"surplus":-500,"savingsRate":-10}` | `{"expenses":5500,"surplus":-500,"savingsRate":-10}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B3 / normal | `calculateBudget({"monthlyIncome":3000,"categories":[{"name":"Category 0","amount":1000},{"name":"Category 1","amount":1000}]})` | `{"expenses":2000,"surplus":1000,"savingsRate":33.33333333}` | `{"expenses":2000,"surplus":1000,"savingsRate":33.33333333}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B4 / edge | `calculateBudget({"monthlyIncome":0,"categories":[{"name":"Category 0","amount":0}]})` | `{"expenses":0,"surplus":0,"savingsRate":null}` | `{"expenses":0,"surplus":0,"savingsRate":0}` | ±0.01; **MISMATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B5 / edge | `calculateBudget({"monthlyIncome":0,"categories":[{"name":"Category 0","amount":100}]})` | `{"expenses":100,"surplus":-100,"savingsRate":null}` | `{"expenses":100,"surplus":-100,"savingsRate":0}` | ±0.01; **MISMATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B6 / edge | `calculateBudget({"monthlyIncome":100,"categories":[]})` | `{"expenses":0,"surplus":100,"savingsRate":100}` | `{"expenses":0,"surplus":100,"savingsRate":100}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B7 / extreme | `calculateBudget({"monthlyIncome":1000000000,"categories":[{"name":"Category 0","amount":1},{"name":"Category 1","amount":2}]})` | `{"expenses":3,"surplus":999999997,"savingsRate":99.9999997}` | `{"expenses":3,"surplus":999999997,"savingsRate":99.9999997}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B8 / extreme | `calculateBudget({"monthlyIncome":0.01,"categories":[{"name":"Category 0","amount":0.01}]})` | `{"expenses":0.01,"surplus":0,"savingsRate":0}` | `{"expenses":0.01,"surplus":0,"savingsRate":0}` | ±0.01; **MATCH** | Direct cents arithmetic; undefined ratio at zero income |
| B9 / invalid | `calculateBudget({"monthlyIncome":100,"categories":[{"name":"Bad","amount":-10}]})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Negative expense currently diverges from chart |

## retirement

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| R1 / normal | `calculateRetirement({"currentAge":30,"retirementAge":65,"currentSavings":25000,"monthlyContribution":800,"annualReturnPercent":7,"monthlyNeed":4000})` | `{"nestEgg":1728497.47702178,"safeAnnualWithdrawal":69139.89908087}` | `{"nestEgg":1728497.47702179,"safeAnnualWithdrawal":69139.89908087}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R2 / normal | `calculateRetirement({"currentAge":40,"retirementAge":60,"currentSavings":100000,"monthlyContribution":500,"annualReturnPercent":5,"monthlyNeed":3000})` | `{"nestEgg":476780.86280604,"safeAnnualWithdrawal":19071.23451224}` | `{"nestEgg":476780.86280604,"safeAnnualWithdrawal":19071.23451224}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R3 / normal | `calculateRetirement({"currentAge":60,"retirementAge":65,"currentSavings":100000,"monthlyContribution":1000,"annualReturnPercent":0,"monthlyNeed":1000})` | `{"nestEgg":160000,"safeAnnualWithdrawal":6400}` | `{"nestEgg":160000,"safeAnnualWithdrawal":6400}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R4 / edge | `calculateRetirement({"currentAge":65,"retirementAge":65,"currentSavings":12000,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":1000})` | `{"nestEgg":12000,"safeAnnualWithdrawal":480}` | `{"nestEgg":12000,"safeAnnualWithdrawal":480}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R5 / edge | `calculateRetirement({"currentAge":65,"retirementAge":65,"currentSavings":0,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":1000})` | `{"nestEgg":0,"safeAnnualWithdrawal":0}` | `{"nestEgg":0,"safeAnnualWithdrawal":0}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R6 / edge | `calculateRetirement({"currentAge":30,"retirementAge":65,"currentSavings":0,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":0})` | `{"nestEgg":0,"safeAnnualWithdrawal":0}` | `{"nestEgg":0,"safeAnnualWithdrawal":0}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R7 / extreme | `calculateRetirement({"currentAge":20,"retirementAge":90,"currentSavings":1000000,"monthlyContribution":10000,"annualReturnPercent":15,"monthlyNeed":10000})` | `{"nestEgg":61248240543.60803,"safeAnnualWithdrawal":2449929621.7443213}` | `{"nestEgg":61248240543.60582,"safeAnnualWithdrawal":2449929621.7442327}` | ±0.061248241; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R8 / extreme | `calculateRetirement({"currentAge":65,"retirementAge":65,"currentSavings":100000000,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":1})` | `{"nestEgg":100000000,"safeAnnualWithdrawal":4000000}` | `{"nestEgg":100000000,"safeAnnualWithdrawal":4000000}` | ±0.01; **MATCH** | Independent end-month geometric series and withdrawal arithmetic |
| R9 / invalid | `calculateRetirement({"currentAge":65,"retirementAge":60,"currentSavings":100,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":1})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Impossible age order rejected |
| R10 / edge | `calculateRetirement({"currentAge":65,"retirementAge":65,"currentSavings":12000,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":1000})` | `{"monthsFundsLast":12}` | `{"monthsFundsLast":12}` | ±0.01; **MATCH** | Exact depletion |
| R11 / edge | `calculateRetirement({"currentAge":65,"retirementAge":65,"currentSavings":1000000,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":0,"lifeExpectancy":90})` | `{"monthsFundsLast":"Infinity"}` | `{"monthsFundsLast":300}` | ±0.01; **MISMATCH** | No withdrawals never deplete; current cap is not depletion |
| R12 / policy | `calculateRetirement({"currentAge":55,"retirementAge":65,"currentSavings":100000,"monthlyContribution":0,"annualReturnPercent":0,"monthlyNeed":300,"inflationPercent":10})` | `{"exceedsTarget":false}` | `{"exceedsTarget":true}` | ±0.01; **MISMATCH** | Proposed today-dollar monthlyNeed: at retirement 300*1.1^10 exceeds 333.33; ignored inflation currently reports true |

## savings-goal

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| G1 / normal | `calculateSavingsGoal({"goalAmount":50000,"alreadySaved":5000,"annualReturnPercent":4,"years":4})` | `{"monthlyRequired":849.39079221,"series.last.value":50000,"interestEarned":4229.24197395,"alreadyThere":false}` | `{"monthlyRequired":849.39079221,"series.last.value":50000.0,"interestEarned":4229.24197395,"alreadyThere":false}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G2 / normal | `calculateSavingsGoal({"goalAmount":12000,"alreadySaved":3000,"annualReturnPercent":0,"years":1})` | `{"monthlyRequired":750,"series.last.value":12000,"interestEarned":0,"alreadyThere":false}` | `{"monthlyRequired":750,"series.last.value":12000,"interestEarned":0,"alreadyThere":false}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G3 / normal | `calculateSavingsGoal({"goalAmount":100000,"alreadySaved":10000,"annualReturnPercent":6,"years":10})` | `{"monthlyRequired":499.18451747,"series.last.value":100000,"interestEarned":30097.85790302,"alreadyThere":false}` | `{"monthlyRequired":499.18451747,"series.last.value":100000.0,"interestEarned":30097.85790302,"alreadyThere":false}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G4 / edge | `calculateSavingsGoal({"goalAmount":10000,"alreadySaved":10000,"annualReturnPercent":0,"years":1})` | `{"monthlyRequired":0,"series.last.value":10000,"interestEarned":0,"alreadyThere":true}` | `{"monthlyRequired":0,"series.last.value":10000,"interestEarned":0,"alreadyThere":true}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G5 / edge | `calculateSavingsGoal({"goalAmount":10000,"alreadySaved":12000,"annualReturnPercent":5,"years":1})` | `{"monthlyRequired":0,"series.last.value":12613.94277458,"interestEarned":613.94277458,"alreadyThere":true}` | `{"monthlyRequired":0,"series.last.value":10200,"interestEarned":0,"alreadyThere":true}` | ±0.01; **MISMATCH** | Solve future-value gap; actual uncapped balance |
| G6 / edge | `calculateSavingsGoal({"goalAmount":10000,"alreadySaved":9000,"annualReturnPercent":12,"years":1})` | `{"monthlyRequired":0,"series.last.value":10141.42527119,"interestEarned":1141.42527119,"alreadyThere":false}` | `{"monthlyRequired":0,"series.last.value":10141.42527119,"interestEarned":1000,"alreadyThere":true}` | ±0.01; **MISMATCH** | Solve future-value gap; actual uncapped balance |
| G7 / extreme | `calculateSavingsGoal({"goalAmount":100000000,"alreadySaved":0,"annualReturnPercent":0,"years":50})` | `{"monthlyRequired":166666.66666667,"series.last.value":100000000,"interestEarned":0,"alreadyThere":false}` | `{"monthlyRequired":166666.66666667,"series.last.value":100000000,"interestEarned":0,"alreadyThere":false}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G8 / extreme | `calculateSavingsGoal({"goalAmount":1000000,"alreadySaved":0,"annualReturnPercent":40,"years":40})` | `{"monthlyRequired":0.00486932,"series.last.value":1000000,"interestEarned":999997.66272792,"alreadyThere":false}` | `{"monthlyRequired":0.00486932,"series.last.value":1000000.0,"interestEarned":999997.66272792,"alreadyThere":false}` | ±0.01; **MATCH** | Solve future-value gap; actual uncapped balance |
| G9 / invalid | `calculateSavingsGoal({"goalAmount":1000,"alreadySaved":0,"annualReturnPercent":0,"years":0})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Zero time cannot accept finite monthly solution |
| G10 / edge | `calculateSavingsGoal({"goalAmount":12000,"alreadySaved":0,"annualReturnPercent":0,"years":1.5})` | `{"monthlyRequired":666.66666667,"series.last.value":12000}` | `{"monthlyRequired":666.66666667,"series.last.value":8000}` | ±0.01; **MISMATCH** | 18 months should have matching terminal point |
| G11 / edge | `calculateSavingsGoal({"goalAmount":10000,"alreadySaved":1000,"annualReturnPercent":-12,"years":1})` | `{"monthlyRequired":802.14802958,"series.last.value":10000,"interestEarned":-625.7763549,"alreadyThere":false}` | `{"monthlyRequired":802.14802958,"series.last.value":10200,"interestEarned":0,"alreadyThere":false}` | ±0.01; **MISMATCH** | Signed growth and same negative-rate model in chart |

## debt-snowball

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| D1 / normal | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":4200,"rate":19.9,"minimumPayment":120},{"id":"1","name":"Debt 1","balance":3500,"rate":12,"minimumPayment":110},{"id":"2","name":"Debt 2","balance":11000,"rate":6.5,"minimumPayment":265}],"monthlyBudget":800,"method":"snowball"})` | `{"months":26,"totalInterest":2075.2295169}` | `{"months":27,"totalInterest":2103.92056681}` | ±0.01; **MISMATCH** | Full budget conserved; same-month leftover rolls forward |
| D2 / normal | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":4200,"rate":19.9,"minimumPayment":120},{"id":"1","name":"Debt 1","balance":3500,"rate":12,"minimumPayment":110},{"id":"2","name":"Debt 2","balance":11000,"rate":6.5,"minimumPayment":265}],"monthlyBudget":800,"method":"avalanche"})` | `{"months":26,"totalInterest":1883.83962012}` | `{"months":27,"totalInterest":1916.15698894}` | ±0.01; **MISMATCH** | Full budget conserved; same-month leftover rolls forward |
| D3 / normal | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":1000,"rate":12,"minimumPayment":100}],"monthlyBudget":100,"method":"snowball"})` | `{"months":11,"totalInterest":58.98488001}` | `{"months":11,"totalInterest":58.98488001}` | ±0.01; **MATCH** | Full budget conserved; same-month leftover rolls forward |
| D4 / edge | `calculateDebtSnowball({"debts":[],"monthlyBudget":0,"method":"snowball"})` | `{"months":0,"totalInterest":0}` | `{"months":0,"totalInterest":0}` | ±0.01; **MATCH** | Full budget conserved; same-month leftover rolls forward |
| D5 / edge | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":100,"rate":0,"minimumPayment":10},{"id":"1","name":"Debt 1","balance":100,"rate":0,"minimumPayment":10}],"monthlyBudget":200,"method":"snowball"})` | `{"months":1,"totalInterest":0}` | `{"months":2,"totalInterest":0}` | ±0.01; **MISMATCH** | Full budget conserved; same-month leftover rolls forward |
| D6 / edge | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":100,"rate":0,"minimumPayment":60},{"id":"1","name":"Debt 1","balance":100,"rate":0,"minimumPayment":60}],"monthlyBudget":100,"method":"snowball"})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Full budget conserved; same-month leftover rolls forward |
| D7 / extreme | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":100000000,"rate":20,"minimumPayment":2000000}],"monthlyBudget":2000000,"method":"avalanche"})` | `{"months":109,"totalInterest":116801925.53749579}` | `{"months":109,"totalInterest":116801925.5374958}` | ±0.01; **MATCH** | Full budget conserved; same-month leftover rolls forward |
| D8 / extreme | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":600,"rate":0,"minimumPayment":1}],"monthlyBudget":1,"method":"snowball"})` | `{"months":600,"totalInterest":0,"budgetTooLow":false}` | `{"months":600,"totalInterest":0,"budgetTooLow":true}` | ±0.01; **MISMATCH** | Full budget conserved; same-month leftover rolls forward |
| D9 / invalid | `calculateDebtSnowball({"debts":[{"id":"0","name":"Debt 0","balance":100,"rate":0,"minimumPayment":10}],"monthlyBudget":0})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Outstanding debt plus no payment is not zero-month payoff |
| D10 / edge | `calculateDebtSnowball({"debts":[{"id":"a","name":"Card","balance":10,"rate":0,"minimumPayment":10},{"id":"b","name":"Card","balance":20,"rate":0,"minimumPayment":20}],"monthlyBudget":30})` | `{"payoffOrder.length":2}` | `{"payoffOrder.length":1}` | ±0.01; **MISMATCH** | Distinct debt IDs with same name must both appear |

## rent-vs-buy

| ID / type | Function and exact inputs | Independent expected result | Observed result | Tolerance / verdict | Why it matters |
|---|---|---|---|---|---|
| V1 / normal | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":800,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":1})` | `{"monthlyMortgage":800,"buyAtHorizon":33600,"rentAtHorizon":24000}` | `{"monthlyMortgage":800,"buyAtHorizon":33600,"rentAtHorizon":24000}` | ±0.01; **MATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V2 / normal | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":400,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":1})` | `{"monthlyMortgage":800,"buyAtHorizon":33600,"rentAtHorizon":28800}` | `{"monthlyMortgage":800,"buyAtHorizon":33600,"rentAtHorizon":28800}` | ±0.01; **MATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V3 / normal | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":6,"monthlyRent":800,"appreciationPercent":3,"investmentReturnPercent":5,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":5})` | `{"monthlyMortgage":1065.79681864,"buyAtHorizon":83983.95082508,"rentAtHorizon":48876.40875134}` | `{"monthlyMortgage":1065.79681864,"buyAtHorizon":83983.95082508,"rentAtHorizon":48876.40875134}` | ±0.01; **MATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V4 / edge | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":800,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":11})` | `{"monthlyMortgage":800,"buyAtHorizon":129600,"rentAtHorizon":24000}` | `{"monthlyMortgage":800,"buyAtHorizon":120000,"rentAtHorizon":24000}` | ±0.01; **MISMATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V5 / edge | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":100,"mortgageRatePercent":0,"monthlyRent":0,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":1})` | `{"monthlyMortgage":0,"buyAtHorizon":120000,"rentAtHorizon":120000}` | `{"monthlyMortgage":0,"buyAtHorizon":120000,"rentAtHorizon":120000}` | ±0.01; **MATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V6 / edge | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":800,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":0})` | `{"monthlyMortgage":800,"buyAtHorizon":24000,"rentAtHorizon":24000}` | `{"monthlyMortgage":800,"buyAtHorizon":0,"rentAtHorizon":24000}` | ±0.01; **MISMATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V7 / extreme | `calculateRentVsBuy({"homePrice":100000000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":100000,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":30})` | `{"monthlyMortgage":666666.66666667,"buyAtHorizon":123999999.99999999,"rentAtHorizon":87999999.99999999}` | `{"monthlyMortgage":666666.66666667,"buyAtHorizon":100000000,"rentAtHorizon":223999999.9999989}` | ±0.01; **MISMATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V8 / extreme | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":1000,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":5,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":50})` | `{"monthlyMortgage":800,"buyAtHorizon":2536175.94858088,"rentAtHorizon":24000}` | `{"monthlyMortgage":800,"buyAtHorizon":120000,"rentAtHorizon":24000}` | ±0.01; **MISMATCH** | Equal-budget cash flows; actual payment stops at payoff |
| V9 / invalid | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":110,"mortgageRatePercent":0,"monthlyRent":800,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":1})` | `{"error":true}` | `{"error":null}` | ±0.01; **MISMATCH** | Down payment above price must reject |
| V10 / edge | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":0,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":11})` | `{"costRows.2.buy":96000,"rentAtHorizon":120000}` | `{"costRows.2.buy":105600,"rentAtHorizon":129600}` | ±0.01; **MISMATCH** | Mortgage spending stops after month 120; current costRows includes 105600 |
| V11 / normal | `calculateRentVsBuy({"homePrice":120000,"downPaymentPercent":20,"mortgageRatePercent":0,"monthlyRent":1000,"appreciationPercent":0,"investmentReturnPercent":0,"rentIncreasePercent":0,"loanTermYears":10,"annualPropertyTax":0,"annualInsurance":0,"annualMaintenance":0,"closingCostPercent":0,"monthlyRenterInsurance":0,"yearsToStay":1})` | `{"buyAtHorizon":36000,"rentAtHorizon":24000}` | `{"buyAtHorizon":33600,"rentAtHorizon":24000}` | ±0.01; **MISMATCH** | Buyer invests 200 monthly under proposed equal-budget model |

## Additional required tests — specified, not executed in browser

| Layer / test | Inputs/actions | Expected result / tolerance | Reason |
|---|---|---|---|
| All UI fields | Clear required amount; type `12abc`, `1e3`, `--1`, decimal cents | Validation; no silent12/13/stale value; cents retained exactly | Current parser strips characters and rounds display |
| All engines | Each numeric field separately NaN, ±Infinity, null, string; huge rates causing overflow | Structured invalid result; no exception leak/graph NaN | Finite checks before arithmetic and loops |
| Restoration | Wrong object shape, negative money, duplicate IDs, unsupported enums/year/state, oversized list | Reject with recoverable message; no partial unsafe state | URL and local saves are calculation entry points |
| Stored record | Malformed JSON and missing categories/debts | Recover safely; offer clearing only affected record | Current JSON.parse is unguarded |
| Mortgage display | Default calculate; switch fees; annual vs monthly vs CSV | P&I2022.617675 remains; fees separately750 gives2772.617675; row sums within1cent | Every displayed field shares one result |
| Mortgage reconciliation | Sum360 principal/interest rows, yearly grouping and final point | 320000 principal;408142.363064 interest; terminal0±.01 | Default does not prove every rate/term |
| All mortgage terms |10,15,20,30 years; zero and near-zero rate | Exact row count=12×years; final zero; discounted PV matches principal±.01 | Exercise UI domain and numerical stability |
| Investment frequencies |10000 lump sum,5%,10y, all five frequencies | FV=10000(1+.05/k)^(10k), ±.01 | Frequency and copy must agree |
| Investment steps |0 initial,100/month,0% return,10% annual contribution increase,2y |2520 total, no growth; first increase month13 | Contribution anniversary |
| Cross accumulation | Identical starting amount, contributions, nominal rate, years in investment/retirement/net-worth with debt0 and debt-payment0 | Equal terminal balances±.01 | Consistent timing and rate conversion |
| Cross goal | Feed goal required contribution into investment with same rate/horizon | Terminal≥target and overshoot less than chosen rounding allowance | Inverse consistency, not independent oracle replacement |
| Salary state | Select2026NC; compare to2025NC | Separate verified year logic or removed state approximation; no shared stale rate | Current year toggle does not version states |
| Salary surcharge | Single/HOH wages200000±.01 and MFJ250000±.01 | Annual surcharge=.009×max(0,wages−threshold); cents displayed per policy | Threshold vs employer200k withholding |
| Salary worker cap | Two MFJ workers each100000 | Each worker SS6200, combined12400; do not cap household at11439 | Only if spouse-income support is implemented |
| Salary exemptions | Dependent, older/blind filer, self-employed and itemized scenarios | Clear unsupported-scope message or real tested model | Base standard deduction not universal |
| Salary chart |75000 gross,10000 traditional401k,2000 eligible cafeteria | Net+federal+state+SS+Medicare+deductions=gross±.01 | Deductions missing from current donut |
| Salary period units |40h,48weeks; switch weekly and biweekly | Label paid-week vs calendar-average explicitly or normalize | Mixed denominators |
| Loan negative amortization |1000,12%,payment5 | First balance1005 if modeled; else nonamortizing result, no flat1000 graph | Chart current replay freezes balance |
| Loan schedule | Default balance25000/rate8/payment500/extra100 | Full monthly rows or explicit sampled-month label; totals from full ledger | Sparse table not annual aggregation |
| Loan one-time |1000,12%,100 monthly,one-time500 at1 versus12 | Month1 interest10 before extra; later payment only if debt still active | Timing and unused extras |
| Payoff cap | Loan1201 at0%/$1; debt600 at0%/$1 | Loan horizon-exceeded at1200 or actual payoff1201; debt paid at600 | Boundaries must not lie about payoff |
| Net-worth groups | Home300000/mortgage240000; cash12000/invest45000 | Net117000; asset groups sum357000 | Equity double-counting guard |
| Budget mutations | Add duplicate Housing100; delete only one; clear all | Sum all rows exactly; deletion only selected row; empty expenses0 | Category names are not unique IDs |
| Budget denominators | Income5000,expenses3700 then income0 |26% remaining rate first; undefined second; spending donut sums3700 | Distinguish share of spending/income |
| Retirement inflation | Hold all inputs fixed, change inflation0→3% | Today-dollar output/target changes or field absent in nominal-only model | Current control no-op |
| Retirement spending policy | Nest750000,rate4%,need1000 vs2500 | First-year rate estimate30000 unchanged; drawdown follows declared chosen spending | Two distinct questions |
| Retirement survival |1m balance,zero return,zero need,age65/life90 | Survives300-month horizon; depletion month unavailable | Horizon is not time funds last |
| Savings helper exact600 | Goal600,saved0,return0,monthly1 | `monthsToGoal`=600 exactly, currently Infinity by direct replay | Off-by-one boundary; see supplemental reproductions |
| Savings milestones | Default50k/5k/4%/4y |100% attained at48mo despite floating-point noise | Annual-only strict comparison misses target |
| Debt same-name IDs | Two Cards IDs a/b with balances10/20,minimum10/20,budget30 | Both IDs cleared month1 | Name-based dedup loses row |
| Debt chart endpoint | A payoff at month1,2,4 or5 | Include terminal zero even not divisible by3 | Current UI filter loses endpoint |
| Debt method ties | Equal balances; equal APR; reordered entry | Documented deterministic original-order/ID tie behavior | No accidental unstable results |
| Dates | Reference2026-01-31,one month payoff | February2026, not March; leap-day and timezone tests | Debt setMonth uses day31 |
| Rent/buy chronology | Term10/stay11; selected1.5 years | No mortgage cost after120; accept18 months consistently or reject | Wrong post-payoff cash and fractional lookup |
| Rent/buy liquidation | Add explicit selling cost6000 to otherwise equal state | Net sale proceeds6000 lower; do not change gross-equity view silently | Define comparison asset basis |
| Rent/buy crossing | Exact equality at annual point; later reversal | First meets/exceeds vs first exceeds explicitly; no permanent advantage claim | Current strict > differs from copy |
| Sources | Every cited deep URL; versioned tax metadata | Correct claim/page/year;403 reported as unknown, not404 | Network and provenance checks separate |
| Guides | All numerical examples and calculator exercises | Independent values; same assumptions as configured CTA | Mortgage-generated example is not independent evidence |
| Live browser | All10 default and invalid scenarios on confirmed deployment/build | Rendered labels/charts/results match fixture and source manifest | Not executed: no browser, DNS access failed |

## Reproduce the reference run without editing application code

From the repository root, save the following two code blocks to `/private/tmp/moneybasis-reference.py` and `/private/tmp/moneybasis-audit-runner.cjs`. They write only temporary fixture/results JSON. Run Python first, then Node. The code uses the repository’s installed TypeScript transpiler; it does not install dependencies. Expected errors in this audit runner accept any thrown exception; production tests must require the intended validation error, never treat a random crash as success.

```sh
python3 /private/tmp/moneybasis-reference.py
node /private/tmp/moneybasis-audit-runner.cjs
```

### Independent reference generator

```python
import json, math
from decimal import Decimal, getcontext
getcontext().prec=50
D=lambda x:Decimal(str(x))
cases=[]
def add(id,kind,mod,fn,inp,expected,why,tol=.01,args=None):
 cases.append(dict(id=id,kind=kind,module=mod,fn=fn,args=args or [inp],expected=expected,why=why,tolerance=tol))
def fv(p,c,r,n):
 p,c,r=D(p),D(c),D(r)/1200
 return float(p*(1+r)**n+c*(sum((1+r)**k for k in range(n))))
def payment(p,r,n):
 r=D(r)/1200
 return float(D(p)/sum((1+r)**(-k) for k in range(1,n+1)))
for i,(p,dp,r,y,kind) in enumerate([(400000,80000,6.5,30,'normal'),(300000,60000,5,15,'normal'),(300000,0,7,20,'normal'),(1200,0,0,10,'edge'),(100,100,0,10,'edge'),(100,99.99,5,10,'edge'),(100000000,0,12,30,'extreme'),(1000,0,.000001,30,'extreme')],1):
 e={'loanAmount':p-dp,'monthlyPayment':payment(p-dp,r,y*12),'totalInterest':payment(p-dp,r,y*12)*y*12-(p-dp),'months.last.balance':0} if p>dp else {'loanAmount':None}
 add(f'M{i}',kind,'mortgage','calculateMortgage',dict(homePrice=p,downPayment=dp,annualRatePercent=r,termYears=y),e,'Independent present-value payment; schedule reconciles',tol=.01)
add('M9','invalid','mortgage','calculateMortgage',dict(homePrice=100,downPayment=-10,annualRatePercent=5,termYears=10),{'error':True},'Negative down payment must be rejected')
add('M10','edge','mortgage','calculateMortgage',dict(homePrice=400000,downPayment=80000,annualRatePercent=6.5,termYears=30,annualPropertyTax=4800,annualInsurance=2400,monthlyHoa=100,monthlyPmi=50),{'estimatedMonthlyCost':payment(320000,6.5,360)+750},'Fees separate from principal and interest')
for i,(p,c,r,y,f,kind) in enumerate([(10000,500,7,20,'monthly','normal'),(10000,0,5,10,'annually','normal'),(0,100,12,1,'quarterly','normal'),(1000,100,0,1,'monthly','edge'),(0,0,7,20,'monthly','edge'),(1000,0,-12,1,'monthly','edge'),(100000000,100000,15,40,'monthly','extreme'),(1000,1,40,50,'daily','extreme')],1):
 k={'monthly':12,'annually':1,'quarterly':4,'daily':365}[f]; m=(1+D(r)/100/k)**(D(k)/12)-1
 val=float(D(p)*(1+m)**(12*y)+D(c)*sum((1+m)**n for n in range(12*y))); contrib=p+c*12*y
 add(f'I{i}',kind,'investment','calculateInvestment',dict(startingAmount=p,monthlyContribution=c,annualReturnPercent=r,years=y,compoundingFrequency=f),{'finalValue':val,'totalContributed':contrib,'interestEarned':val-contrib},'Geometric-series oracle; losses stay signed',tol=max(.01,abs(val)*1e-12))
add('I9','invalid','investment','calculateInvestment',dict(startingAmount=100,monthlyContribution=-5,annualReturnPercent=5,years=1),{'error':True},'Negative deposit must reject or become explicit withdrawal mode')
add('I10','edge','investment','calculateInvestment',dict(startingAmount=0,monthlyContribution=100,annualReturnPercent=0,years=2,contributionIncreasePercent=10,inflationPercent=3),{'finalValue':2520,'realFutureValue':2520/1.03**2},'Step up after first year and deflate once')
brackets={'single':([12400,50400,105700,201775,256225,640600],[16100]),'mfj':([24800,100800,211400,403550,512450,768700],[32200]),'hoh':([17700,67450,105700,201750,256200,640600],[24150])}
def sal(g,status='single',k=0,h=0,other=0):
 caps,ded=brackets[status]; t=max(0,g-k-h-other-ded[0]); prev=0; tax=0
 for cap,rate in zip(caps+[float('inf')],[.10,.12,.22,.24,.32,.35,.37]):
  tax+=max(0,min(t,cap)-prev)*rate;prev=cap
 ficaW=max(0,g-h-other); ss=min(ficaW,184500)*.062; med=ficaW*.0145+max(0,ficaW-(250000 if status=='mfj' else 200000))*.009
 return {'federalTax':tax,'socialSecurity':ss,'medicare':med,'netAnnual':g-k-h-other-tax-ss-med,'taxableIncome':t}
for i,(g,s,k,h,kind) in enumerate([(75000,'single',0,0,'normal'),(150000,'mfj',0,0,'normal'),(100000,'hoh',0,0,'normal'),(0,'single',0,0,'edge'),(16100,'single',0,0,'edge'),(184500,'single',0,0,'edge'),(1000000,'single',0,0,'extreme'),(1000000,'mfj',0,0,'extreme'),(75000,'single',10000,2000,'normal'),(300000,'single',0,0,'normal')],1):
 add(f'S{i}',kind,'salary','calculateSalary',dict(mode='salary',annualSalary=g,hoursPerWeek=40,weeksPerYear=52,filingStatus=s,taxYear=2026,traditional401k=k,healthInsurance=h),sal(g,s,k,h),'Independent IRS bracket slices, SSA cap and Additional Medicare liability')
add('S11','invalid','salary','calculateSalary',dict(mode='salary',annualSalary=75000,hoursPerWeek=40,weeksPerYear=0,filingStatus='single'),{'error':True},'Zero paid weeks cannot define weekly pay')
add('S12','normal','salary','calculateSalary',dict(mode='hourly',hourlyRate=30,hoursPerWeek=40,weeksPerYear=52,filingStatus='single'),{'annualSalary':62400,'hourlyRate':30},'Gross conversion exact')
for status,(caps,_) in brackets.items():
 for j,cap in enumerate(caps):
  g=cap+brackets[status][1][0]
  for delta in [-.01,0,.01]:
   add(f'SB-{status}-{j}-{delta}','boundary','salary','calculateSalary',dict(mode='salary',annualSalary=g+delta,hoursPerWeek=40,weeksPerYear=52,filingStatus=status),{'federalTax':sal(g+delta,status)['federalTax']},'Every supported bracket boundary',.000001)
def loan(p,r,pay,extra=0,start=1):
 bal=D(p); rate=D(r)/1200; interest=D(0); total=D(0); n=0
 while bal>D('.00000001') and n<1500:
  n+=1; intr=bal*rate; paid=min(D(pay)+(D(extra) if n==start else 0),bal+intr)
  if paid<=intr:return {'months':'Infinity'}
  interest+=intr;total+=paid;bal+=intr-paid
 return {'months':n,'interest':float(interest),'totalPaid':float(total)}
for i,(p,r,pay,kind) in enumerate([(25000,8,500,'normal'),(10000,12,300,'normal'),(10000,12,400,'normal'),(1000,0,300,'edge'),(1000,12,10,'edge'),(0,12,100,'edge'),(100000000,20,2000000,'extreme'),(1201,0,1,'extreme')],1):
 add(f'L{i}',kind,'loan-payoff','simulateLoan',None,loan(p,r,pay),'Decimal monthly ledger incl capped final payment',args=[p,r,pay])
add('L9','invalid','loan-payoff','simulateLoan',None,{'error':True},'Reject negative principal',args=[-100,12,100])
add('L10','edge','loan-payoff','simulateLoan',None,loan(1000,12,100,500,1),'Interest then one-time principal payment',args=[1000,12,100,{'oneTimeExtra':500,'startMonth':1}])
for i,(a,d,s,p,r,dr,y,kind) in enumerate([(150000,80000,1500,800,6,5,30,'normal'),(10000,1000,100,200,0,0,1,'normal'),(357000,240000,0,0,0,0,1,'normal'),(0,0,0,0,0,0,30,'edge'),(0,10000,0,0,0,0,30,'edge'),(0,100,0,200,0,0,1,'edge'),(1e9,1e8,10000,5000,10,0,30,'extreme'),(0,10000,0,0,0,30,30,'extreme')],1):
 ab=D(a);db=D(d)
 for m in range(y*12):
  due=db*(1+D(dr)/1200);paid=min(D(p),due);db=due-paid;ab=ab*(1+D(r)/1200)+D(s)+D(p)-paid
 add(f'N{i}',kind,'net-worth','calculateNetWorth',dict(assets=a,debts=d,monthlySavings=s,monthlyDebtPaydown=p,assetReturnPercent=r,debtInterestPercent=dr,years=y),{'current':a-d,'series.last.netWorth':float(ab-db)},'Separate assets/debt cash-flow conservation',tol=max(.01,abs(float(ab-db))*1e-12))
add('N9','invalid','net-worth','calculateNetWorth',dict(assets=100,debts=-100,monthlySavings=0,monthlyDebtPaydown=0,assetReturnPercent=0,debtInterestPercent=0),{'error':True},'Reject negative liability; permit negative net worth')
for i,(income,amounts,kind) in enumerate([(5000,[1500,2200],'normal'),(5000,[3000,2500],'normal'),(3000,[1000,1000],'normal'),(0,[0],'edge'),(0,[100],'edge'),(100,[],'edge'),(1e9,[1,2],'extreme'),(.01,[.01],'extreme')],1):
 add(f'B{i}',kind,'budget','calculateBudget',dict(monthlyIncome=income,categories=[dict(name='Category '+str(j),amount=v) for j,v in enumerate(amounts)]),{'expenses':sum(amounts),'surplus':income-sum(amounts),'savingsRate':(income-sum(amounts))/income*100 if income else None},'Direct cents arithmetic; undefined ratio at zero income')
add('B9','invalid','budget','calculateBudget',dict(monthlyIncome=100,categories=[dict(name='Bad',amount=-10)]),{'error':True},'Negative expense currently diverges from chart')
for i,(age,ret,p,c,r,need,kind) in enumerate([(30,65,25000,800,7,4000,'normal'),(40,60,100000,500,5,3000,'normal'),(60,65,100000,1000,0,1000,'normal'),(65,65,12000,0,0,1000,'edge'),(65,65,0,0,0,1000,'edge'),(30,65,0,0,0,0,'edge'),(20,90,1e6,10000,15,10000,'extreme'),(65,65,1e8,0,0,1,'extreme')],1):
 n=fv(p,c,r,(ret-age)*12)
 add(f'R{i}',kind,'retirement','calculateRetirement',dict(currentAge=age,retirementAge=ret,currentSavings=p,monthlyContribution=c,annualReturnPercent=r,monthlyNeed=need),{'nestEgg':n,'safeAnnualWithdrawal':n*.04},'Independent end-month geometric series and withdrawal arithmetic',tol=max(.01,n*1e-12))
add('R9','invalid','retirement','calculateRetirement',dict(currentAge=65,retirementAge=60,currentSavings=100,monthlyContribution=0,annualReturnPercent=0,monthlyNeed=1),{'error':True},'Impossible age order rejected')
add('R10','edge','retirement','calculateRetirement',dict(currentAge=65,retirementAge=65,currentSavings=12000,monthlyContribution=0,annualReturnPercent=0,monthlyNeed=1000),{'monthsFundsLast':12},'Exact depletion')
add('R11','edge','retirement','calculateRetirement',dict(currentAge=65,retirementAge=65,currentSavings=1000000,monthlyContribution=0,annualReturnPercent=0,monthlyNeed=0,lifeExpectancy=90),{'monthsFundsLast':'Infinity'},'No withdrawals never deplete; current cap is not depletion')
def goal(g,p,r,y):
 n=int(y*12); rate=D(r)/1200; growth=(1+rate)**n; c=max(D(0),(D(g)-D(p)*growth)/sum((1+rate)**k for k in range(n)))
 end=D(p)*growth+c*sum((1+rate)**k for k in range(n))
 return {'monthlyRequired':float(c),'series.last.value':float(end),'interestEarned':float(end-D(p)-c*n),'alreadyThere':p>=g}
for i,(g,p,r,y,kind) in enumerate([(50000,5000,4,4,'normal'),(12000,3000,0,1,'normal'),(100000,10000,6,10,'normal'),(10000,10000,0,1,'edge'),(10000,12000,5,1,'edge'),(10000,9000,12,1,'edge'),(1e8,0,0,50,'extreme'),(1e6,0,40,40,'extreme')],1):
 add(f'G{i}',kind,'savings-goal','calculateSavingsGoal',dict(goalAmount=g,alreadySaved=p,annualReturnPercent=r,years=y),goal(g,p,r,y),'Solve future-value gap; actual uncapped balance',tol=.01)
add('G9','invalid','savings-goal','calculateSavingsGoal',dict(goalAmount=1000,alreadySaved=0,annualReturnPercent=0,years=0),{'error':True},'Zero time cannot accept finite monthly solution')
# Scalar helper covered by dedicated evidence rather than result-object fields.
def debt(ds,budget,method):
 ds=sorted(ds,key=lambda d:(-d['rate'],d['balance']) if method=='avalanche' else (d['balance'],))
 bal=[D(d['balance']) for d in ds];interest=D(0);month=0; first=None
 if not any(bal):return {'months':0,'totalInterest':0}
 if budget<=0 or budget<sum(min(float(b),d['minimumPayment']) for b,d in zip(bal,ds)):return {'error':True}
 while any(b>D('.00000001') for b in bal) and month<601:
  month+=1; remaining=D(budget)
  for j,d in enumerate(ds):
   intr=bal[j]*D(d['rate'])/1200;interest+=intr;bal[j]+=intr
  for j,d in enumerate(ds):
   paid=min(bal[j],D(d['minimumPayment']),remaining);bal[j]-=paid;remaining-=paid
  for j,d in enumerate(ds):
   paid=min(bal[j],remaining);bal[j]-=paid;remaining-=paid
 return {'months':month,'totalInterest':float(interest)}
def ds(rows):return [dict(id=str(i),name='Debt '+str(i),balance=b,rate=r,minimumPayment=m) for i,(b,r,m) in enumerate(rows)]
default=[(4200,19.9,120),(3500,12,110),(11000,6.5,265)]
for i,(rows,b,method,kind) in enumerate([(default,800,'snowball','normal'),(default,800,'avalanche','normal'),([(1000,12,100)],100,'snowball','normal'),([],0,'snowball','edge'),([(100,0,10),(100,0,10)],200,'snowball','edge'),([(100,0,60),(100,0,60)],100,'snowball','edge'),([(1e8,20,2000000)],2000000,'avalanche','extreme'),([(600,0,1)],1,'snowball','extreme')],1):
 inp=dict(debts=ds(rows),monthlyBudget=b,method=method)
 e=debt(inp['debts'],b,method)
 if i==8:e['budgetTooLow']=False
 add(f'D{i}',kind,'debt-snowball','calculateDebtSnowball',inp,e,'Full budget conserved; same-month leftover rolls forward')
add('D9','invalid','debt-snowball','calculateDebtSnowball',dict(debts=ds([(100,0,10)]),monthlyBudget=0),{'error':True},'Outstanding debt plus no payment is not zero-month payoff')
# Independent symmetric comparison: equal disposable housing budget, whichever side spends less invests the difference.
def rb(x):
 price=D(x['homePrice']); down=price*D(x['downPaymentPercent'])/100; close=price*D(x.get('closingCostPercent',0))/100
 loan=price-down; rate=D(x['mortgageRatePercent'])/1200; pay=D(payment(loan,x['mortgageRatePercent'],x['loanTermYears']*12)); renter=down+close; buyer=D(0);rent=D(x['monthlyRent']); val=price
 for m in range(x['yearsToStay']*12):
  yr=m//12; growth=(1+D(x['appreciationPercent'])/100)**yr
  other=sum(D(x.get(k,0)) for k in ['annualPropertyTax','annualInsurance','annualMaintenance'])/12*growth
  actual=min(pay,loan*(1+rate)) if loan>0 else D(0); loan=max(D(0),loan*(1+rate)-actual)
  own=actual+other;rc=rent+D(x.get('monthlyRenterInsurance',0));ir=D(x['investmentReturnPercent'])/1200
  renter=renter*(1+ir)+max(D(0),own-rc);buyer=buyer*(1+ir)+max(D(0),rc-own)
  if m%12==11: val*=1+D(x['appreciationPercent'])/100;rent*=1+D(x['rentIncreasePercent'])/100
 return {'monthlyMortgage':float(pay),'buyAtHorizon':float(val-loan+buyer),'rentAtHorizon':float(renter)}
base=dict(homePrice=120000,downPaymentPercent=20,mortgageRatePercent=0,monthlyRent=800,appreciationPercent=0,investmentReturnPercent=0,rentIncreasePercent=0,loanTermYears=10,annualPropertyTax=0,annualInsurance=0,annualMaintenance=0,closingCostPercent=0,monthlyRenterInsurance=0,yearsToStay=1)
configs=[({},'normal'),({'monthlyRent':400},'normal'),({'mortgageRatePercent':6,'investmentReturnPercent':5,'appreciationPercent':3,'yearsToStay':5},'normal'),({'yearsToStay':11},'edge'),({'downPaymentPercent':100,'monthlyRent':0},'edge'),({'yearsToStay':0},'edge'),({'homePrice':1e8,'monthlyRent':100000,'yearsToStay':30},'extreme'),({'yearsToStay':50,'monthlyRent':1000,'rentIncreasePercent':5},'extreme')]
for i,(changes,kind) in enumerate(configs,1):
 x=base|changes;add(f'V{i}',kind,'rent-vs-buy','calculateRentVsBuy',x,rb(x),'Equal-budget cash flows; actual payment stops at payoff',tol=.01)
add('V9','invalid','rent-vs-buy','calculateRentVsBuy',base|dict(downPaymentPercent=110),{'error':True},'Down payment above price must reject')
json.dump(cases,open('/private/tmp/moneybasis-fixtures.json','w'),indent=2)
# Supplemental reproductions and policy fixtures.
for c in cases:
 if c['id']=='I8':c['tolerance']=50 # 1e-10 relative on a $494 billion hypothetical; not a cent-precision ledger.
add('M11','edge','mortgage','calculateMortgage',dict(homePrice=1200,downPayment=0,annualRatePercent=0,termYears=1.5),{'months.length':18,'months.last.balance':0},'If fractional years are accepted, generate all 18 months')
add('I11','edge','investment','calculateInvestment',dict(startingAmount=0,monthlyContribution=100,annualReturnPercent=0,years=1.5),{'finalValue':1800},'Prevent fractional-year headline/chart mismatch or reject fractional years')
add('G10','edge','savings-goal','calculateSavingsGoal',dict(goalAmount=12000,alreadySaved=0,annualReturnPercent=0,years=1.5),{'monthlyRequired':12000/18,'series.last.value':12000},'18 months should have matching terminal point')
add('G11','edge','savings-goal','calculateSavingsGoal',dict(goalAmount=10000,alreadySaved=1000,annualReturnPercent=-12,years=1),goal(10000,1000,-12,1),'Signed growth and same negative-rate model in chart')
add('R12','policy','retirement','calculateRetirement',dict(currentAge=55,retirementAge=65,currentSavings=100000,monthlyContribution=0,annualReturnPercent=0,monthlyNeed=300,inflationPercent=10),{'exceedsTarget':False},'Proposed today-dollar monthlyNeed: at retirement 300*1.1^10 exceeds 333.33; ignored inflation currently reports true')
add('D10','edge','debt-snowball','calculateDebtSnowball',dict(debts=[dict(id='a',name='Card',balance=10,rate=0,minimumPayment=10),dict(id='b',name='Card',balance=20,rate=0,minimumPayment=20)],monthlyBudget=30),{'payoffOrder.length':2},'Distinct debt IDs with same name must both appear')
add('V10','edge','rent-vs-buy','calculateRentVsBuy',base|dict(yearsToStay=11,monthlyRent=0),{'costRows.2.buy':96000,'rentAtHorizon':120000},'Mortgage spending stops after month 120; current costRows includes 105600')
add('V11','normal','rent-vs-buy','calculateRentVsBuy',base|dict(monthlyRent=1000),{'buyAtHorizon':36000,'rentAtHorizon':24000},'Buyer invests 200 monthly under proposed equal-budget model')
json.dump(cases,open('/private/tmp/moneybasis-fixtures.json','w'),indent=2)

```

### Current-implementation observation runner

```javascript
const fs=require('fs'),path=require('path'),Module=require('module');
const root=process.cwd(),ts=require(path.join(root,'node_modules/typescript'));
const original=Module._resolveFilename;
Module._resolveFilename=function(request,parent,...rest){return original.call(this,request.startsWith('@/')?path.join(root,request.slice(2)):request,parent,...rest)};
require.extensions['.ts']=function(m,f){m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f)};
const modules={}; for(const name of ['mortgage','investment','salary','loan-payoff','net-worth','budget','retirement','savings-goal','debt-snowball','rent-vs-buy']) modules[name]=require(path.join(root,'lib/calculators',name+'.ts'));
const catalog=require(path.join(root,'lib/calculators/catalog.ts')).calculatorList;
const guides=require(path.join(root,'lib/guides/catalog.ts')).guides;
fs.writeFileSync('/private/tmp/moneybasis-inventory.json',JSON.stringify({catalog,guides},null,2));
if(fs.existsSync('/private/tmp/moneybasis-fixtures.json')) {
 const cases=JSON.parse(fs.readFileSync('/private/tmp/moneybasis-fixtures.json'));
 for(const c of cases){try{const r=modules[c.module][c.fn](...c.args);c.observed={};for(const k of Object.keys(c.expected)){let v=k.split('.').reduce((o,p)=>o?.[p==='last'?o.length-1:p],r); c.observed[k]= typeof v==='number'&&!Number.isFinite(v)?String(v):v??null}c.pass=Object.entries(c.expected).every(([k,v])=>typeof v==='number'?Math.abs(c.observed[k]-v)<=(c.tolerance??.01):c.observed[k]===v)}catch(e){c.observed={error:e.message};c.pass=!!c.expected.error}}
 fs.writeFileSync('/private/tmp/moneybasis-results.json',JSON.stringify(cases,null,2));console.log(JSON.stringify(cases.map(c=>({id:c.id,pass:c.pass,expected:c.expected,observed:c.observed})),null,2));
}

```

## Supplemental direct reproductions

The following small direct probes were also executed after the160-case run; they are not included in its123/37 count:

| Probe | Observed | Independent interpretation |
|---|---|---|
| `monthsToGoal({goalAmount:600,alreadySaved:0,annualReturnPercent:0,years:50},1)` | Infinity |600monthly dollars fund600dollars exactly at month600; off-by-one confirmed |
| Retirement default inputs, inflation0% vs10%; compare entire result JSON | Identical | Enabled inflation parameter is ignored, regardless of eventual chosen dollar-basis policy |
| Two100dollar zero-rate debts,60dollar minimums,100dollar total budget | First month remaining total80 |120paid from a100budget; conservation failure confirmed |
| Loan1000,12%,payment5,extra0 | Chart month3 still1000 | With unpaid interest capitalized, balance should grow; unsupported case must not display flat debt |
| Local date January31,2026 noon; current debt-style `setMonth(+1)` | March3,2026 | One-month payoff should display February under a calendar-month convention |
