# app/utils.py

def calculate_score(grades, weights):
    # Assuming grades and weights are lists of the same length
    weighted_scores = [grade * weight for grade, weight in zip(grades, weights)]
    total_weight = sum(weights)
    total_score = sum(weighted_scores) / total_weight if total_weight > 0 else 0
    return total_score

def recalibrate_weights(weights):
    total_weight = sum(weights)
    if total_weight == 0:
        return [0 for _ in weights]
    return [w / total_weight for w in weights]
