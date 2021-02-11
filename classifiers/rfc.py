from classifiers.base import BaseClassifier
from sklearn.ensemble import RandomForestClassifier

class RFC(BaseClassifier):
    def __init__(self):
        self.classifier = RandomForestClassifier
        self.data_path = './data/rfc'
        self.nickname = 'RFC'