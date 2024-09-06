from nada_dsl import *

def nada_main():

    # party1 = Party(name="Party1")
    # party2 = Party(name="Party2")

    party3 = Party(name="Party3")

    # da1 = SecretInteger(Input(name="da1", party=party1))
    # da2 = SecretInteger(Input(name="da2", party=party1))

    # db1 = SecretInteger(Input(name="db1", party=party2))
    # db2 = SecretInteger(Input(name="db2", party=party2))

    # recieve input as an np array?

    tc1 = SecretInteger(Input(name="tc1", party=party3))
    tc2 = SecretInteger(Input(name="tc2", party=party3))
    tc3 = SecretInteger(Input(name="tc3", party=party3))
    tc4 = SecretInteger(Input(name="tc4", party=party3))
    tc5 = SecretInteger(Input(name="tc5", party=party3))
    
    table_cards = [tc1, tc2, tc3, tc4, tc5]

    ranks_suite = [ (get_suite(c), get_rank(c)) for c in table_cards]

    # return [Output(get_rank(tc3), "my_output", party3)]

    cards = create_histogram(ranks_suite, nada_not, nada_and)

    largest = largest_pair([ c[2] for c in cards ])

    is_4_of_kind = largest[0] == Integer(4)
    is_full_house = nada_and((largest[0] == Integer(3)), (largest[1] == Integer(2)))
    is_3_of_kind = nada_and((largest[0] == Integer(3)), (largest[1] == Integer(1)))
    is_2_pair = nada_and((largest[0] == Integer(2)), (largest[1] == Integer(2)))
    is_1_pair = nada_and((largest[0] == Integer(2)), (largest[1] == Integer(1)))

    x_arr = (Integer(1),)
    n = nada_not(tc1 == Integer(3))
    # n = nada_not(largest[0] == Integer(3))
    # a = nada_and((Integer(2) == Integer(3)), (Integer(43) == Integer(21)))
    # o = nada_or((Integer(2) == Integer(3)), (Integer(4) == Integer(4)))
    
    # return [Output(o.if_else(Integer(10), Integer(100)), "orcheck", party3)]




    return [Output(Integer(3), "my_output" + str(i), party3) for i in range(2)]
    # return [Output(largest[i], "my_output" + str(i), party3) for i in range(2)]


def get_suite(num: SecretInteger) -> SecretInteger:
    return num / Integer(13)

def get_rank(num: SecretInteger) -> SecretInteger:
    return num % Integer(13)

def nada_not(bool: Boolean) -> Boolean:
    return bool.if_else(Integer(1), Integer(0)) == Integer(0)

def nada_and(bool1: Boolean, bool2: Boolean) ->  Boolean:
    return bool1.if_else(bool2.if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)

def nada_or(bool1: Boolean, bool2: Boolean) ->  Boolean:
    return bool1.if_else(bool2.if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
    return bool1.if_else(Integer(1), bool2.if_else(Integer(1), Integer(0))) == Integer(1)

def largest_pair(array: List[Integer]) -> Tuple[Integer, Integer]:
    
    # largest_index = (array[0] > array[1]).if_else(Integer(0), Integer(1))
    # second_largest_index = Integer(1) - largest_index



    largest_num = (array[0] > array[1]).if_else(array[0], array[1])
    second_largest_num = (largest_num == array[0]).if_else(array[1], array[0])

    for i in range(2, 5):
        is_largest_still_large = largest_num > array[i]

        # if the currently largest number isnt larger than the current number then check if its larger than second largest
        second_largest_num = is_largest_still_large.if_else((second_largest_num > array[i]).if_else(second_largest_num, array[i]), largest_num)
        largest_num = is_largest_still_large.if_else(largest_num, array[i])

        # second_largest_index = is_largest_still_large.if_else((array[second_largest_index] > array[i]).if_else(second_largest_index, i), largest_index)
        # largest_index = is_largest_still_large.if_else(largest_index, i)

    return (largest_num, second_largest_num)

def is_flush(array: List[Integer], or_op: nada_fn) -> Boolean:

    same_suite = Boolean(True)
    product = Integer(1)
    for i in range(5):
        product = product * array[i]

    return or_op((product == Integer(1)), (product == Integer(32)))


def create_histogram(array: List[Tuple[SecretInteger, SecretInteger]], not_op: nada_fn, and_op: nada_fn) -> List[List[SecretInteger]]:
    """ Creates a histogram based on rank that we eventually use to evalute our hand"""

    histogram = [ [c[0], c[1], Integer(0)] for c in array]

     # this logic is implemented with nada primitives for each iteration

    #     if histogram[0][1] == array[i][1]:
    #        histogram[0][2] =  histogram[0][2] + Integer(1)
    #     elif array[1][1] == array[i][1]:
    #         histogram[1][2] =  histogram[1][2] + Integer(1)
    #     elif array[2][1] == array[i][1]:
    #         histogram[2][2] =  histogram[2][2] + Integer(1)
    #     elif array[3][1] == array[i][1]:
    #         histogram[3][2] =  histogram[3][2] + Integer(1)
    #     else:
    #         histogram[4][2] =  histogram[4][2] + Integer(1)
        
    for i in range(5):


        rank_matches_1st_item = histogram[0][1] == array[i][1]
        update_0 = rank_matches_1st_item.if_else(histogram[0][2] + Integer(1), histogram[0][2])
        histogram[0][2] = update_0

        not_rank_matches_1st_item = not_op(rank_matches_1st_item)

        rank_only_matches_2nd_item = and_op(not_rank_matches_1st_item, (histogram[1][1] == array[i][1]))
        update_1 = rank_only_matches_2nd_item.if_else(histogram[1][2] + Integer(1), histogram[1][2])
        histogram[1][2] = update_1

        not_rank_matches_2nd_item = not_op(histogram[1][1] == array[i][1])
        not_match_1st_and_2nd_item = and_op(not_rank_matches_1st_item, not_rank_matches_2nd_item)
    
        rank_only_matches_3rd_item = and_op(not_match_1st_and_2nd_item, (histogram[2][1] == array[i][1]))
        update_2 = rank_only_matches_3rd_item.if_else(histogram[2][2] + Integer(1), histogram[2][2])
        histogram[2][2] = update_2

        not_rank_matches_3rd_item = not_op(histogram[2][1] == array[i][1])
        not_rank_matches_1st_2nd_and_3rd_item = and_op(not_match_1st_and_2nd_item, not_rank_matches_3rd_item)

        rank_only_matches_4th_item = and_op(not_rank_matches_1st_2nd_and_3rd_item,(histogram[3][1] == array[i][1]))
        update_3 = rank_only_matches_4th_item.if_else(histogram[3][2] + Integer(1), histogram[3][2])
        histogram[3][2] = update_3

        not_rank_matches_4th_item = not_op(histogram[3][1] == array[i][1])
        not_rank_matches_1st_2nd_3rd_and_4th_item = and_op(not_rank_matches_1st_2nd_and_3rd_item, not_rank_matches_4th_item)
        
        rank_only_matches_5th_item = and_op(not_rank_matches_1st_2nd_3rd_and_4th_item, (histogram[4][1] == array[i][1]))
        update_4 = rank_only_matches_5th_item.if_else(histogram[4][2] + Integer(1), histogram[4][2])
        histogram[4][2] = update_4


    return histogram
