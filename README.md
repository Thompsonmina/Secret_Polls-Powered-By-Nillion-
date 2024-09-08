# Secret Polls
Secret Polls is blind app on the nillion network that provides a novel mechanism for taking blind polls
With Secret Polls we can create polls of only which the end outcome is known. These polls are completely  blind/secret  in the sense that we can only see the end result of the polls without knowing the participants. Nobody but the person who participated in that poll will ever know what she/he voted for apart from themselves.  Neither the poll creator, nor any third can ever know this information

## Why Secret Polls?
Secret polls satisfies the usecase where a party wants to learn information about a group of people or demographic while preserving relative privacy.There can be no bias against individual members for the choice they make. It could potentially also be extended to work for surveys for research


## How the platform works:
Poll owners can create polls to resolve, questions, concerns etc. Polls can have a cap for participants and expiry periods in which no one else can participate again. Polls also have visibility, in the sense of whether the poll owners want the general populace to be able to access his/her poll and see the results or keep a poll private restricting access to only those that have a link (or even in the future passwords ). A Poll consists of a question and 4 options.
Once A poll has been concluded a poll owner can see the results.

Poll participants can choose to participate in polls they have access to with the full knowledge that the knowledge of what they picked is secret will never be known. poll participants can also see the results to the polls they have access to

## Technical Details
This Project is solely built on top of Nillion. We use the Nillion Network as the privacy layer. That allows for people to create polls another people to anonymous answer these polls without any party being the wiser about what option a person picked.

There are two main components in this project, a lightweight backend server found in the secret_polls directory and the nillion javascript blind app (secret_polls_react_directory). This project allows people to create polls which are blind computation programs behind the scenes without knowing in advance the parties that might wish to participate in the polls, we do this by generating nada programs only on demand i.e when a poll owner is ready to compute. 

The full flow goes like this.
User A creates a Poll configured with different options and visibility level, visibility governs who can participate in the poll. When a poll is created we only store the user id, the question and the poll options, as well as poll configs.

Now other users B, C and D can gain access to a poll and choose to participate secretly, i.e they  do not want it known what option they picked but they want to participate. They choose an option and submit, under the hood this submission is a nillion secret integer storage operation where the interger stored is which option the user picked.

When these participants vote on the poll, thier secret input ids and parties get stored on the backend server.

Now when a poll has expired or all the max number of participants have interacted with poll, or if the owner decided to end the poll early, in other words, once we have a conclusion event. then we dynamically create a secret program that represents the specific poll, the secret programs are dynamically generated. with secret poll program genrated, the inputs of the anonymous participants are then binded and the poll creator A, then uploads and computes the result of the poll, seeing which option won, what total votes each options gets, without knowing who actually chose what.

## Components

### Lightweight flask server 
We use this to cordinate poll owners with poll participants, basically we store all the none confidential information about the poll, ie the actual poll question and its options, as well as config information. It is also responsible for dynamically generating the nada poll program that gets compiled and sent over to the poll owner at computation time. You can find a sample generated poll program in the secret polls nada project directory 

### React Nillion Blind App
We utilize the nillion reacts hooks building on top of the base next example project template. You can find my own custom components in the poll directory in the components directory. ALl the nillion operations are handled with the nillion hooks, namely the act of choosing a poll option and submitting it, which under the hood is actually the user stroing a secret integer and giving compute permissions to the poll owner user . We also have the computation operations that the poll owner performs.


## Call Outs 

- I am unable to deploy the at the moment due to spike in computation price on the testnet, which means the project is built running on the devnet, the good news is since I am fully using the nillion provider component to provide context, it should be fairly trivial to move the app back to working on the testnet

- There is an issue with assigning permission with the js client or at least the nillion hooks attempting to grant a user default user permissions for his own secret leads to an error where the user can no longer access the secret again. 
Attempting 
''' 
StoreAcl.createDefaultForUser(<sameuser's_id>)
compute_acl = acl.allowCompute(UserId.parse(other_user_id), ProgramId.parse(program_id))
''' 

just results in inconsistent behaviour, the user id is not longer able to access thier own secret and the other user id isnt also able to compute on the secret. It errors out
As a work around in my code i am currently granting the poll owner user full default user and compute permissions, this will be tweaked once the functionality is working as this isnt the intended design

## Near term Improvement
- Add more fluid poll configuration options
- finish implementing private poll visibility, ie add an option for passcode access and use that passcode to encrypt the poll owners question and options so that the backend server doesnt even have that information at all, and only knows about the poll's configs
- List the results of Polls that choose to be public on the site as a feed, for people to either choose to participate in or view results

## Future/Far term Improvements or goals
- Develop into a full fledged Annoymous?federated social media platform
- Match users blindly by performing blind computation on the lists of thier privately stored preferences to see if they are compatible