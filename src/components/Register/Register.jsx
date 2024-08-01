import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./RegisterStyles.module.css"


function Register() {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });
  

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Redirect to login page after successful signup
        alert('Signed up successfully');
        navigate('/login');
      } else {
        const data = await response.json();
        console.error(data.error); // Log the error message
        alert('Failed to sign up. Please check your input and try again.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  
    setSubmitting(false); // Reset submitting state
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register / Sign Up</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formField}>
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" className={styles.formInput} />
              <ErrorMessage name="username" component="div" className={styles.errorMessage} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className={styles.formInput} />
              <ErrorMessage name="email" component="div" className={styles.errorMessage} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className={styles.formInput} />
              <ErrorMessage name="password" component="div" className={styles.errorMessage} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" name="confirmPassword" className={styles.formInput} />
              <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage} />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.formButton}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
      <div className={styles.loginLink}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Register;