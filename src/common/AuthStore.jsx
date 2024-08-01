import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userId: localStorage.getItem('userId'),
  username: localStorage.getItem('username'),
  userPicture: localStorage.getItem('userPicture'),
  checkSession: async () => {
    try {
      console.log('Checking session...');
      const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/check_session', {
        method: 'GET',
        credentials: 'include' // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const user = await response.json();
        console.log('User session found:', user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('userPicture', user.picture);
        set({ isLoggedIn: true, userId: user.id, username: user.username, userPicture: user.picture });
      } else {
        console.log('No user session found');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userPicture');
        set({ isLoggedIn: false, userId: null, username: '', userPicture: '' });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  },
  login: async (credentials, navigate) => {
    try {
      const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('username', user.username);
        localStorage.setItem('userPicture', user.picture);
        set({ isLoggedIn: true, userId: user.userId, username: user.username, userPicture: user.picture });
        navigate('/pantry');
      } else {
        const data = await response.json();
        if (response.status === 404) {
          console.error(data.error);
          alert('Email not found');
        } else if (response.status === 401) {
          console.error(data.error);
          alert('Invalid password');
        } else {
          console.error(data.message);
          alert('An error occurred. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  },
  logout: async (navigate) => {
    try {
      const response = await fetch('https://pantry-pal-backend-l9st.onrender.com/logout', {
        method: 'DELETE',
      });
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userPicture');
        set({ isLoggedIn: false, userId: null, username: '', userPicture: '' });
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },
  deleteAccount: async (userId, handleLogout) => { // Pass userId as an argument
    try {
      const response = await fetch(`https://pantry-pal-backend-l9st.onrender.com/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        handleLogout()
      } else {
        console.error('Delete account failed');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  },
}));

export default useAuthStore;
