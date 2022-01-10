# EasyShare

<img src=/public/android-chrome-512x512.png width="150" height="150" />

A MERN stack file sharing application that uses AWS' S3 storage along with the multer-S3 node package to easily share/upload files.

![GitHub](https://img.shields.io/github/license/Rajatm544/file-share?style=flat-square) ![Heroku](https://pyheroku-badge.herokuapp.com/?app=rajat-easyshare&style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/Rajatm544/file-share?style=flat-square) ![Maintenance](https://img.shields.io/maintenance/yes/2022?style=flat-square) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Getting Started

-   Fork this repo and run the `git clone <forked repo>` command from your terminal/bash.
-   `npm install` all the dependencies from the package file.
-   Create a `.env` file in the root of the directory and store the following keys in that file:
    -   MONGO_URI = Insert your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI after you create a free tier collection
    -   S3_SECRET_ACCESS_KEY = Insert the S3 bucket's Secret access key
    -   S3_ACCESS_KEY_ID = Insert the S3 bucket's access key ID <br/>
        (Note that if you choose to deploy the app, you'll need another config var called REACT_APP_BASEURL which has to be set to the deployed app's home URL)
-   Once all this is set up, you can choose to send a PR in case you add to the project!

To get the S3 bucket credentials, you will need to have the free tier account on [AWS](https://aws.amazon.com/free/) and you may also need to set the CORS policy of the S3 bucket you create to [allow cross-origin requests](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html). Once you create the S3 bucket, you can create your AWS credential keys.
You can obtain the MONGO_URI after create a collectoin on [mongodb atlas](https://www.mongodb.com/cloud/atlas).

# Demo

The app requires the user to select any file from the local storage and submit the uploaded file. Once the file upload is completed, the user is provided a download link and a shareable link. The different file formats that can are supported can be found in the **About** section of the application. The app has been deployed using Heroku's free tier plan and can be found [at this link](https://rajat-easyshare.herokuapp.com/) or in the repo description. The shareable link will be valid for 15 days after file upload, after which the document is deleted from the Database using the TTL concept.

<p align="center">

<img src="https://i.ibb.co/DD35SZN/rajat-easyshare-herokuapp-com-Laptop-with-Hi-DPI-screen.png" alt="Laptop render 1" border="0" width="534" height="300"/>
<img src="https://i.ibb.co/DQ7yJgW/rajat-easyshare-herokuapp-com-Laptop-with-Hi-DPI-screen-2.png" alt="Laptop render 2" border="0" width="534" height="300"/>
<br/>
<img src="https://i.ibb.co/WBWSd85/rajat-easyshare-herokuapp-com-Moto-G4-1-removebg-preview.png" alt="mobile render 1" border="0" width="200" height="356" /> &emsp;
<img src="https://i.ibb.co/dr0Jd1b/rajat-easyshare-herokuapp-com-Moto-G4-2.png" alt="mobile render 2" border="0" width="200" height="356" /> &emsp;
<img src="https://i.ibb.co/g6yBpJz/rajat-easyshare-herokuapp-com-Moto-G4.png" alt="mobile render about page" border="0" width="200" height="356"/>

</p>

# Info

-   The app is built using the MERN stack and uses the multer node package to handle file uploads. React hooks are used in the client-side and not class-based components.
-   The file formats that are supported by the app include png, jpg, jpeg, gif, webp, svg, ppt, pptx, doc, docx, pdf, xls and xlsx. The maximum size limit is set to 5 MB per file.
-   The app doesn't currently allow multiplt file uploads at once, instead it is designed to upload only a single file at a time.
-   The links provided after the successful file upload include a download link, which can download the file immediately, and a shareable link which allows the user to easily share the file at a fraction of the original filesize. The shareable link, when clicked, will lead to the original file being downloaded.
-   The process involved in the process of uploading and fetching the file is as follows:
    -   The [multer package](https://www.npmjs.com/package/multer) is configured to accept file uploads with the configuration specified earlier. Further, [the multer-s3 package](https://www.npmjs.com/package/multer-s3) is used handle AWS S3 bucket file transaction.
    -   The file is uploaded to a S3 bucket and the returned object's file location, file mimetype, key and file name are stored in a mongoDB collection using the MongoDB Atlas cloud database.
    -   To fetch the file for download, the file key is fetched from the mongoDB collection and the corresponding file object is fetched from the S3 storage.
    -   In order to download the file [downloadjs](https://www.npmjs.com/package/downloadjs) package is used and the buffer array is first converted in to an uInt8array.
    -   The shareable link sends the user to another page of the app with the file ID(mongoDB object \_id) as part of the params, the same process is followed to download the file once the linked is clicked at any time.
-   The mongoDB objects have a TTL(time-to-live) set to 15 days, therefore the links obtained after file upload are valid only for 15 days from the time of file upload.
-   The files can be uploaded to the client-side using the drad-and-drop feature implemented using [react-dropzone](https://www.npmjs.com/package/react-dropzone).
-   The UI framework used is [materializecss](https://materializecss.com/) and the icons have been taken from [line icons](https://lineicons.com/icons/).
-   The UI is very straight-forward and the emphasis on the ease of usage is prominent

## Challenges faced

There were a few challenges that came up during the development of the application. In this section, I aim to clarify my approach in overcoming these challeges, as a way to help you understand the code better, in case you decide to dive in!

### Handling files in Node.js

Although the process of configuring multer is not that difficult, it was a challenge to understand the complete requirements. The intial configuration stored the files on the local machine,even after file upload was succssful. But in order to deploy the application using a remote web server(either through a custom ubuntu AWS server or using a PaaS like Heroku or Dokku) it was important to not use the server's storage to handle the file storage as they are usually unreliable or expensive. The solution to this issue was to use the AWS S3 Storage to store all the file objects and to only store the unique file key and corresponding details in the mongoDB collection. This allows us to have a larger file limit even on the free tier of S3 storage, since the other alternatives included implementing file storage in mongoDB itself using [GridFS](https://docs.mongodb.com/manual/core/gridfs/). The [the multer-s3 package](https://www.npmjs.com/package/multer-s3) along with multer make it very easy to setup a S3 bucket along with an [Express.js](https://expressjs.com/) server for the application. In the frontend, a drag-and-drop feature has also been used to upload files using the [react-dropzone](https://www.npmjs.com/package/react-dropzone) node package. It must be noted that in order to setup the S3 bucket along with the multer-s3 package, the CORS permission of the bucket must be set such that it allows all origins and headers to access the file objects through GET, POST, PUT and DELETE requests.

### Setting up a shareable link for file download

Once the file has successfully been uploaded to the S3 storage, the app needs to provide 2 links to the user. A link to download the file immediately, and a link to share the uploaded file. Althought S3 storage provides a file URL to download the file directly, the file name usually has a date/time associated with it and the same filename is followed for the downloaded file as well. To Download the file immediately after file upload (which is assumed to be rare usage), an API call is made to the server using a GET request along with the correct file id. This API route is configured to return the MongoDB object corresponding to that file and the S3 object corresponding to this file. The S3 object contains a buffer array of the file, that needs to be converted into a [UInt8Array](https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer) so that the [downloadjs](https://www.npmjs.com/package/downloadjs) package can be used to trigger file download with the original filename instead of the S3 object's file key.

In order to generate the shareable link, a seperate route is setup in the React app's App.js with the path being exact. The path has a parameter that corresponds to the \_id of the mongoDB document for the particular file. The API call is made to GET the S3 object and the mongoDB object for the required file and the file is automaticaaly downloaded using the same procedure as mentioned in the previous paragraph. Here too, the buffer array is first converted into the appropriate format to trigger downloadjs's action. Once the download is complete, the app redirects to the home page. In case a user tries to access the shared link after 15 days, a 404 error page is catch-all page.

## Potential Improvements

-   Allowing multiple file uploads simultaneously.
-   Setting up a payment gateway to allow file uploads of upto a 100MB size limit.
-   A user authentication setup to implement the payment gateway.
-   File storage for upto a year/more, upon the payment of a nominal charge.
-   GSAP animations for better UX.
-   A dashboard for registered users.
-   UI refactor to deal with longer file upload durations.

Any more suggestions are always welcome in the PRs!

## Technologies Used

Some of the technologies used in the development of this web application are as follow:

-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): It provides a free cloud service to store MongoDB collections.
-   [React.js](https://reactjs.org/): A JavaScript library for building user interfaces. In particular, React hooks are used in the clientside of the application
-   [Node.js](https://nodejs.org/en/): A runtime environment to help build fast server applications using JS.
-   [Express.js](https://expressjs.com/): A popular Node.js framework to build scalable server-side for web applications.
-   [Mongoose](https://mongoosejs.com/): An ODM(Object Data Modelling)library for MongoDB and Node.js
-   [Heroku](http://heroku.com/): A platform(PaaS) to deploy full stack web applications for free.
-   [Multer](https://www.npmjs.com/package/multer) and [Multer-S3](https://www.npmjs.com/package/multer-s3): Node.js packages that help in dealing with file uploads.
-   [AWS S3 Storage Bucket](https://aws.amazon.com/s3/): An object storage service that offers industry-leading scalability, data availability, security, and performance.
-   [Materialize CSS](https://materializecss.com/): A modern responsive front-end framework based on Material Design, built by Google.
