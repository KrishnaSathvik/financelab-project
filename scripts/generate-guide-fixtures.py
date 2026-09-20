"""Independent editorial oracle. Python Decimal only; never imports production code.
Run from repository root. Regenerates committed examples, exhibits and engine expectations.
"""
from decimal import Decimal as D, getcontext
from pathlib import Path
import json
getcontext().prec = 50
values, cases, exhibits = {}, [], {}
def val(key, value):
    values[key] = float(value)
    return value
def case(id, function, inputs, expected, basis, sources):
    cases.append(dict(id=id, function=function, args=inputs, expected=expected, tolerance=.01, basis=basis, sources=sources, relationship='Independent arithmetic compared with frozen MoneyBasis v1 engine; sources support definitions, not these hypothetical amounts.'))
def exhibit(id, title, columns, rows, formats, note, kind='table', series=None):
    exhibits[id] = dict(title=title, columns=columns, rows=rows, formats=formats, note=note, kind=kind, series=series or [])
def number(x): return float(x)
def pv_payment(principal, percent, months):
    r = D(str(percent))/1200
    return D(principal)/sum((1+r)**(-m) for m in range(1, months+1))
def fv(principal, deposit, percent, months):
    r = D(str(percent))/1200
    return D(principal)*(1+r)**months+D(deposit)*sum((1+r)**k for k in range(months))
# Mortgage: discounted present value determines payment; monthly ledger is a separate check.
pay=pv_payment(320000,6.5,360); bal=D(320000); months=[]; annual=[]
for n in range(1,361):
    interest=bal*D('6.5')/1200; paid=min(pay,bal+interest); principal=paid-interest; bal-=principal
    if abs(bal)<D('1e-35'): bal=D(0)
    months.append([n,paid,principal,interest,bal])
    if n%12==0:
        annual.append([n//12,sum(x[2] for x in months[-12:]),sum(x[3] for x in months[-12:]),bal])
val('mortgage.payment',pay);val('mortgage.firstInterest',months[0][3]);val('mortgage.firstPrincipal',months[0][2]);val('mortgage.totalInterest',sum(x[3] for x in months));val('mortgage.totalCost',pay+750)
case('mortgage','calculateMortgage',[dict(homePrice=400000,downPayment=80000,annualRatePercent=6.5,termYears=30)],dict(monthlyPayment=pay,totalInterest=values['mortgage.totalInterest'],**{'months.0.interest':months[0][3],'months.0.principal':months[0][2],'months.last.balance':0}), 'Payment = principal / sum of discounted monthly unit payments; interest uses opening balance × note rate / 12.', ['mortgage','apr'])
exhibit('mortgage','How the payment mix changes',['Year','Principal paid that year','Interest paid that year','Year-end loan balance'],[r for r in annual if r[0] in [1,5,10,20,30]],['number','money','money','money'],'$320,000 loan; 6.5% note rate; 360 end-of-month payments. Annual totals; excludes escrow and fees.','stacked',[1,2])
# Investment series use direct geometric sums, not a mutable monthly production loop.
rows=[]
for year in range(0,21,5):
    total=fv(10000,500,7,year*12); contributed=D(10000+500*12*year)
    rows.append([year,contributed,total-contributed,total])
end=rows[-1][-1]; real=end/D('1.03')**20
for k,x in [('lump',D(10000)*D('1.05')**10),('total',end),('contributed',130000),('growth',end-130000),('real',real),('loss',D(1000)*D('.99')**12)]:val('compound.'+k,x)
case('compound-monthly','calculateInvestment',[dict(startingAmount=10000,monthlyContribution=500,annualReturnPercent=7,years=20,compoundingFrequency='monthly',inflationPercent=3)],dict(finalValue=end,totalContributed=130000,interestEarned=end-130000,realFutureValue=real),'End-month geometric sum at 7% nominal / 12; divide final value by 1.03^20 for today-dollar value.',['compound','apy','inflation'])
case('compound-lump','calculateInvestment',[dict(startingAmount=10000,monthlyContribution=0,annualReturnPercent=5,years=10,compoundingFrequency='annually')],dict(finalValue=values['compound.lump']),'10000 × 1.05^10; annual compounding.',['compound'])
case('compound-zero','calculateInvestment',[dict(startingAmount=1000,monthlyContribution=100,annualReturnPercent=0,years=1)],dict(finalValue=2200,interestEarned=0),'Zero return: initial $1,000 plus twelve $100 month-end deposits.',['compound'])
case('compound-loss','calculateInvestment',[dict(startingAmount=1000,monthlyContribution=0,annualReturnPercent=-12,years=1)],dict(finalValue=values['compound.loss'],interestEarned=values['compound.loss']-1000),'1000 × 0.99^12; signed loss.',['compound'])
exhibit('compound','Contributions, growth and total value',['Year','Contributed capital','Accumulated growth','Total value'],rows,['number','money','money','money'],'$10,000 initially + $500 at each month end; 7% nominal annual rate, monthly compounding; no fees or tax. Hypothetical, not a forecast.','line',[1,2,3])
# Tax brackets independently transcribed from IRS RP 2025-32, SSA and IRS Medicare.
base=dict(mode='salary',annualSalary=75000,hoursPerWeek=40,weeksPerYear=52,filingStatus='single',taxYear=2026,traditional401k=0,healthInsurance=0)
def salary(k,h):
    taxable=D(75000-k-h-16100)
    tax=min(taxable,D(12400))*D('.10')+max(D(0),min(taxable,D(50400))-12400)*D('.12')+max(D(0),taxable-50400)*D('.22')
    ss=D(75000-h)*D('.062');med=D(75000-h)*D('.0145');net=D(75000-k-h)-tax-ss-med
    return dict(taxableIncome=taxable,federalTax=tax,socialSecurity=ss,medicare=med,netAnnual=net)
sal=salary(0,0);ded=salary(10000,2000)
for k,x in sal.items():val('salary.'+k,x)
for k,x in ded.items():val('deductions.'+k,x)
case('salary-2026','calculateSalary',[base],sal,'2026 single standard deduction $16,100; bracket slices: $12,400 at 10%, $38,000 at 12%, $8,500 at 22%; FICA on $75,000.',['irs2026','ssa','medicare'])
case('salary-deductions','calculateSalary',[base|dict(traditional401k=10000,healthInsurance=2000)],ded,'Federal wages reduced by both deductions; FICA wages reduced only by qualifying $2,000 cafeteria benefit.',['irs2026','ssa','retirementTax','cafeteria'])
case('salary-hourly','calculateSalary',[base|dict(mode='hourly',hourlyRate=30)],dict(annualSalary=62400,hourlyRate=30),'Gross hourly conversion: $30/hour × 40 hours/paid week × 52 paid weeks/year.',['irs2026'])
case('salary-medicare','calculateSalary',[base|dict(annualSalary=300000)],dict(medicare=5250),'300000 × 1.45% + (300000 − 200000) × 0.9%.',['medicare'])
exhibit('salary','2026 annual gross-to-net estimate',['Step','Amount'],[['Gross wages',75000],['Federal income tax',-sal['federalTax']],['Social Security',-sal['socialSecurity']],['Medicare',-sal['medicare']],['Estimated net',sal['netAnnual']]],['text','money'],'Single worker, standard deduction, no pretax deductions. Excludes state/local taxes and other payroll deductions. The standard deduction reduces taxable income, not cash pay.','waterfall',[1])
exhibit('gross','Where the annual gross pay goes — 2026',['Allocation','Amount'],[['Traditional 401(k)',10000],['Qualifying health benefit',2000],['Federal income tax',ded['federalTax']],['Social Security',ded['socialSecurity']],['Medicare',ded['medicare']],['Estimated net',ded['netAnnual']]],['text','money'],'$75,000 gross wages; single worker. Each dollar is allocated once. The 401(k) transfer remains an asset; the health benefit is not spendable pay.','bars',[1])
exhibit('pay-periods','One gross salary, different pay periods',['Period','Gross amount'],[['Annual',62400],['Monthly average',5200],['Biweekly (26)',2400],['Semimonthly (24)',2600],['Paid week (52)',1200],['Hour (40 hours × 52 weeks)',30]],['text','money'],'$62,400 gross; 40 hours per paid week; 52 paid weeks. Semimonthly is a manual comparison, not a calculator output.')
# Balance sheet and monthly cash flow: exact integer arithmetic.
case('net-worth','calculateNetWorth',[dict(assets=357000,debts=240000,monthlySavings=0,monthlyDebtPaydown=0,assetReturnPercent=0,debtInterestPercent=0,years=1)],dict(current=117000,**{'series.last.netWorth':117000}),'12000 cash + 45000 investments + 300000 full property value − 240000 mortgage. Projection frozen at zero changes.',['netWorth'])
exhibit('net-worth','A dated balance sheet',['Measure','Amount'],[['Assets',357000],['Liabilities',240000],['Net worth',117000]],['text','money'],'Illustrative valuation date: September 18, 2026. Assets: cash $12,000, investments $45,000, full property value $300,000. Mortgage: $240,000.','bars',[1])
for transfer in [0,500]:
    case('budget-'+str(transfer),'calculateBudget',[dict(monthlyIncome=5000,categories=[dict(name='Housing',amount=1500),dict(name='Other expenses',amount=2200),dict(name='Savings transfer',amount=transfer)])],dict(expenses=3700+transfer,surplus=1300-transfer,remainingIncomeRate=(1300-transfer)/50),'Income minus all entered outflows, including explicit savings transfers; divide remainder by take-home income.',['budget'])
exhibit('budget','Assigning the same monthly income',['Allocation','Before savings transfer','After savings transfer'],[['Expenses',3700,3700],['Savings transfer',0,500],['Unassigned cash',1300,800],['Income reconciled',5000,5000]],['text','money','money'],'All amounts monthly. $500 moved to savings reduces unassigned cash; it does not create a second $500 of remaining cash.','allocation',[2])
exhibit('savings-rate','Several definitions, explicit denominators',['Scenario','Savings numerator','Income denominator','Rate (%)'],[['Unassigned cash only (not savings)',0,5000,0],['$500 transfer / take-home',500,5000,10],['$400 payroll + $500 after-tax / gross',900,8000,D(900)/8000*100],['Plus $200 employer / gross plus employer',1100,8200,D(1100)/8200*100]],['text','money','money','percent'],'The last two rows are separate illustrative compensation scenarios. An $800 remainder on $5,000 is a 16% remaining-income rate, not part of these savings numerators.','bars',[3])
# Debt: reserve all minimums, then distribute extra in original priority; Decimal ledger.
debts=[dict(id='card',name='Credit card',balance=4200,rate=19.9,minimumPayment=120),dict(id='personal',name='Personal loan',balance=3500,rate=12,minimumPayment=110),dict(id='car',name='Car loan',balance=11000,rate=6.5,minimumPayment=265)]
debt_rows=[]
for method in ['snowball','avalanche']:
    order=sorted(range(3),key=lambda j:(-debts[j]['rate'],debts[j]['balance']) if method=='avalanche' else (debts[j]['balance'],))
    balances=[D(d['balance']) for d in debts];interest=D(0);n=0;closed={};first=[]
    while sum(balances)>D('1e-30'):
        n+=1;payments=[D(0)]*3;available=D(800)
        for j,d in enumerate(debts):
            inc=balances[j]*D(str(d['rate']))/1200;interest+=inc;balances[j]+=inc
        for j,d in enumerate(debts):
            p=min(balances[j],D(d['minimumPayment']));balances[j]-=p;payments[j]+=p;available-=p
        for j in order:
            p=min(balances[j],available);balances[j]-=p;payments[j]+=p;available-=p
        if n==1:first=payments[:]
        for j,b in enumerate(balances):
            if b==0 and j not in closed:closed[j]=n
    val('debt.'+method+'Interest',interest)
    case('debt-'+method,'calculateDebtSnowball',[dict(debts=debts,monthlyBudget=800,method=method)],dict(months=n,totalInterest=interest),'Decimal interest; minimums reserved across all debts; remaining budget assigned in fixed initial priority, including same-month payoff leftovers.',['debt'])
    debt_rows.append([method.title(),n,interest])
    exhibit('debt-'+method,method.title()+': payment priority and payoff',['Debt','Priority','First-month payment','Cleared in month'],[[debts[j]['name'],order.index(j)+1,first[j],closed[j]] for j in order],['text','number','money','number'],'Priority describes where extra money goes; payoff month is a chronological outcome. Fixed $800 total monthly budget.','sequence',[3])
exhibit('debt','Same debts and budget, different priority',['Method','Payoff months','Total interest'],debt_rows,['text','number','money'],'Credit card $4,200 at 19.9%, minimum $120; personal loan $3,500 at 12%, minimum $110; car loan $11,000 at 6.5%, minimum $265. $800 monthly budget.')
# Loan: independent closed-form balances until final payment, then exact cap.
loan_series={};loan_totals=[]
for payment in [300,400]:
    rows=[[0,D(10000)]];ledger=[];interest=D(0);n=0
    while rows[-1][1]>D('1e-30'):
        n+=1;opening=rows[-1][1];inc=opening/D(100);paid=min(D(payment),opening+inc);end=opening+inc-paid
        ledger.append([n,paid,inc,paid-inc,end]);rows.append([n,end]);interest+=inc
    loan_series[payment]=rows;loan_totals.append([payment,n,interest,ledger[-1][1]])
    val(f'loan.{payment}Interest',interest)
    case('loan-'+str(payment),'simulateLoan',[10000,12,payment],dict(months=n,interest=interest,totalPaid=10000+interest),'Monthly opening balance × 1%; cap last payment at balance plus interest.',['mortgage'])
    exhibit('loan-ledger-'+str(payment),f'First payments at ${payment} per month',['Month','Payment','Interest','Principal','Closing balance'],ledger[:2]+ledger[-1:],['number','money','money','money','money'],'Interest before payment; last row is the final partial payment.')
val('loan.saved',values['loan.300Interest']-values['loan.400Interest'])
exhibit('loan-comparison','Payoff comparison',['Monthly payment','Months','Total interest','Final payment'],loan_totals,['money','number','money','money'],'$10,000 starting debt; 12% nominal annual rate / 12; no fees or missed payments.')
exhibit('loan','The balance with $300 or $400 monthly',['Month','$300 payment','$400 payment'],[[n,loan_series[300][min(n,41)][1],loan_series[400][min(n,29)][1]] for n in [0,1,2,6,12,18,24,29,36,41]],['number','money','money'],'Balances after payment, with zero retained after payoff. Lines join selected monthly observations.','line',[1,2])
# Retirement: policy arithmetic distinct from deterministic engine and from historical studies.
exhibit('retirement-rates','First-year arithmetic on $750,000',['Initial rate (%)','Annual withdrawal','Monthly equivalent'],[[r,750000*r/100,750000*r/1200] for r in [3,4,5]],['percent','money','money'],'Illustrations, not recommended rates or probabilities of lasting through retirement.')
exhibit('retirement','Fixed initial 4%, then inflation adjustment',['Retirement year','Annual withdrawal','Monthly equivalent'],[[y,D(30000)*D('1.03')**(y-1),D(2500)*D('1.03')**(y-1)] for y in [1,2,3,10]],['number','money','money'],'Initial portfolio $750,000. Spending rises 3% annually regardless of subsequent portfolio value. No tax or fees; no survival claim.','timeline',[1])
exhibit('sequence','Same returns, different withdrawal outcomes',['Year','+20% then −20%','−20% then +20%'],[[0,100000,100000],[1,110000,70000],[2,78000,74000]],['number','money','money'],'$100,000 initially; $10,000 withdrawn at each year end, after that year’s return. No inflation, taxes or fees. Without withdrawals both sequences end at $96,000. Invented two-year paths, not study data.','line',[1,2])
assert (D(100000)*D('1.2')-10000)*D('.8')-10000==78000
assert (D(100000)*D('.8')-10000)*D('1.2')-10000==74000
nest=fv(25000,800,7,420);need=D(4000)*D('1.03')**35
val('retirement.nest',nest);val('retirement.need',need);val('retirement.monthly',nest*D('.04')/12)
case('retirement','calculateRetirement',[dict(currentAge=30,retirementAge=65,currentSavings=25000,monthlyContribution=800,annualReturnPercent=7,monthlyNeed=4000,inflationPercent=3,withdrawalRatePercent=4,lifeExpectancy=90)],dict(nestEgg=nest,monthlyNeedAtRetirement=need,safeMonthlyWithdrawal=nest*D('.04')/12,exceedsTarget=False),'Accumulation geometric sum, 420 end-month deposits; today-dollar need × 1.03^35; initial-rate arithmetic separate from spending.',['bengen','trinity'])
# Rent/buy intentionally zero rates to expose equal-resource bookkeeping without forecasts.
rb=dict(homePrice=120000,downPaymentPercent=20,mortgageRatePercent=0,monthlyRent=800,appreciationPercent=0,investmentReturnPercent=0,rentIncreasePercent=0,loanTermYears=10,annualPropertyTax=0,annualInsurance=0,annualMaintenance=0,closingCostPercent=0,monthlyRenterInsurance=0,yearsToStay=11)
for year in [1,10,11]:
    buyer=24000+min(year,10)*9600+max(year-10,0)*9600
    case('rent-buy-'+str(year),'calculateRentVsBuy',[rb|dict(yearsToStay=year)],dict(monthlyMortgage=800,buyAtHorizon=buyer,rentAtHorizon=24000),'Zero-rate mortgage principal falls $800/month for 120 months; buyer invests freed $800 after payoff; renter keeps $24,000 initial portfolio.',['housing'])
case('rent-buy-cheaper-owner','calculateRentVsBuy',[rb|dict(yearsToStay=1,monthlyRent=1000)],dict(buyAtHorizon=36000,rentAtHorizon=24000),'Buyer equity 33600 + 12 × 200 invested monthly cost difference.',['housing'])
case('rent-buy-cheaper-renter','calculateRentVsBuy',[rb|dict(yearsToStay=1,monthlyRent=400)],dict(buyAtHorizon=33600,rentAtHorizon=28800),'Renter portfolio 24000 + 12 × 400 invested monthly cost difference.',['housing'])
exhibit('rent-buy','Equal resources through mortgage payoff',['Year','Buyer equity','Owner portfolio','Buyer net position','Renter portfolio'],[[0,24000,0,24000,24000],[1,33600,0,33600,24000],[10,120000,0,120000,24000],[11,120000,9600,129600,24000]],['number','money','money','money','money'],'$120,000 property; $24,000 down; 10-year zero-rate mortgage; $800 monthly rent. All other costs, growth and returns set to zero to isolate bookkeeping. Not a realistic market-cost estimate.','paths',[3,4])
# Goal: discounted future value gap divided by independently summed deposit growth.
for year in [1,2,3]:
    case('savings-zero-'+str(year),'calculateSavingsGoal',[dict(goalAmount=12000,alreadySaved=3000,annualReturnPercent=0,years=year)],dict(monthlyRequired=9000/(year*12)),'(12000 − 3000) / number of months.',['savings'])
r=D(4)/1200;factor=sum((1+r)**k for k in range(48));deposit=(50000-D(5000)*(1+r)**48)/factor;growth=50000-5000-deposit*48
val('savings.deposit',deposit);val('savings.growth',growth);val('savings.new',deposit*48)
case('savings-growth','calculateSavingsGoal',[dict(goalAmount=50000,alreadySaved=5000,annualReturnPercent=4,years=4)],dict(monthlyRequired=deposit,interestEarned=growth,**{'series.last.value':50000}),'Future-value gap divided by end-month deposit geometric sum.',['savings'])
case('savings-growth-funded','calculateSavingsGoal',[dict(goalAmount=10000,alreadySaved=9000,annualReturnPercent=12,years=1)],dict(monthlyRequired=0,alreadyThere=False,**{'series.last.value':D(9000)*D('1.01')**12}),'9000 × 1.01^12 exceeds 10000; initial balance remains below target.',['savings'])
val('savings.growthFunded',D(9000)*D('1.01')**12)
exhibit('savings','What makes up the $50,000 goal',['Component','Amount'],[['Existing savings',5000],['New deposits',deposit*48],['Assumed growth',growth],['Goal',50000]],['text','money'],'48 month-end deposits at unrounded solved amount; 4% nominal annual return / 12. Rounding the actual monthly transfer to cents may slightly change the terminal balance.','bars',[1])
exhibit('savings-zero','Time changes the zero-return deposit',['Months','Monthly deposit'],[[12,750],[24,375],[36,250]],['number','money'],'$12,000 nominal goal; $3,000 already saved; no return or inflation adjustment.')
# Real/nominal and yield conversions, exact ratio rather than rate subtraction.
nom=D(10000)*D('1.07')**10;real=nom/D('1.03')**10
val('real.nominal',nom);val('real.value',real);val('real.rate',(D('1.07')/D('1.03')-1)*100);val('real.target',D(10000)*D('1.03')**10)
case('nominal-real','calculateInvestment',[dict(startingAmount=10000,monthlyContribution=0,annualReturnPercent=7,years=10,compoundingFrequency='annually',inflationPercent=3)],dict(finalValue=nom,realFutureValue=real),'10000 × 1.07^10, deflated by 1.03^10.',['inflation'])
exhibit('real','Future dollars and today’s purchasing power',['Year','Nominal value','Today-dollar value'],[[y,D(10000)*D('1.07')**y,D(10000)*(D('1.07')/D('1.03'))**y] for y in [0,2,4,6,8,10]],['number','money','money'],'$10,000 initial; 7% annual compounding; no deposits; constant 3% inflation assumption. No tax or fees.','line',[1,2])
nominal5=(D('1.05')**(D(1)/12)-1)*1200;effective12=(D('1.01')**12-1)*100
val('apy.nominal5',nominal5);val('apy.effective12',effective12)
case('apy-annual','calculateInvestment',[dict(startingAmount=10000,monthlyContribution=0,annualReturnPercent=5,years=1,compoundingFrequency='annually')],dict(finalValue=10500),'5% effective annual yield represented using annual frequency.',['apy'])
case('apy-monthly-equivalent','calculateInvestment',[dict(startingAmount=10000,monthlyContribution=0,annualReturnPercent=nominal5,years=1,compoundingFrequency='monthly')],dict(finalValue=10500),'Nominal annual equivalent = 12 × ((1.05)^(1/12) − 1); percent input × 100.',['apy'])
exhibit('apy','Rates expressed on a comparable annual basis',['Description','Nominal annual rate (%)','Compounds/year','Effective annual yield (%)'],[['12% nominal, monthly',12,12,effective12],['5% APY, monthly equivalent',nominal5,12,5],['5% nominal, annual',5,1,5]],['text','percent','number','percent'],'Fixed rates, interest retained, no fees or withdrawals. Yield conversion is arithmetic; it does not turn uncertain investment returns into a deposit promise.','bars',[3])
# Provenance for every visual, including arithmetic that has no corresponding engine.
exhibit_cases = {
 'mortgage':['mortgage'], 'compound':['compound-monthly'], 'salary':['salary-2026'],
 'gross':['salary-deductions'], 'net-worth':['net-worth'], 'budget':['budget-0','budget-500'],
 'debt':['debt-snowball','debt-avalanche'], 'debt-snowball':['debt-snowball'], 'debt-avalanche':['debt-avalanche'],
 'loan':['loan-300','loan-400'], 'loan-comparison':['loan-300','loan-400'],
 'loan-ledger-300':['loan-300'], 'loan-ledger-400':['loan-400'],
 'rent-buy':['rent-buy-1','rent-buy-10','rent-buy-11'], 'savings':['savings-growth'],
 'savings-zero':['savings-zero-1','savings-zero-2','savings-zero-3'], 'real':['nominal-real'],
 'apy':['apy-annual','apy-monthly-equivalent'], 'pay-periods':['salary-hourly'],
}
manual = {
 'retirement-rates':dict(inputs=dict(initialPortfolio=750000,initialRatesPercent=[3,4,5]),basis='Annual = initial portfolio × initial rate; monthly equivalent = annual / 12.'),
 'retirement':dict(inputs=dict(initialPortfolio=750000,initialRatePercent=4,inflationPercent=3,years=[1,2,3,10]),basis='Annual withdrawal = 750000 × .04 × 1.03^(year−1). This is a spending policy only, not a portfolio survival calculation.'),
 'sequence':dict(inputs=dict(initialPortfolio=100000,yearEndWithdrawal=10000,annualReturnPaths=[[20,-20],[-20,20]],inflation=0,fees=0,tax=0),basis='Apply each annual return to opening assets, then subtract $10,000; no production engine represents varying-return paths.'),
 'savings-rate':dict(inputs=dict(takeHome=5000,expenses=3700,transfer=500,separateGrossScenario=dict(grossPay=8000,employeeRetirement=400,afterTaxSaving=500,employerRetirement=200)),basis='Explicit savings numerator / named income denominator × 100; employer-inclusive illustration adds employer contribution to both.'),
}
for key,e in exhibits.items():
 ids=exhibit_cases.get(key,[])
 e['caseIds']=ids
 e['inputs']=manual[key]['inputs'] if key in manual else [c['args'] for c in cases if c['id'] in ids]
 e['basis']=manual[key]['basis'] if key in manual else 'Independent Decimal reference arithmetic in the linked cases; selected rows and components retain full precision.'
 e['relationship']='MoneyBasis educational arithmetic, not source-provided market observations. '+('Standalone policy illustration; not simulated by a calculator.' if key in manual else 'Compare linked cases with the frozen calculator; renderer and prose consume these same fixtures.')

Path('lib/guides/fixtures.json').write_text(json.dumps(dict(generatedBy='scripts/generate-guide-fixtures.py',basis='Python Decimal precision 50; independent inputs and arithmetic; no production imports.',values=values,cases=cases,exhibits=exhibits),indent=2,default=lambda x:float(x))+'\n')
print(f'{len(cases)} independent cases; {len(exhibits)} exhibits; {len(values)} reusable values')
