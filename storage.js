// Initialize Cloud Firestore and get a reference to the service

// initialise firestore storage
//const storage = firebase.storage();

// upload screen or page
const UploadScreen = document.getElementById("upload");

// buttons for upload page

//getting acces to the HTML input fields and all divs to be manipulated.

// adding data into the collection/ images

// images upload

// retreaving data accourding to the uid

/**
 *  Updating user information
 * Deleting data.
 * Modifying data.
 */

function blob() {
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var storageRef = storage.ref();

  // Create a child reference

  //var imagesRef = storageRef.child('Media');

  // imagesRef now points to 'images'

  // Reference's name is the last segment of the full path: 'space.jpg'
  // This is analogous to the file name
  spaceRef.name;

  db.collection("users")
    .add({
      // The users is just a table to be created you can change the name to whatever you like, e.g description table make sure you link in to the id of the correct
      // image in the images table
      Description: "Description of the image or post", // field you need to only have one for the description
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  // upload file

  // 'file' comes from the Blob or File API
  ref.put(file).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
}

// Upload file and metadata to the object 'images/mountains.jpg'

//var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

// Points to 'images'
var imagesRef = storageRef.child("images");

// Points to 'images/space.jpg'
// Note that you can use variables to create child values

this.selectedMedia.media[0] = file; //selected file midea iterm
this.description = Description; //massage of thr description from the

//when retreaving
var spaceRef = imagesRef.child(fileName);

//Actuallty uploading

// 'file' comes from the Blob or File API
ref.put(file).then((snapshot) => {
  console.log("Uploaded a blob or file!");

  // i need to get the url back here
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    console.log("File available at", downloadURL);
  });
});
