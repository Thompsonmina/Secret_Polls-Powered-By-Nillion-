from nada_dsl import *

def nada_main():

    party1 = Party(name="Party1")
    party2 = Party(name="Party2")
    party3 = Party(name="Party3")

    da1 = SecretInteger(Input(name="da1", party=party1))
    da2 = SecretInteger(Input(name="da2", party=party1))

    db1 = SecretInteger(Input(name="db1", party=party2))
    db2 = SecretInteger(Input(name="db2", party=party2))


    # recieve input as an np array?

    tc1 = SecretInteger(Input(name="tc1", party=party3))
    tc2 = SecretInteger(Input(name="tc2", party=party3))
    tc3 = SecretInteger(Input(name="tc3", party=party3))
    tc4 = SecretInteger(Input(name="tc4", party=party3))
    tc5 = SecretInteger(Input(name="tc5", party=party3))

    table_cards = [tc1, tc2, tc3, tc4, tc5]

    ranks_suite = [ (get_suite(c), get_rank(c)) for c in table_cards]

    # return [Output(get_rank(da1), "my_output", party1)]

    b = (Integer(2), Integer(55))
    bc = [b]

    r = create_histogram(ranks_suite, nada_not)


    return [Output(r[i][2], "my_output" + str(i), party1) for i in range(5)]

def get_suite(num: SecretInteger) -> SecretInteger:
    return num / Integer(13)

def get_rank(num: SecretInteger) -> SecretInteger:
    return num % Integer(13)

def nada_not(bool: Boolean) -> Boolean:
    return bool.if_else(Integer(1), Integer(0)) == Integer(0)

def create_histogram(array: List[Tuple[SecretInteger, SecretInteger]], not_op: nada_fn) -> List[List[SecretInteger]]:
    # histo = {}
    histogram = [ [c[0], c[1], Integer(0)] for c in array]
    for i in range(5):
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
        

        rank_matches_1st_item = histogram[0][1] == array[i][1]
        update_0 = rank_matches_1st_item.if_else(histogram[0][2] + Integer(1), histogram[0][2])
        histogram[0][2] = update_0

        # not_rank_matches_1st_item = rank_matches_1st_item.if_else(Integer(1), Integer(0)) == Integer(0)
        not_rank_matches_1st_item = not_op(rank_matches_1st_item)

        rank_only_matches_2nd_item = (not_rank_matches_1st_item).if_else((histogram[1][1] == array[i][1]).if_else(Integer(1), Integer(0)) , Integer(0)) == Integer(1)
        update_1 = rank_only_matches_2nd_item.if_else(histogram[1][2] + Integer(1), histogram[1][2])
        histogram[1][2] = update_1

        # not_rank_matches_2nd_item = (histogram[1][1] == array[i][1]).if_else(Integer(1), Integer(0)) == Integer(0)
        not_rank_matches_2nd_item = not_op(histogram[1][1] == array[i][1])
        not_match_1st_and_2nd_item = not_rank_matches_1st_item.if_else(not_rank_matches_2nd_item.if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
        
        rank_only_matches_3rd_item = not_match_1st_and_2nd_item.if_else((histogram[2][1] == array[i][1]).if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
        update_2 = rank_only_matches_3rd_item.if_else(histogram[2][2] + Integer(1), histogram[2][2])
        histogram[2][2] = update_2


        # not_rank_matches_3rd_item = (histogram[2][1] == array[i][1]).if_else(Integer(1), Integer(0)) == Integer(0)
        not_rank_matches_3rd_item = not_op(histogram[2][1] == array[i][1])
        not_rank_matches_1st_2nd_and_3rd_item = not_match_1st_and_2nd_item.if_else(not_rank_matches_3rd_item.if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)

        rank_only_matches_4th_item = not_rank_matches_1st_2nd_and_3rd_item.if_else((histogram[3][1] == array[i][1]).if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
        update_3 = rank_only_matches_4th_item.if_else(histogram[3][2] + Integer(1), histogram[3][2])
        histogram[3][2] = update_3


        not_rank_matches_4th_item = (histogram[3][1] == array[i][1]).if_else(Integer(1), Integer(0)) == Integer(0)
        not_rank_matches_1st_2nd_3rd_and_4th_item = not_rank_matches_1st_2nd_and_3rd_item.if_else(not_rank_matches_4th_item.if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
        
        rank_only_matches_5th_item = not_rank_matches_1st_2nd_3rd_and_4th_item.if_else((histogram[4][1] == array[i][1]).if_else(Integer(1), Integer(0)), Integer(0)) == Integer(1)
        update_4 = rank_only_matches_5th_item.if_else(histogram[4][2] + Integer(1), histogram[4][2])
        histogram[4][2] = update_4




    return histogram
