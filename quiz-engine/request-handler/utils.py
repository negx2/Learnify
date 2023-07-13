import copy


class QuizUpdater:

    def __init__(self, quiz):
        self.quiz = copy.deepcopy(quiz)

    def get_quiz(self):
        return self.quiz

    def update_quiz_title(self, new_title):
        self.quiz['quiz_title'] = new_title
        return self

    def update_question_text(self, question_number, new_text):
        self.quiz['questions'][question_number - 1]['question_text'] = new_text
        return self

    def update_choice(self, question_number, choice_number, new_text, is_correct):
        self.quiz['questions'][question_number -
                               1]['choices'][choice_number - 1]['choice_text'] = new_text
        self.quiz['questions'][question_number -
                               1]['choices'][choice_number - 1]['is_correct'] = is_correct
        return self

    def remove_question(self, question_number):
        self.quiz['questions'].pop(question_number - 1)
        return self

    def update_quiz_id(self, new_id):
        self.quiz['quiz_id'] = new_id
        return self

    def test_update_quiz(self):
        pass
