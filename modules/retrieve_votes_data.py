from datetime import datetime

import pandas as pd

DATAFRAME_PATH = './data/votes_per_user.csv'

def retrieve_users_from_db(conn):
    print('Retrieving from original database...')
    votes_per_user = pd.read_sql_query('''
        with q as (
            select v.vote_id,
              c.comment_id,
              v.user_id,
              v.gender,
              date_part('year',age(v.birth)) as age,
              c.content,
              v.vote,
              v.avg as label
        from comments c
                join (select v1.comment_id,
                              r.avg,
                              v1.vote_id,
                              v1.serial_id as user_id,
                              v1.user_id as id,
                              v1.vote,
                              v1.gender,
                              v1.birth
                      from (
                            select u.serial_id,v2.vote,v2.vote_id, u.gender,v2.comment_id, u.birth, v2.user_id
                            from votes v2 join ( select ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS serial_id,* from users) u on v2.user_id = u.username
                          ) v1 join results r on v1.comment_id = r.comment_id) v on c.comment_id = v.comment_id
        )
        select * from q;
        ''', conn)
    return votes_per_user

class Votes:
    def __init__(self, conn=None, remake=False, dataframe_path=DATAFRAME_PATH):
        votes_per_user = None
        if remake:  
            votes_per_user = retrieve_users_from_db(conn)
            votes_per_user.to_csv(dataframe_path, index=False)
        else:
            try:
                votes_per_user = pd.read_csv(dataframe_path)
            except:
                votes_per_user = retrieve_users_from_db(conn)
                votes_per_user.to_csv(dataframe_path, index=False)
        self.votes_per_user = votes_per_user