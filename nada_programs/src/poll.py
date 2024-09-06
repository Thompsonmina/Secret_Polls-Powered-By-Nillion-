from nada_dsl import *
import nada_numpy as na

options = [i for i in range(1, 5)]
def nada_main():

    pollowner  = Party(name="poll_owner")
    starting_val = SecretInteger(Input(name="starting_val", party=pollowner))


    num_particpants = 2
    participants = na.parties(num_particpants, [f"Participant{i}" for i in range(num_particpants)])
    # participant1 = Party(name="Participant1")

    responses = []
    for i in range(num_particpants):
        responses.append( SecretInteger(Input(name=f"poll_1_p{i}_response" + str(i), party=participants[i])) )

    # option_participant1 = SecretInteger(Input(name="option_poll_1", party=participant1))

    poll_results = {
       option: count_total_response_for_option(responses, Integer(option), starting_val)  for option in options
    }

    # print(poll_results)

    output_poll_results = [
        Output(response, f"option-{option}", party=pollowner)
        for option, response in poll_results.items()
    ]
    # print(output_poll_results)

    return output_poll_results



def count_total_response_for_option(all_responses: List[SecretInteger], option: Integer, startVal: SecretInteger) -> SecretInteger:
    # total_votes_for_candidate = initialValue
    # for vote in votes:
    #     votes_to_add = (vote == candidate_id).if_else(Integer(1), Integer(0))
    #     # print(type(votes_to_add)) # every voter's vote is kept secret: <class 'nada_dsl.nada_types.types.SecretInteger'>
    #     total_votes_for_candidate = total_votes_for_candidate + votes_to_add
    
    # return total_votes_for_candidate

    total_response_for_option = startVal
    for response in all_responses:
        add_to_option = ( response == option).if_else(Integer(1), Integer(0))
        total_response_for_option = total_response_for_option + add_to_option

    return total_response_for_option

    
nada_main()


