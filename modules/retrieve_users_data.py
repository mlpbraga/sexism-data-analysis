from datetime import datetime
import pandas as pd

DATAFRAME_PATH = './data/users-df.csv'

def latex_command_format(name, value):
    return '\\newcommand{\\'+name+'}{'+str(value)+'}'

def percentage(value, total):
    percent =  '%.2F' % ((value/total)*100)
    percent = percent.replace('.', ',')
    return percent + '\\%'

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
    def __init__(self, conn=None, remake=False, dataframe_path=DATAFRAME_PATH, df=None):
        users_df = df
        if df is None:
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
        self.total = self.users_df.shape[0]

        self.woman_total = self.count_gender_filter('fem')
        self.male_total = self.count_gender_filter('masc')
        self.other_total = self.count_gender_filter('other')
        self.woman_percentage = percentage(self.woman_total,self.total)
        self.male_percentage = percentage(self.male_total,self.total)
        self.other_percentage = percentage(self.other_total,self.total)

    def count_gender_filter(self, gender):
        count_users = self.users_df.groupby(['gender'])['username'].count()
        return count_users[gender]
    
    def latex_variables(self):
        print(latex_command_format('totalusers',self.total))
        print(latex_command_format('womantotal',self.woman_total))
        print(latex_command_format('maletotal',self.male_total))
        print(latex_command_format('othertotal',self.other_total))
        print(latex_command_format('womanpercentage',self.woman_percentage))
        print(latex_command_format('malepercentage',self.male_percentage))
        print(latex_command_format('otherpercentage',self.other_percentage))
