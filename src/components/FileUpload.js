import React ,{useState} from 'react';
import axios from 'axios';
import {getThumbnails} from 'video-metadata-thumbnails'

const FileUpload = () => {

    const [state,setState] = useState({file:null});

    const getImage = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fil = e.target.files[0];
            setState({ file:fil})
          }
        // var _CANVAS = document.querySelector("#video-canvas"),
        // _CTX = _CANVAS.getContext("2d"),
        // _VIDEO = document.querySelector("#main-video");
        if(e.target.files[0].type == 'video/mp4') {
            // document.querySelector("#main-video source").setAttribute('src', URL.createObjectURL(document.querySelector("#file-to-upload").files[0]));
            // _VIDEO.load();
            // _VIDEO.style.display = 'inline';
            // _VIDEO.addEventListener('loadedmetadata', () => {
            //     _CANVAS.width = _VIDEO.videoWidth;
            //     _CANVAS.height = _VIDEO.videoHeight;
            //     _VIDEO.currentTime = '10';
            // });
            // document.querySelector("#get-thumbnail").addEventListener('click', function() {
            //     _CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth, _VIDEO.videoHeight);
            //     var image =  _CANVAS.toDataURL()
            //     console.log(image);
            //     document.querySelector("#get-thumbnail").setAttribute('href', _CANVAS.toDataURL());
            //     document.querySelector("#get-thumbnail").setAttribute('download', 'thumbnail.png');
            // });
            const thumbnails = await getThumbnails(e.target.files[0], {
                quality: 0.6,
                interval:1,
                scale:0.7,
                start:1,
                end:1
              });
              console.log(thumbnails);
        }
    }

    const  uploadFile = (e) => {
        e.preventDefault();
        const generatePutUrl = 'https://staging-commonbackend.familheey.com/api/v1/familheey/generateSignedUrl';
        var params = {};
        if(state.file.type == 'image/jpeg') {
            params = {
                filename: `${Date.now().toString()}.jpg`,
                filetype: state.file.type
            }
        }
        else if(state.file.type == 'video/mp4') {
            params = {
                filename: `${Date.now().toString()}.mp4`,
                filetype: state.file.type
            }
        }
          const headers = {
            'Authorization': '',
            'logined_user_id':''
          }

        var config = {
            headers: {
                'Content-type': state.file.type
            },
            onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                console.log(percentCompleted);  
            }
        };
        axios.post(generatePutUrl, params,{headers:headers}).then(res => {
          console.log("asd",res.data.signedUrl);
          axios
            .put(res.data.signedUrl, state.file,config)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log('err', err);
            });
        });
      };


    return (
        <div>
            <form onSubmit={uploadFile}>
            <input type="file" id="file-to-upload" onChange={getImage}/>
            {/* <video id="main-video" hidden={true} >
                <source type = "video/mp4" hidden={true}></source>
            </video>
            <canvas id="video-canvas" hidden={true}></canvas>
            <div id="thumbnail-container" >
                <a id="get-thumbnail" href="#">Download Thumbnail</a>
            </div> */}
            <button id='file-upload-button'>Upload</button>
            </form>
        </div>
    );

};

export default FileUpload;