import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Cookies, useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


function Mainpage() {
    const [ user, setUser ] = useState('');
    const [image, setImage] = useState('https://picsum.photos/id/237/200/300')
    const [ cookies, setCookie, removeCookie ] = useCookies(['user']);
    let navigate = useNavigate();

    // GETS THE CURRENT LOGGED IN USER
    const getUser = async () => {
      try {
        const userEmail = cookies.UserEmail;
        const response = await axios.get('/user', {
          params: {userEmail}
        })
        setUser(response.data);
      } catch (error) {
        console.log("Axios failed");
      } 
    }
    
    // REMOVES COOKIES AKA LOGS USER OUT AND NAVIGATES BACK TO HOME PAGE
    const Logout = () => {
      removeCookie('UserEmail');
      removeCookie('UserID');
      removeCookie('AuthToken');
      navigate('/home')
    }

    // Uploads image to server
    const uploadImage = async (e) => {
      e.preventDefault();
      let formData = new FormData();
      const file = document.getElementById('file_upload').files[0]
      setImage(URL.createObjectURL(file));
      formData.append('image', file);
      formData.append('user', cookies.UserEmail);

      try {
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        console.log("Axios failed");
      }
    }

    useEffect(() => {
      getUser();
    }, [])

  return (
    <>
    <h1>Hi {user.name}!</h1>
    <div className="img-div">
      <div className="img-container">
        <img src={image}/>
      </div>
    </div>
    <div className="ai-div">
        <p>Enter your prompt for AI image creation here</p>
        <div className="ai-container">
          <textarea style={{width: '40%', backgroundColor: '#fff', textAlign: 'center'}}></textarea>
        </div>
        <button type="submit" className="btn-small">Create Image</button>
    </div>
    <div className="filesend-div">
        <p>Enter a file you want to upload</p>
        <div className="file-container">
          <form>
            <input type="file" id="file_upload" name="file_upload" className="file_upload" accept="image/*"/>
          </form>
        </div>
        <button type="submit" className="btn-small" onClick={uploadImage}>Upload Image</button>
    </div>
    <div className="footer-div">
      <a href="/home" onClick={Logout}>Logout</a>
      <a href="/browse">Browse images</a>
    </div>
  </>
  )
}

export default Mainpage
