
from modules.select_features import select_features

class Features:
    def __init__(self, dataframe):
        self.char_qty = select_features(dataframe, column='char-qty')
        self.word_qty = select_features(dataframe, column='word-qty')
        self.likes = select_features(dataframe, column='likes')
        self.dislikes = select_features(dataframe, column='dislikes')
        self.likes_dislikes = select_features(dataframe, columns=['likes','dislikes'])
        self.char_word_qty = select_features(dataframe, columns=['char-qty','word-qty'])
        self.likes_dislike_char_words = select_features(dataframe, columns=['likes','dislikes','char-qty','word-qty'])
        self.tf = select_features(dataframe, column='tf')
        self.tf_100_sexist_words = select_features(dataframe, column='tf-sexist')
        self.tf_100_not_sexist_words = select_features(dataframe, column='tf-no-sexist')
        self.tf_sexist_bigrams = select_features(dataframe, column='sexist-bigrams')
        self.tf_not_sexist_bigrams = select_features(dataframe, column='not-sexist-bigrams')
        self.tf_bigrams = select_features(dataframe, column='bigrams')
        self.tf_ngrams_bigrams = select_features(dataframe, column='tf-bigrams')
        self.tf_100_not_sexist_words = select_features(dataframe, column='tf-no-sexist')
        self.y = dataframe['sexist'].astype(int)