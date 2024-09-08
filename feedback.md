

** Was there a published code example that was particularly helpful to you while building? Which one(s)?

Yes, there was. A quick note, I initially started off, planning to build a poker application powered by nillion. You can find the nada program i wrote to evaluate poker hands in the nada programs directory (poker.py). I am sharing this because i will be basing my feedback both off my experience attempting to build that as well as my experience building my actual project
secret polls. 
Yes there were quite a number of code examples that helped me build on nillion.
1. The lists comprehension and list iteration examples (https://docs.nillion.com/nada-lang-tutorial-lists-and-comprehensions, https://docs.nillion.com/nada-lang-tutorial-lists-and-iteration) where very helpful in helping me understand how nada interacts with python. I was used to an older version of nada where iteration wasn't very possible, and the code examples helped catch me up to speed with new changes
2. The voting code example in https://docs.nillion.com/nada-by-example/voting was also very helpful me, and drew inspiration from it in creating my base poll nada program
3. Honourable Mentions, The Python quickstart, especially the parts for interacting with the python client itself, to be able to interact on the testnet
   The javascript Blind app quickstart as well, helped understand the flow of interacting with nillion on the web, The cra-nillion template repo was invaluable for intial playing around and tweaking




** What information did you need while building that wasn't in the docs?
1. I think the most important info, i was looking that i couldnt quite find (it might be that i didnt look well enough) was information around how computaion is priced on nillion, i could find anything place that mentions the unit cost of different nada operations on the network. For example with ethereum we know how much gas is used for different operations and that influences how we build so that we can optimise costs. Eg. how much more expensive is it to store a secret integer with a longer ttl compared to one without, how much expensive is it to store a blob compared to an integer. Are there any particular nada operations that are costly to perform inside a program. Is there a limt to iterations with nada, is there a limit to the number of parties/secret integers that can be created and used within a nada program. I couldn't find any information pertaining to this examples