from classifiers.base import BaseClassifier
from sklearn.svm import SVC

class SVM(BaseClassifier):
    def __init__(self):
        self.classifier = SVC
        self.data_path = './data/svm'
        self.nickname = 'SVM'