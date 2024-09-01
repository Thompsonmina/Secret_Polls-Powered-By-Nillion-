

from nada_dsl import *
import nada_numpy as na

def nada_main():
    parties = na.parties(3)

    a = na.array([3], parties[0], "A", SecretInteger)
    b = na.array([3], parties[1], "B", SecretInteger)

    result = a + b

    return result.output(parties[2], "my_output")
