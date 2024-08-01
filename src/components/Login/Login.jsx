// Login.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../common/AuthStore'
import styles from "./LoginStyles.module.css"


function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await login(values, navigate);
    } catch (error) {
      console.error('Error occurred:', error);
    }
    
    setSubmitting(false); // Reset submitting state
    resetForm();
  };
  
  

  return (
    <div className={styles.container}> {/* Add class name for container */}
      <h2 className={styles.title}>Login</h2> {/* Add class name for title */}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className={styles.form}> {/* Add class name for form */}
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className={styles.formInput} /> {/* Add class name for input */}
              <ErrorMessage name="email" component="div" className={styles.errorMessage} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className={styles.formInput} /> {/* Add class name for input */}
              <ErrorMessage name="password" component="div" className={styles.errorMessage} />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.formButton}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <div className={styles.registerLink}>
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}

export default Login;