
from nada_dsl import *
import nada_numpy as na

options = [i for i in range(1, 5)]
def nada_main():

    pollowner  = Party(name="poll_owner")
    starting_val = SecretInteger(Input(name="starting_val", party=pollowner))

    num_particpants = 5
# participants = na.parties(num_particpants, [f"Participant{{i + 1}}" for i in range(num_particpants)])

    responses = []
    for i in range(num_particpants):
        responses.append( SecretInteger(Input(name=f"poll_3_p{i + 1}_response", party=pollowner)) )

    poll_results = {
       option: count_total_response_for_option(responses, Integer(option), starting_val)  for option in options
    }

    output_poll_results = [
        Output(response, f"option-{option}", party=pollowner)
        for option, response in poll_results.items()
    ]

    return output_poll_results

def count_total_response_for_option(all_responses: List[SecretInteger], option: Integer, startVal: SecretInteger) -> SecretInteger:
    total_response_for_option = startVal
    for response in all_responses:
        add_to_option = ( response == option).if_else(Integer(1), Integer(0))
        total_response_for_option = total_response_for_option + add_to_option

    return total_response_for_option


