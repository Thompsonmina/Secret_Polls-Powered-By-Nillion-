### Was there a published code example that was particularly helpful to you while building? Which one(s)?

Yes, there was. A quick note: I initially started off planning to build a poker application powered by Nillion. You can find the Nada program I wrote to evaluate poker hands in the Nada programs directory (`poker.py`). I'm sharing this because I will be basing my feedback both on my experience attempting to build that, as well as my experience building my actual project—**Secret Polls**.

Yes, there were quite a number of code examples that helped me build on Nillion:
1. The list comprehension and list iteration examples ([Nillion Docs: Lists & Comprehensions](https://docs.nillion.com/nada-lang-tutorial-lists-and-comprehensions), [Nillion Docs: Lists & Iteration](https://docs.nillion.com/nada-lang-tutorial-lists-and-iteration)) were very helpful in understanding how Nada interacts with Python. I was used to an older version of Nada where iteration wasn't really possible, and these examples helped me catch up to the new changes.
2. The voting code example in [Nillion Docs: Voting](https://docs.nillion.com/nada-by-example/voting) was also very helpful and inspired me in creating my base poll Nada program.
3. The Next.js template/example ([GitHub: Nillion Next.js Example](https://github.com/NillionNetwork/client-ts/tree/main/examples/nextjs)) was instrumental in helping me get a clear understanding of how to properly use Nillion hooks. The example components were super helpful.
4. **Honorable Mentions**:
   - The Python quickstart, especially the sections on interacting with the Python client to interact on the testnet.
   - The JavaScript Blind app quickstart helped me understand the flow of interacting with Nillion on the web. 
   - The CRA-Nillion template repo was invaluable for initial exploration and tweaking.

---

### Did you run into any bugs while building?

I understand that Nillion is still in its relative infancy, and the developers are quick with improvements, but yes, I ran into some bugs while developing on Nillion:

1. The biggest issue (and I don't know if it's a bug or new intended functionality) occurred during the final weekend when the cost of transacting on the testnet became astronomically high. I was seeing 8,388,609 UNIL quotes for performing simple secret integer storage. I'm unsure what was happening there.
2. In the Nillion React hooks, the Nillion provider component specifies the DevNet configuration found in `nillion/client-core`, but it seems as though the details stored there are outdated. Attempting to connect with that default will lead to errors (at least for me). The issue seems to stem from the bootnode WebSocket URL, which is stored as `/ip4/127.0.0.1/tcp/54936/ws/p2p/12D3KooWMvw1hEqm7EWSDEyqTb6pNetUVkepahKY6hixuAuMZfJS`, but in my case, the correct URL was `/ip4/127.0.0.1/tcp/32869/ws/p2p/12D3KooWMGxv3uv4QrGFF7bbzxmTJThbtiZkHXAgo3nVrMutz6QN`.
3. Also, still on the Nillion provider component, I don’t think this counts as a bug, but there's no other place to address it: attempting to pass a `NillionClient` prop to the component will not work. It seems that case isn’t currently being handled.
4. There's an issue with assigning permissions with the JS client (or at least the Nillion hooks). Attempting to grant a user default permissions for their own secret results in an error where the user can no longer access the secret.

---

### What information did you need while building that wasn't in the docs?

1. The most important information I was looking for (but couldn't quite find—though it might be that I didn’t look hard enough) was around how computation is priced on Nillion. I could not find any documentation that mentions the unit cost of different Nada operations on the network. For example, with Ethereum, we know how much gas is used for different operations, and that influences how we build so we can optimize costs. How much more expensive is it to store a secret integer with a longer TTL compared to one without? How much more expensive is it to store a blob compared to an integer? Are there any particular Nada operations that are costly to perform inside a program? Is there a limit to iterations with Nada? Is there a limit to the number of parties or secret integers that can be created and used within a Nada program? I couldn't find any information on these examples.
2. I think having a roadmap or list of upcoming Nada primitives (if any) would be helpful. For instance, working with booleans and comparisons is a bit tricky in Nada since there's no support yet for native logical operators like `AND`, `NOT`, and `OR`. If you look at my `poker.py` Nada program, I had to create workarounds for this.

---

### What guide or example was missing that you could have used to build faster? Please list one or more ideas.

1. I would have liked more examples or documentation on using the `nillion/client-react-hooks` package (this might just be a skill issue on my end). It feels like the docs are a bit behind and underwhelming. For example, the docs currently recommend wrapping with the `NillionClientProvider` component and passing in a client near the root, but in the Next.js template/example, it seems like a newer `NillionProvider` component is now the better/preferred way to wrap and provide context. The docs don’t fully explain how to use this newer component. Also, the section explaining the available hooks seems limited or outdated. From the Next.js example, there seem to be more robust hooks and functionality.
2. The Next.js example/template is intuitive and useful, but I think I would have liked more documentation around the components inside it and, generally, connecting with the testnet or devnet.

---

### Do you have any other feedback or ideas for how we could improve your builder experience? Add them here.

1. I have a question or concern about how a certain functionality works on Nillion. I’m referring to how programs are currently computed. From what I gather, the correct flow is that the party responsible for a program first stores that program, other parties see the program, and can then store secrets that will be used in this program. They then grant the program compute access to their secret. The owner of the program then runs the computation and gets the output. My question is: is this the only intended sequence of operations? Because if it is, it is not currently being enforced. What I mean is that I can do step 2 before step 1. Input parties can grant compute access to programs that do not yet exist on the network since we just grant access to the program ID string (`userid/program_name`). As long as we store a program in the future with the same `program_name`, we can afford to store the program later. In fact, this is what allows my **Secret Polls** app to work as it does. The idea is that we can have a dynamic number of input parties per poll because we dynamically create and store a new poll program at the end when all participants are known. However, every time a new participant is added, we already get compute permission for the specific poll program that does not yet exist because we can define the name of the program in advance. My concern is: couldn’t this be exploited by a bad actor? They could show potential input parties a Nada program that they consent to, give them the program name, and the input parties grant compute access. The bad actor could then store a different program that exposes more information than what the input parties consented to, as long as the program has the same name. This would still work.
2. This is regarding the Nillion faucet: I would like it if proven good-faith actors could get more NIL testnet tokens from the faucet. Maybe some activities people could do would grant them more access.
