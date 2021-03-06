import React, { Component } from 'react'
import './Upload.css'
import Dropzone from 'react-dropzone'
import { ToastContainer, toast } from 'react-toastify'
import { Redirect, NavLink } from 'react-router-dom'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import Particles from 'react-particles-js';

const uploadIcon = require('../assets/up-arrow.png')
const url = `http://0e1f0eca.ngrok.io`
const spinner = require('../assets/spinner.svg')
const logo = require('../assets/logo.png')

const particlesOptions = {
  particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      size: {
          value: 6,
          random: true,
          anim: {
              speed: 5.5,
              size_min: 3
          }
      },
      line_linked: {
	            enable: false
      },
      move: {
	            random: true,
	            speed: 1,
	            direction: "top",
	            out_mode: "out"
      },
      color:  {
        value: "#fff"
      }
    },
      interactivity: {
	        events: {
	            onclick: {
	                enable: true,
	                mode: "remove"
	            }
	        },
	        modes: {
	            remove: {
	                particles_nb: 10
	            }
	        }
	    }
}

export default class Upload extends Component {
  state = {
    file: undefined,
    fileName: "",
    displayName: "",
    score: undefined
  }

  handleFileDrop = acceptedFiles => {
    if (acceptedFiles.length > 1) {
      toast.error("Please upload only 1 file!")
      return
    }

    console.log(acceptedFiles)

    let file = acceptedFiles[0]
    if (file.type != "image/jpeg") {
      toast.warn("Please upload a JPEG/JPG file!")
      return
    }
    else {
      this.setState({
        file,
        fileName: file.name
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    this.setState({ isLoading: true })

    if (this.state.file && this.state.fileName) {
      let data = new FormData()
      data.append('file', this.state.file)
      data.append('fileName', this.state.fileName)

      axios.post(`https://cors-anywhere.herokuapp.com/` + `${url}/foo`, data).then(res => {
        this.setState({
          displayName: res.data.displayName,
          score: res.data.score,
          isLoading: false
        })
      }).catch(err => {
        console.log(err)
        this.setState({ isLoading: false })
      })

    }
  }


  render() {
    if (this.state.displayName && this.state.score) {
      return  <Redirect
                to={{
                  pathname: '/results',
                  state: {
                    displayName: this.state.displayName,
                    score: this.state.score
                  }
                }} />
    }

    return (
      <div className="upload-container">
      <Particles className='particles' params={particlesOptions}/>
        <div className="row">
          <div className="logo-container">
            <NavLink to="/">
              <img src={ logo } id="logo" alt=""/>
            </NavLink>
          </div>
        </div>
        <div className="upload-desc-container">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="instruction">Upload an image here</div>
            </div>
          </div>
        </div>
            <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-1">
                <Dropzone onDrop={ this.handleFileDrop }>
                  {({getRootProps, getInputProps}) => (
                    <section>
                      <div { ...getRootProps() }>
                        <input { ...getInputProps() } />
                        <div className="upload-icon-container">
                          <img src={ uploadIcon } id="upload-icon" alt=""/>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
          </div>
          <div className="filename-container">
            { this.state.file && this.state.fileName && <p id="filename">{ this.state.fileName }</p> }
          </div>

        <div className="upload-button-container upload">
          <button type="button" class="upload-button" onClick={ this.handleSubmit }>SUBMIT</button>
        </div>
        <div className="spinner-container">
          { this.state.isLoading && <img src={ spinner } id="spinner"/> }
        </div>
        <div className="toast-container">
          <div className="container-fluid">
            <ToastContainer
              position="bottom-center"
              autoClose={ 5000 }
              hideProgressBar={ false }
              newestOnTop={ false }
              closeOnClick
              rtl={ false }
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </div>
    )
  }
}
