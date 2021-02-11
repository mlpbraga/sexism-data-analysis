from classifiers.base import BaseClassifier
from sklearn.neighbors import KNeighborsClassifier

class KNN(BaseClassifier):
    def __init__(self):
        self.classifier = KNeighborsClassifier
        self.data_path = './data/knn'
        self.nickname = 'KNN'