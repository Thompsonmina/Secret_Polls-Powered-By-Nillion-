from nada_dsl import *

def nada_main():

    party1 = Party(name="Party1")

    my_int1 = SecretInteger(Input(name="A", party=party1))
    my_int2 = SecretInteger(Input(name="B", party=party1))
    new_int = my_int1 + my_int2

    return [Output(new_int, "my_output", party1)]