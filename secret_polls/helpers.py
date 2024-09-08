

def generate_script_file(num_participants, poll_num, override_parties=True, filename=None):
        
    # Base template with placeholders for dynamic logic
    template = '''
from nada_dsl import *
import nada_numpy as na

options = [i for i in range(1, 5)]
def nada_main():

    pollowner  = Party(name="poll_owner")
    starting_val = SecretInteger(Input(name="starting_val", party=pollowner))

    num_particpants = {num_participants}
{participants_declaration}

    responses = []
    for i in range(num_particpants):
        responses.append( SecretInteger(Input(name=f"poll_{poll_num}_p{{i + 1}}_response", party={response_party})) )

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
    
    # Conditional logic based on override_parties
    if override_parties:
        participants_declaration = "# participants = na.parties(num_particpants, [f\"Participant{{i + 1}}\" for i in range(num_particpants)])"
        response_party = "pollowner"
    else:
        participants_declaration = "participants = na.parties(num_particpants, [f\"Participant{{i + 1}}\" for i in range(num_particpants)])"
        response_party = "participants[i]"

    # Replace placeholders with provided values and logic
    script_content = template.format(
        num_participants=num_participants, 
        poll_num=poll_num,
        participants_declaration=participants_declaration,
        response_party=response_party
    )
    if filename:
        # Write the script to a Python file
        with open(filename, 'w') as file:
            file.write(script_content)

        print(f"Script successfully written to {filename}")

    return script_content

# Example usage
# generate_script_file(5, 3, override_parties=True, filename='generated_poll_script.py')
