module.exports = [
  {
    id: 'faq_login_001',
    category: 'login',
    question_patterns: ['login failed', 'cannot login', 'verification code invalid', 'account not found'],
    answer: 'For login issues, first verify your email/username and password, then refresh and try again. If the verification code fails, request a new code. If your account cannot be found, please register first or contact support.',
    priority: 10,
    status: 'active',
    source: 'seed',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq_password_001',
    category: 'password',
    question_patterns: ['forgot password', 'reset password', 'password reset email not received'],
    answer: 'To reset your password: go to Login, click Forgot Password, enter your registered email/phone, complete verification, then sign in with the new password.',
    priority: 9,
    status: 'active',
    source: 'seed',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq_course_001',
    category: 'course',
    question_patterns: ['course progress not updated', 'where to start course', 'course materials'],
    answer: 'Please open the Course page, select your course, and complete chapters in order. If progress does not update, refresh or sign out and sign in again.',
    priority: 8,
    status: 'active',
    source: 'seed',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq_exam_001',
    category: 'exam',
    question_patterns: ['exam entry', 'exam retake', 'where to check score'],
    answer: 'Before taking the exam, make sure required course chapters are completed. After submission, check score and pass status in your account center.',
    priority: 8,
    status: 'active',
    source: 'seed',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq_congress_001',
    category: 'congress',
    question_patterns: ['congress registration', 'payment confirmation', 'invoice download'],
    answer: 'For congress registration: review event details on Congress page, complete registration form, finish payment, then check confirmation letter and invoice in email or account center.',
    priority: 8,
    status: 'active',
    source: 'seed',
    updated_at: new Date().toISOString()
  }
]
