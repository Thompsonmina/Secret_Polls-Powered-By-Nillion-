def generate_script_file(num_participants, poll_num, filename):
    template = '''
from nada_dsl import *
import nada_numpy as na

options = [i for i in range(1, 5)]
def nada_main():

    pollowner  = Party(name="poll_owner")
    starting_val = SecretInteger(Input(name="starting_val", party=pollowner))

    num_particpants = {num_participants}
    participants = na.parties(num_particpants, [f"Participant{{i}}" for i in range(num_particpants)])

    responses = []
    for i in range(num_particpants):
        responses.append( SecretInteger(Input(name=f"poll_{poll_num}_p{{i}}_response" + str(i), party=participants[i])) )

    poll_results = {{
       option: count_total_response_for_option(responses, Integer(option), starting_val)  for option in options
    }}

    output_poll_results = [
        Output(response, f"option-{{option}}", party=pollowner)
        for option, response in poll_results.items()
    ]

    return output_poll_results

def count_total_response_for_option(all_responses: List[SecretInteger], option: Integer, startVal: SecretInteger) -> SecretInteger:
    total_response_for_option = startVal
    for response in all_responses:
        add_to_option = ( response == option).if_else(Integer(1), Integer(0))
        total_response_for_option = total_response_for_option + add_to_option

    return total_response_for_option

nada_main()
'''
    # Replace placeholders with provided values
    script_content = template.format(num_participants=num_participants, poll_num=poll_num)
    
    # Write the script to a Python file
    with open(filename, 'w') as file:
        file.write(script_content)

    print(f"Script successfully written to {filename}")

# Example usage
generate_script_file(5, 3, 'generated_poll_script.py')
