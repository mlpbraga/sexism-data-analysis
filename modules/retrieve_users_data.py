from datetime import datetime
import pandas as pd

DATAFRAME_PATH = './data/users-df.csv'

def calculate_age(birth):
    today = datetime.now()
    age = today.year - birth.year - \
        ((today.month, today.day) < (birth.month, birth.day))
    return age

def retrieve_users_from_db(conn):
    print('Retrieving from original database...')
    users_df = pd.read_sql_query(
        'select username, email, birth, gender from users;', conn)
    users_df['age'] = users_df['birth'].apply(calculate_age)
    return users_df

class Users:
    def __init__(self, conn=None, remake=False, dataframe_path=DATAFRAME_PATH):
        users_df = None
        if remake:
            users_df = retrieve_users_from_db(conn)
            users_df.to_csv(dataframe_path, index=False)
        else:
            try:
                users_df = pd.read_csv(dataframe_path)
            except:
                users_df = retrieve_users_from_db(conn)
                users_df.to_csv(dataframe_path, index=False)
        self.users_df = users_df