# Eddie

At [Barkley](http://barkleyus.com) we have several client visits and team meeting each week. Food is frequently available and if there are left overs, our front desk person (Eddie) notifies the entire company via an e-mail blast. Food goes fast and this application helps the [moonshot lab](http://moonshot.barkleyus.com) team get notified first!

## How it Works
I'm using a webhook provided by [context.io](http://context.io/) to constantly monitor my inbox for new messages from Eddie. When one arrives, this application checks to see if the contents/subject of the e-mail look like food (donuts, [Dean and Deluca](http://deandeluca.com/‎), [Jack Stack](http://.jackstackbbq.com), etc. If a match exists, the app will then notify a spark core of what's available and will give it's best guess as to what floor to get it.

## Setting up Keys
If you'd like to set up your own variety, you'll need to create the following environment variables:
* SPARK_CORE_ID - The unique id of your spark core
* SPARK_CORE_TOKEN - Your spark cores access token
* CONTEXT_IO_KEY - Your context.io api key
* CONTEXT_IO_SECRET - Your contest.io api secret

## Results
Inconclusive so far...
