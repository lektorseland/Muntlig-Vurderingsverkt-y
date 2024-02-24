from numpy import array, zeros
criteria_scores = [6, 5, 6, 6]
weights = array([1, 10, 1, 1])
grade_percentages = [10, 31, 50, 66.5, 83.5, 100]
grade_thresholds = [0, 20, 42, 58, 75, 92]
adjusted_weights = weights/sum(weights)

average = 0
for i in range(len(criteria_scores)):
    ind = criteria_scores[i] - 1
    average += grade_percentages[ind]*adjusted_weights[i]

print(average)


if average > grade_thresholds[-1]:
    print("Karakter", 6)
else:
    i = 0
    while average > grade_thresholds[i]:
        i += 1
    print("Karakter",i)