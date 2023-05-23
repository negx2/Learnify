

def cdTranscript():
    return """
    Do you remember that scene in Ferris Bueller's Day Off when Ferris convinces his best friend Cameron to take his dad's car out for a joyride? Cameron was crazy protective about that car, but hey, that's understandable—it's a Ferrari. But keeping your assets in one place and admiring them from a distance and hoping for the best doesn't always work out. If you happen to be parking all of your extra cash in your bank account and hoping for the best, then today's video may give you some other options with the same level of security. CD Definition: Which brings me to Certificate of Deposits, or CDs, which are offering up to 6% today. There are several different types of CDs, which I'll discuss, and I'll provide the highest rates that are available in each of those types and timeframes. And as a reminder, CDs are a savings product that are offered from banks and credit unions, which provide a higher rate than a savings account because they require you to keep your money invested in the CD for a set period of time. CDs have an upper hand over the savings account with regards to the rate because it is a locked-in rate for the entire timeframe that you own it, unlike a savings account where the interest rate can go up or down at a moment's notice. The biggest downside to CDs is that you're typically locked in for the set time period and you don't have as much access to your cash like you would with a savings account. However, you can cash in your CD early, but it has a tendency to have a fee that's associated with withdrawing it early. The penalty is typically anywhere from giving up one to two months worth of interest. But if you need your cash in a hurry, you can take the penalty and cash them in, but I'm gonna discuss an option that skirts that penalty altogether. And you can also purchase your CDs from a brokerage site like Schwab, Fidelity, or TD Ameritrade. And these CDs are still savings products that are being sold from specific banks and the credit unions. The brokerage site is just a moderator that's connecting the clients with the banks. Overall, this means that the FDIC coverage up to $250,000 is still offered on CDs purchased on a brokerage site. And buying new CDs from a large broker like these don't typically have any fees associated with it, but always make certain to read the fine print because they can change their fees and their terms at any time. I often hear from viewers that use a local broker where they're often being charged fees for purchasing CDs and CD ladders. Always do your homework to understand your fees and your options from your specific broker. Common Question on CDs: And another question that I often get is, can you buy CDs within an IRA? And the answer is yes, you can, but you need to review the details and any purchase limits of your IRA. A big difference between a brokerage site versus a bank is that you don't have early withdrawal fees. Instead, they have the option to sell the CDs on the secondary market. I cover the brokerage site CD process in depth in this video right here. If you are interested in learning the fine details of purchasing them on a brokerage site, then I highly suggest that you watch this video. Brokered CDs is far too much information for me to cover today, but I will state that there is a fee for buying and selling new CDs from a broker and it's usually around 0.1%. APY Question: Before jumping into the CD types, I wanna discuss APY or the annual percentage yield. This is a question that I get all the time and it's important to discuss. Now, when you're scoping out CDs, you may see two
    """


def cdTranscriptHalf():
    return """
    But if you need your cash in a hurry, you can take the penalty and cash them in, but I'm gonna discuss an option that skirts that penalty altogether. And you can also purchase your CDs from a brokerage site like Schwab, Fidelity, or TD Ameritrade. And these CDs are still savings products that are being sold from specific banks and the credit unions. The brokerage site is just a moderator that's connecting the clients with the banks. Overall, this means that the FDIC coverage up to $250,000 is still offered on CDs purchased on a brokerage site. And buying new CDs from a large broker like these don't typically have any fees associated with it, but always make certain to read the fine print because they can change their fees and their terms at any time. I often hear from viewers that use a local broker where they're often being charged fees for purchasing CDs and CD ladders. Always do your homework to understand your fees and your options from your specific broker. Common Question on CDs: And another question that I often get is, can you buy CDs within an IRA? And the answer is yes, you can, but you need to review the details and any purchase limits of your IRA. A big difference between a brokerage site versus a bank is that you don't have early withdrawal fees. Instead, they have the option to sell the CDs on the secondary market. I cover the brokerage site CD process in depth in this video right here. If you are interested in learning the fine details of purchasing them on a brokerage site, then I highly suggest that you watch this video. Brokered CDs is far too much information for me to cover today, but I will state that there is a fee for buying and selling new CDs from a broker and it's usually around 0.1%.
    """


def cdTranscriptSummary():
    return """
    Certificates of Deposit (CDs) are a secure savings option with higher interest rates than traditional savings accounts. They require you to invest your money for a set period, offering a locked-in rate for the entire duration. Unlike savings accounts, the interest rate remains constant. However, early withdrawal from a CD typically incurs a penalty of one to two months' worth of interest. CDs can be purchased from banks, credit unions, or brokerage sites like Schwab, Fidelity, or TD Ameritrade, with FDIC coverage up to $250,000. Brokered CDs facilitate CD purchases through brokers, but fees may apply. CDs can also be bought within an Individual Retirement Account (IRA) but consider the specific terms and limits. Annual Percentage Yield (APY) is an important metric to consider when comparing CDs, representing the expected return over a year. Interest can compound, so it's advisable to let it grow within the CD rather than opting for immediate payouts. CDs offer a secure way to invest excess cash while earning higher returns, although access to funds may be limited during the agreed-upon term.
    """


def sampleQuizText():
    return """
{
    "quiz_title": "Test Quiz",
    "questions": [
        {
            "question_number": 1,
            "question_text": "What is the capital of France?",
            "choices": [
                {
                    "choice_text": "New York",
                    "is_correct": false
                },
                {
                    "choice_text": "London",
                    "is_correct": false
                },
                {
                    "choice_text": "Paris",
                    "is_correct": true
                }
            ]
        }
    ]
}
    """


def mockedQuizResponse(responseText=sampleQuizText()):
    class EmptyObject:
        pass
    choice = EmptyObject()
    choice.text = responseText  # non-chat api
    choice.message = {'content': responseText}  # chat api
    choices = [choice]
    response = EmptyObject()
    response.choices = choices
    return response
