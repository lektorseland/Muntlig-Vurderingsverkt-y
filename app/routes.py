from flask import render_template, request, redirect, url_for
from app import app
from app.utils import calculate_score

# Example criteria list
grading_criteria = ["Content", "Delivery", "Visuals", "Engagement"]

@app.route('/')
def index():
    # Pass the criteria to the template
    return render_template("index.html", criteria=grading_criteria)

@app.route('/add_criterion', methods=['POST'])
def add_criterion():
    new_criterion = request.form.get('new_criterion')
    if new_criterion:
        grading_criteria.append(new_criterion)
    return redirect(url_for('index'))

@app.route('/edit_criterion', methods=['GET'])
def edit_criterion():
    old_name = request.args.get('old')
    new_name = request.args.get('new')
    if old_name in grading_criteria:
        index = grading_criteria.index(old_name)
        grading_criteria[index] = new_name
    return redirect(url_for('index'))

@app.route('/delete_criterion', methods=['GET'])
def delete_criterion():
    name = request.args.get('name')
    if name in grading_criteria:
        grading_criteria.remove(name)
    return redirect(url_for('index'))