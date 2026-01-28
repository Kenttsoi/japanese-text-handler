
s = "いっせきにちょう"
print(len(s))

list1 = ['いち', 'いつ', 'ひと', 'ひと', 'かず', 'い', 'いっ', 'いる', 'かつ', 'かづ', 'てん', 'はじめ', 'ひ', 'ひとつ', 'まこと']
list2 = ['せき', 'しゃく', 'こく', 'いし', 'いさ', 'いす', 'いわ', 'し', 'せっく', 'と']
list3 = ['に', 'じ', 'ふた', 'ふた', 'ふたたび', 'おと', 'つぐ', 'つぎ', 'にい', 'は', 'ふ', 'ふたつ', ' ふだ', 'わ']
list4 = ['ちょう', 'とり', 'か', 'と', 'とっ']
lists = [list1, list2, list3, list4]

num_parts = 4
require_different_groups = True

def find_parts(s, lists, num_parts=4, require_different_groups=True):
    # DP
    print("start")
    n = len(s) # s length
    dp = [-1] * (n + 1) # -1 means not done
    prev = [None] * (n + 1)
    dp[0] = 0 # mask = 0
    
    for i in range(n + 1):
        print("NEW i:", i)
        print("NEW DP[i]", dp[i])
        if dp[i] == -1: continue
        stage = dp[i]
        if stage >= 4: continue
        current_list = lists[stage]
        print("CURRENT LIST", lists[stage])
        for word in current_list:
            print('----------------', i)
            print('WORD LOOP FROM LIST: ', word)
            print('CUT THE STRING', s[0:i + len(word)])
            if s[i : i + len(word)] == word:
                j = i + len(word)
                new_stage = stage + 1
                print("MATCH", word)
                if dp[j] == -1:
                    dp[j] = new_stage
                    prev[j] = (i, stage, word)
            else:
                print("NOT MATCH", word)
        print("DP", dp)
        print("PREV", prev)
                
                

        



    


find_parts(s, lists)