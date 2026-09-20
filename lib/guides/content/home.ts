import type { GuideContent } from '../types';
import { money as m } from '../numbers';
export const homeGuides: GuideContent[] = [
{
  slug: 'mortgage-amortization', title: 'How Mortgage Amortization Works', seoTitle: 'How Mortgage Amortization Works',
  description: 'Follow a fixed-rate mortgage from its first payment to its last, with principal, interest, escrow and annual balance examples.',
  summary: 'See how the same loan payment gradually shifts from interest to principal.',
  intro: 'A fixed mortgage payment can hide a changing story. As the balance falls, less of each payment goes to interest and more goes toward owning the home outright.',
  takeaway: 'The principal-and-interest payment can stay fixed while its composition changes. Taxes, insurance and other ownership costs sit outside that amortization calculation.',
  category: 'Home & Mortgage', relatedCalculator: 'mortgage', calculatorAssociations: ['mortgage','loan-payoff','rent-vs-buy'], reviewedAt: '2026-09-18',
  relatedGuides: ['loan-prepayments','apr-vs-apy','rent-vs-buy-costs'], ogHeadline: 'Where your mortgage payment goes', ogSubheadline: 'Principal, interest and the balance over time.', fixtureIds: ['mortgage'],
  sections: [
    {id:'balance-and-payment',heading:'The balance is what you owe; the payment is a cash flow',body:`Principal is the amount borrowed that remains unpaid. Interest is the charge for borrowing that amount over a period. Amortization is the process of reducing the balance through scheduled payments until the loan is repaid.

For a fully amortizing fixed-rate loan, the scheduled principal-and-interest payment is calculated from the original loan amount, the note interest rate and the number of payments. The lender does not divide the original principal evenly and then add a constant interest charge. Instead, interest is calculated on the remaining balance. Whatever is left of the payment reduces principal.

A large payment does not necessarily mean a large reduction in debt. The interest portion must be accounted for first. Conversely, a late payment in the schedule can remove much more principal than an early payment of the same size.`,sources:['mortgage']},
    {id:'rate-and-timing',heading:'Use the note rate and name the timing',body:`The note rate determines interest under the loan contract. Mortgage APR is a broader annualized borrowing-cost measure that incorporates specified fees and charges. Substituting a disclosure APR for the note rate can produce the wrong principal-and-interest payment. MoneyBasis’s mortgage field asks for the annual note interest rate.

The planning model divides that annual rate by twelve. Each month, it applies interest to the opening balance and then subtracts the payment at month end. Real servicing statements can reflect different dates, rounding, escrow adjustments or contract terms. This is a monthly planning schedule, not a payoff quote.

At a zero note rate, there is no interest allocation: principal divided by the number of monthly payments gives the payment. If the down payment equals the purchase price, there is no mortgage balance to amortize. That does not remove property taxes, maintenance or insurance.`,sources:['apr']},
    {id:'example',heading:'Worked example: a $320,000 loan at 6.5%',body:`Consider an illustrative $400,000 home with $80,000 down. The original loan is $320,000, the fixed note rate is 6.5%, and the term is 30 years, or 360 monthly payments. The calculated principal-and-interest payment is ${m('mortgage.payment')} when displayed to cents.

First-month interest is $320,000 × 0.065 ÷ 12 = ${m('mortgage.firstInterest')}. Subtracting that interest from the unrounded payment leaves ${m('mortgage.firstPrincipal')} of principal. The next month begins with a smaller balance, so its interest charge is smaller too. No extra payment is needed for this change in composition; it follows from the scheduled amortization itself.

The annual snapshots below show payments made during each selected year, with the remaining balance measured after that year’s final payment. Total interest across the full term is ${m('mortgage.totalInterest')} under these assumptions. Intermediate calculations retain precision; displaying every amount to cents can create small differences when rounded cells are added.`,exhibits:['mortgage']},
    {id:'housing-cost',heading:'Escrow and ownership costs are separate',body:`An escrow account collects money for bills such as property taxes and homeowners insurance. Those collections do not pay down loan principal. Even when principal and interest stay fixed, changes in those bills can change the total amount collected by the mortgage servicer.

For example, $4,800 of annual property tax and $2,400 of annual insurance add $600 per month to a planning estimate. Adding $100 of monthly HOA dues and $50 of monthly PMI makes the example’s entered monthly cost ${m('mortgage.totalCost')}. HOA dues may be paid separately rather than through the servicer. Maintenance is another ownership cost and is not part of that mortgage payment estimate.

Private mortgage insurance protects the lender against specified loss; it is not insurance that pays the borrower’s mortgage. Its cost and cancellation conditions depend on the loan. MoneyBasis keeps an entered monthly PMI amount in the cost estimate; it does not automatically determine when PMI can end.`,sources:['housing','pmi']},
    {id:'changing-the-loan',heading:'Extra principal, recasting and refinancing do different things',body:`An extra amount applied to principal reduces the balance sooner. With the scheduled payment otherwise unchanged, the loan can end earlier and incur less future interest. Sending extra money does not by itself establish that the lender will lower the required payment. Payment instructions and the loan contract determine how a real servicer applies it.

A recast generally recalculates scheduled payments over the remaining term after a principal reduction, while retaining the existing loan’s rate. Availability, minimum principal reduction and fees are lender-specific. Refinancing replaces the existing loan with a new one; the new rate, term and transaction costs change the comparison. Neither action is simulated by simply adding an extra payment to this amortization schedule.

A shorter term can also change both the payment and total interest. To isolate the term effect in the calculator, hold principal and note rate constant while comparing terms. Actual loan offers may quote different rates, so that controlled comparison is an explanation of the math rather than a prediction of available financing.`,sources:['housing','recast']},
    {id:'reading-the-schedule',heading:'Read the schedule without confusing payment and cost',body:`The principal column measures debt reduction. The interest column measures borrowing cost for that period. A year-end balance is a stock of outstanding debt, so it cannot be added to annual payments as though it were another annual expense.

The schedule assumes the stated fixed rate, timely monthly payments and no changes in the loan contract. It excludes tax benefits, sale expenses, investment opportunity costs and future changes in property expenses. Those omissions matter when comparing housing decisions, even though they do not change the principal-and-interest arithmetic shown here.`},
  ],
  exercise: 'Enter a $400,000 price, $80,000 down, 6.5% note rate and 30-year term. Leave taxes, insurance, HOA and PMI at zero to reproduce the schedule. Compare the first payment with year 20. Then switch only the term to 15 years, and finally add your separately estimated ownership costs.',
},
{
  slug:'rent-vs-buy-costs',title:'Rent vs Buy: Compare Cash Costs, Equity and Opportunity Cost',seoTitle:'Rent vs Buy: Cash Costs, Equity and Opportunity Cost',
  description:'Understand MoneyBasis’s equal-resource rent-versus-buy model, including both investment portfolios, mortgage payoff and excluded selling costs.',
  summary:'Follow the same starting money and monthly resources down two housing paths.',
  intro:'A rent payment and a mortgage payment do not buy the same financial result. A useful comparison follows cash costs, remaining debt, home equity and investments on both paths.',
  takeaway:'MoneyBasis compares equal starting resources and equal monthly available resources. Whichever path spends less on housing invests the difference, including the owner after mortgage payoff.',
  category:'Home & Mortgage',relatedCalculator:'rent-vs-buy',calculatorAssociations:['rent-vs-buy','mortgage','net-worth'],reviewedAt:'2026-09-18',relatedGuides:['mortgage-amortization','net-worth','nominal-vs-real-return'],ogHeadline:'Rent, buy and the money between',ogSubheadline:'Cash costs, equity and two investment portfolios.',fixtureIds:['rent-buy-1','rent-buy-10','rent-buy-11','rent-buy-cheaper-owner','rent-buy-cheaper-renter'],
  sections:[
    {id:'same-resources',heading:'Start both paths with the same resources',body:`The buying path uses cash for a down payment and closing costs. The renting path begins with that same combined amount invested. Without this starting-resource match, a comparison could give one side more money before either household pays its first housing bill.

A down payment converts cash into home equity; it is not immediately consumed in the way a closing fee is. Closing costs reduce the buyer’s starting financial position in this model. The renter’s invested starting amount remains exposed to the selected investment-return assumption, which can be positive, zero or negative.

Every month, the model sets a common available resource budget equal to the larger of the two housing cash outflows. The side with the smaller outflow invests the difference after that month’s portfolio growth. This budget is shared between scenarios for comparison; it is not a claim that a household can afford either amount.`},
    {id:'two-paths',heading:'Trace the two cash-flow paths',body:`BUY: starting cash → down payment plus closing costs → home equity. Monthly resources → actual mortgage payment plus property tax, homeowners insurance and maintenance → any remainder into an owner investment portfolio.

RENT + INVEST: the same starting cash → renter investment portfolio. The same monthly resources → rent plus renters insurance → any remainder into that portfolio.

At the comparison date, buyer net position is home value minus remaining mortgage plus the owner portfolio. Renter net position is the renter portfolio. These are estimated ending net positions under these assumptions. They are not lifetime utility scores: location, flexibility, moving plans, responsibility for repairs and the value of living in a particular home are outside the arithmetic.`,exhibits:['rent-buy']},
    {id:'example',heading:'Worked example: expose the bookkeeping with zero rates',body:`Use a $120,000 home, 20% down ($24,000), and a $96,000 mortgage repaid over ten years at zero interest. Set monthly rent to $800. For this teaching example only, set closing costs, property taxes, both insurance inputs, maintenance, appreciation, rent growth and investment returns to zero. These are deliberately incomplete housing costs, not a market scenario.

Both paths start with $24,000. The buyer holds it as equity; the renter holds it as an investment balance. For the first ten years, both spend $800 monthly. Every mortgage dollar reduces principal, so after one year buyer equity is $33,600 while the renter portfolio remains $24,000. After ten years the loan is paid off and buyer equity is $120,000.

In year eleven the owner no longer makes a mortgage payment. The renter still pays $800 monthly, so the owner invests that same $800 of available monthly resources. The owner portfolio reaches $9,600 and buyer net position reaches $129,600. The renter portfolio remains $24,000. Continuing to charge a mortgage after payoff, or failing to invest the owner’s freed cash, would describe a different comparison.

The symmetry also works before payoff. With rent changed to $1,000, the owner invests $200 each month and ends year one at $36,000. With rent changed instead to $400, the renter invests $400 each month and ends year one at $28,800, while buyer equity is $33,600. These are separate sensitivity cases; all other assumptions remain zero.`},
    {id:'costs-and-equity',heading:'Principal is a cash outflow that builds equity',body:`Mortgage principal consumes monthly cash but reduces a liability. Interest is a borrowing cost. Property tax, insurance and maintenance are additional ownership outflows that do not automatically create equal amounts of equity. A repair can preserve a home’s usability without increasing its resale value dollar for dollar.

The calculator includes the entered ownership expenses and renter insurance. It does not include HOA dues, PMI, selling costs, income-tax effects or moving expenses in this rent-versus-buy engine. The mortgage calculator has some different cost fields; an expense appearing there does not mean the rent-versus-buy calculation automatically includes it.

Equity is home value minus mortgage debt before any omitted sale costs. Accessing it may require a sale or borrowing, with time, eligibility and costs involved. A property-heavy net position therefore does not mean that the same amount is immediately available for groceries or an unexpected bill.`,sources:['housing']},
    {id:'growth-assumptions',heading:'Growth assumptions act on different balances',body:`Home appreciation changes the modeled property value using an effective annual rate. Rent increases occur annually. Entered annual property tax, homeowners insurance and maintenance also increase annually with the home-appreciation assumption in this simplified model; they do not have separate inflation controls.

Investment return uses the nominal annual rate divided by twelve, with monthly compounding in both portfolios. Down-payment opportunity cost therefore depends on a different rate convention from property appreciation. Giving both fields the same numeric percentage does not make their mathematical growth factors identical.

Real expenses need not follow property value, and investment returns need not arrive smoothly. Constant rates are scenario controls, not market averages. Comparing several individually labeled scenarios can reveal which assumptions drive the result without pretending to attach a probability to each one.`},
    {id:'horizon-and-crossover',heading:'The horizon matters, and a crossover can reverse',body:`Closing costs are paid near the beginning, while mortgage reduction, portfolio growth and recurring expenses accumulate over time. Changing the stay length changes how much time each has to affect the ending positions. A result at one year cannot simply be multiplied to estimate a result at ten years.

MoneyBasis reports the first sampled point at which the buyer position meets or exceeds the renter position under the selected assumptions. That crossing need not be permanent: later cash flows, the end of mortgage payments, changing relative costs and different growth rates can change the relationship again. Equality is included; the label does not mean a unique irreversible turning point.

Before interpreting the result as cash available after moving, separately identify the omitted selling and transaction costs. The displayed buyer position has not been reduced to estimated net sale proceeds. The calculator also does not model a tax deduction or capital-gains treatment. A comparison of modeled asset positions remains useful as long as those boundaries stay visible.`},
  ],exercise:'Reproduce the zero-rate example with a $120,000 price, 20% down, ten-year term and $800 rent. Set every cost and growth input to zero. Compare stay lengths of 1, 10 and 11 years. Then change only rent to $1,000 or $400 for a one-year comparison; inspect which portfolio receives the monthly difference. Replace zero costs with your own estimates for a more relevant scenario.',
},
];
