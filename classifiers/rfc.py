import numpy as np
import matplotlib.pyplot as plt
from classifiers.base import BaseClassifier
from sklearn.ensemble import RandomForestClassifier

class RFC(BaseClassifier):
    def __init__(self):
        self.classifier = RandomForestClassifier
        self.data_path = './data/rfc'
        self.nickname = 'RFC'
        
    def get_feature_importances(self, model, X, y):
        importances = model.best_estimator_.feature_importances_
        std = np.std([tree.feature_importances_ for tree in model.best_estimator_.estimators_],
                    axis=0)
        indices = np.argsort(importances)[::-1]

        # Print the feature ranking
        print("Feature ranking:")

        for f in range(X.shape[1]):
            print("%d. feature %d (%f)" % (f + 1, indices[f], importances[indices[f]]))

        # Plot the impurity-based feature importances of the forest
        plt.figure()
        plt.title("Feature importances")
        plt.bar(range(X.shape[1]), importances[indices],
                color="r", yerr=std[indices], align="center")
        plt.xticks(range(X.shape[1]), indices)
        plt.xlim([-1, X.shape[1]])
        plt.show()
