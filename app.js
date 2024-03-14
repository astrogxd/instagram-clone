class App {
  constructor() {
    this.userId = "";
    this.ui = new firebaseui.auth.AuthUI(auth);

    /**----------------------------------------------------------- */
    //screens and modal divs
    this.myAuth = document.querySelector("#firebaseui-auth-container");
    this.app = document.querySelector("#main-app-content");

    this.upload = document.querySelector("#upload-screen");
    this.editModal = document.querySelector("#edit-modal");

    //log out button
    // this.logout = document.querySelector('#logout');

    /**------------------------------Upload screen ----------------------------------------- */

    //upload button
    // this.uploadButton = document.querySelector('#upload-button');

    //post button
    this.post = document.querySelector("#Upload");

    //Update Button
    this.updatebutton = document.querySelector("#update-button");

    /**----------------------------------------------------------------------- */

    // Modal menu tabs
    this.modaliterms = document.getElementsByClassName("modal-tabs");

    /**---------------- //Modal buttons------------------ */

    //edit button
    this.edit = document.querySelector("#editButton");

    //delete button
    this.delete = document.querySelector("#deleteButton");

    /**------------------------------------------------------- */

    this.handleAuth();
    this.handleDataPopulation();

    //sign out button
    this.signOut = document.querySelector("#logoutButton");
    this.signOut.addEventListener("click", () => {
      this.handleLogout();
    });

    this.create = document.querySelector(".create");
    //upload button event listener calls the screen only
    this.create.addEventListener("click", () => {
      this.Update = document.querySelector("#update").style.display = "none";

      const imageSelectIcon = document.querySelector(".button");
      imageSelectIcon.style.display = "block";

      const imageUpdate = document.querySelector(".updateImage");
      imageUpdate.style.display = "none";

      this.uploadScreen();
      this.handelmageSelect();
    });
    // this.uploadDiv = document.querySelector('.ps')
    // this.uploadDiv.addEventListener('click',()=>{
    //   this.redirectToApp();
    // })

    //post button event listener uploads the information
    this.post.addEventListener("click", () => {
      //this.handleUpload(this.fileName,this.files[0])

      this.handleSipleUpload();
    });

    this.profileButton = document.querySelector("#profile");

    this.profileButton.addEventListener("click", () => {
      this.profileScreen = document.querySelector(
        "#profilescren"
      ).style.display = "block";
      this.mainScreen = document.querySelector(".content").style.display =
        "none";
      this.handleOwnPostView();
    });

    this.homeButton = document.querySelector(".home");
    this.homeButton.addEventListener("click", () => {
      this.profileScreen = document.querySelector(
        "#profilescren"
      ).style.display = "none";
      this.mainScreen = document.querySelector(".content").style.display =
        "block";
    });
  }

  handelmageSelect() {
    //Image select button
    const imageSelect = document.querySelector(".ImageSelect");

    imageSelect.addEventListener("click", () => {
      this.selectedImage = document.createElement("input");
      this.selectedImage.type = "file";

      this.selectedImage.onchange = (e) => {
        const reader = new FileReader();

        this.files = e.target.files;
        this.imagearray = [];
        this.imagearray.push(this.files[0]);

        for (const file of this.files) {
          this.fileName = file.name;
          console.log(this.fileName);
        }

        reader.addEventListener("load", () => {
          var uploaded_image = reader.result;
          //Image display
          const imageDisplay = document.querySelector(".imageDisplay");
          imageDisplay.style.backgroundImage = `url(${uploaded_image})`;

          // make the image select icon go away when the picture is rendered//
          const imageSelectIcon = document.querySelector(".button");
          imageSelectIcon.style.display = "none";
        });
        reader.readAsDataURL(this.files[0]);
      };

      this.selectedImage.click();
    });

    // const selectedMedia = document.querySelector('#upload-image');
    // selectedMedia.addEventListener("change",(e)=>{

    //   const reader = new FileReader();

    //    this.files = e.target.files;

    //   for (const file of this.files) {

    //     this.fileName = file.name;
    //     console.log(this.fileName)

    //   }

    //   reader.addEventListener("load", () =>{

    //     var uploaded_image = reader.result;
    //     const imageview = document.querySelector('#display').style.backgroundImage = `url(${uploaded_image})`
    //   });
    //   reader.readAsDataURL(this.files[0]);

    // });
  }

  handleAuth() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.userName = user.displayName;
        this.redirectToApp();
        this.handleUsername();
      } else {
        this.redirectToAuth();
      }
    });
  }

  handleUsername() {
    const displayname = document.querySelector(".username");
    const nametag = document.querySelector(".name");
    const usernameProfile = document.querySelector(
      ".username-profile-tab-name"
    );
    const secondusernameProfile = document.querySelector(".name-profile");

    displayname.textContent = this.userName;
    nametag.textContent = this.userName;
    usernameProfile.textContent = this.userName;
    secondusernameProfile.textContent = this.userName;
  }

  redirectToApp() {
    this.myAuth.style.display = "none";
    this.app.style.display = "block";
    this.upload.style.display = "none";
    this.profileScreen = document.querySelector("#profilescren").style.display =
      "none";
    this.mainScreen = document.querySelector(".content").style.display =
      "block";
    this.uploadDiv = document.querySelector(".ps").style.display = "none";
  }

  redirectToAuth() {
    this.myAuth.style.display = "block";
    this.app.style.display = "none";
    this.upload.style.display = "none";

    this.ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.userId = authResult.user.uid;
          this.$authUserText.innerHTML = user.displayName;
          this.redirectToApp();
        },
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      // Other config options...
    });
  }

  handleLogout() {
    auth
      .signOut()
      .then(() => {
        this.redirectToAuth();
      })
      .catch((error) => {
        console.log("ERROR OCCURED", error);
      });
  }

  handleSipleUpload() {
    //Reff
    var storageRef = firebase.storage().ref();
    //var mountainsRef = storageRef.child('mountains.jpg');
    const mountainImagesRef = storageRef.child("images/" + this.fileName);

    // 'file' comes from the Blob or File API
    mountainImagesRef.put(this.files[0]).then((snapshot) => {
      mountainImagesRef.getDownloadURL().then((url) => {
        //Caption
        const caption = document.querySelector("#caption");

        var Post = db.collection("Users");

        Post.add({
          UserPostId: this.userId,
          PostUserName: this.userName,
          Name: caption.value,
          Link: url,
        });

        console.log("Uploaded a blob or file!");

        this.redirectToApp();
        this.handleRefresh();
      });
    });
  }

  handleUpdateUpload(id) {
    //Reff
    var storage = firebase.storage().ref();
    //var mountainsRef = storageRef.child('mountains.jpg');
    var ImagesRef = storage.child("images/" + this.fileName);

    if (this.selectedToUpdateImage) {
      // 'file' comes from the Blob or File API
      ImagesRef.put(this.selectedToUpdateImage.files[0]).then((snapshot) => {
        console.log("Uploaded a blob or file!");

        ImagesRef.getDownloadURL().then((url) => {
          var toBeUpdated = db.collection("Users").doc(id);

          //Caption
          const caption = document.querySelector("#caption");

          toBeUpdated
            .update({
              Link: url,
              Name: caption.value,
            })

            .then(() => {
              alert("Document successfully updated!");

              this.handleRefresh();
            })
            .catch((error) => {
              alert("Error updating document: ", error);
            });
        });
      });
    } else {
      //Caption
      const caption = document.querySelector("#caption");
      var toBeUpdated = db.collection("Users").doc(id);
      toBeUpdated
        .update({
          Name: caption.value,
        })
        .then(() => {
          alert("Document successfully updated!");
          this.handleRefresh();
        })
        .catch((error) => {
          alert("Error updating document: ", error);
        });
    }
  }

  handleRead(Dataid) {
    var docRef = db.collection("Users").doc(Dataid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.imgLink = doc.data().Link;
          this.caption = doc.data().Name;
        } else {
          console.log("No such document!" + this.userId);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  handleDataPopulation() {
    db.collection("Users").onSnapshot((docs) => {
      docs.forEach((doc) => {
        this.handlePost(doc);
      });
    });
  }

  handleOwnPostView() {
    db.collection("Users")
      .where("UserPostId", "==", this.userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.handleMyPostList(doc);
        });
      });
  }

  handleDelete(id) {
    var DeletedocRef = db.collection("Users").doc(id);

    DeletedocRef.delete()
      .then(() => {
        alert("Document successfully deleted!");
        console.log("Document successfully deleted!");
        this.handleRefresh();
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      });
  }

  handleModalcall(id) {
    //if the post id belongs to the same user uid and the same one currently logged in
    if (this.userId == id) {
      //console.log(this.userId)

      // But first set the edit and delete menu tabs RED and visiable

      this.edit.style.color = "Red";
      this.delete.style.color = "Red";
      this.editModal.style.display = "block";
    } else {
      //display the menu tab without the two menu tabs

      this.edit.style.display = "none";
      this.delete.style.display = "none";
      this.editModal.style.display = "block";
    }
  }

  uploadScreen() {
    this.myAuth.style.display = "none";
    this.app.style.display = "none";
    this.upload.style.display = "block";
    this.uploadDiv = document.querySelector(".ps").style.display = "block";
  }

  handleImageRetrieve() {
    //Image display
    const imageDisplay = document.querySelector(".imageDisplay");
    imageDisplay.style.backgroundImage = `url(${this.imgLink})`;

    //Caption
    const caption = document.querySelector("#caption");
    caption.setAttribute("value", this.caption);
  }

  handlePost(doc) {
    //****************************************** */
    //  ---------Global Variables------------

    const UserName = doc.data().PostUserName;
    const name = "Ngceb'enhle Shabangu";

    //****************************************** */

    /** Start */

    /**------------------------------------------------------------- Layer 0------------------------------------------------ */

    //Main Posts Housing everthing to be appended into Posts.

    var posts = document.getElementById("pts");

    //Individual Post creation Start

    let post = document.createElement("div");
    post.setAttribute("class", "post");
    post.setAttribute("id", doc.id);
    //set id to be the document id
    //post.setAttribute('id',doc.id);

    //adding the individual post div into the Post collection div
    posts.appendChild(post);

    /**------------------------------------------------------------- Layer 1------------------------------------------------ */

    //****************************************** */
    // Elements/divs inside of The Post div

    //header div

    let header = document.createElement("div");
    header.setAttribute("class", "header");
    post.appendChild(header);

    //Body div

    let body = document.createElement("div");
    body.setAttribute("class", "body");
    post.appendChild(body);

    //Footer div

    let footer = document.createElement("div");
    footer.setAttribute("class", "footer");
    post.appendChild(footer);

    //Add Comments div

    let addComments = document.createElement("div");
    addComments.setAttribute("class", "add-comment");
    post.appendChild(addComments);

    /**--------------------------------------------------------------Layer 2----------------------------------------------- */

    //****************************************** */
    // Elements/divs inside of The header div

    // Profile-area
    let profileArea = document.createElement("div");
    profileArea.setAttribute("class", "profile-area");
    header.appendChild(profileArea);

    // Options
    let options = document.createElement("div");
    options.setAttribute("class", "options");
    header.appendChild(options);

    //*********************************************** */
    // Elements/divs inside of The Body div

    //Body Image
    let mainImageContent = document.createElement("img");
    mainImageContent.setAttribute("src", doc.data().Link);
    setAttribute(mainImageContent, {
      alt: "Photo by Jay Shetty on September 12, 2020. Image may contain: 2 people.",
      class: "FFVAD",
      decoding: "auto",
      sizes: "614px",
      style: "object-fit: cover",
    });

    //set multiple attributes with a fuction
    body.appendChild(mainImageContent);

    //*********************************************** */
    // Elements/divs inside of The Footer div

    //User Actions

    let userActions = document.createElement("div");
    userActions.setAttribute("class", "user-actions");
    footer.appendChild(userActions);

    //Likes

    let likesstring = `Liked by <b>${name}.b</b> and <b>others</b>`;

    let likes = document.createElement("span");
    likes.setAttribute("class", "likes");
    likes.innerHTML = likesstring;
    footer.appendChild(likes);

    //caption

    let caption = document.createElement("span");
    caption.setAttribute("class", "caption");
    footer.appendChild(caption);

    //comments

    let comments = document.createElement("span");
    comments.setAttribute("class", "comment");
    footer.appendChild(comments);

    //Posted Time

    var timePosted = "5 hours";

    let postedTime = document.createElement("span");
    postedTime.setAttribute("class", "posted-time");
    postedTime.innerText = timePosted;
    footer.appendChild(postedTime);

    //*********************************************** */
    // Elements/divs inside of The Add Comments div

    //Comment Input Field

    let commentInput = document.createElement("input");
    commentInput.setAttribute("placeholder", "Add a comment...");
    // save the input value to the database
    addComments.appendChild(commentInput);

    //Comment Input Field

    let postButton = document.createElement("a");
    postButton.setAttribute("class", "post-btn");
    // add an onclick EventListener to save the comment
    addComments.appendChild(postButton);

    /**--------------------------------------------------------------Layer 3----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Profile-area div

    //Profile Pic div

    let profilePic = document.createElement("div");
    profilePic.setAttribute("class", "post-pic");
    profileArea.appendChild(profilePic);

    //Profile Name

    let profileName = document.createElement("span");
    profileName.setAttribute("class", "profile-name");
    profileName.textContent = UserName; //--------------------------Get correct and Corrosponding Name------//

    profileArea.appendChild(profileName);

    //*********************************************** */
    // Elements/divs inside of The Options div

    //More options icon

    let moreOptios = document.createElement("div");
    setAttribute(moreOptios, {
      class: "Igw0E rBNOH YBx95 _4EzTm",
      style: "height: 24px",
      style: "width: 24px",
    });
    options.appendChild(moreOptios);

    //*********************************************** */
    // Elements/divs inside of The User Actions div

    //Like Comment and Share

    let likeCommentShare = document.createElement("div");
    likeCommentShare.setAttribute("class", "like-comment-share");
    userActions.appendChild(likeCommentShare);

    //bookmark

    let bookmark = document.createElement("div");
    bookmark.setAttribute("class", "bookmark");
    userActions.appendChild(bookmark);

    //*********************************************** */
    // Elements/divs inside of The Caption div

    let captionUsername = document.createElement("span");
    captionUsername.setAttribute("class", "caption-username");
    captionUsername.innerHTML = `<b>${UserName}</b>`; //---------------------------Get correct and corrosponding Name------------//
    caption.appendChild(captionUsername);

    let captionText = document.createElement("span");
    captionText.setAttribute("class", "caption-text");
    captionText.textContent = " " + doc.data().Name; //-----------------------------Get correct and corrosponding caption------------//
    caption.appendChild(captionText);

    //*********************************************** */
    // Elements/divs inside of The Comments div
    //comments

    let commenterUsername = document.createElement("span");
    commenterUsername.setAttribute("class", "caption-username");
    commenterUsername.innerHTML = `<b>${name}</b>`; //---------------------------Get correct and corrosponding Name------------//
    comments.appendChild(commenterUsername);

    let commenterText = document.createElement("span");
    commenterText.setAttribute("class", "caption-text");
    commenterText.textContent = " " + "Fire Fire"; //-----------------------------Get correct and corrosponding comment------------//
    comments.appendChild(commenterText);

    /**--------------------------------------------------------------Layer 4----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Profile Pic div

    //Profile Image

    let profileImage = document.createElement("img");
    setAttribute(profileImage, {
      alt: "jayshetty's profile picture",
      class: "_6q-tv",
      "data-testid": "user-avatar",
      draggable: "false",
      src: "assets/akhil.png",
    });
    //profileImage.setAttribute('class','caption-text');
    profilePic.appendChild(profileImage);

    //*********************************************** */
    var id = post.getAttribute("id");
    //e.target.parentElement.getAtt
    //*********************************************** */

    //*********************************************** */
    // Elements/divs inside of The More options icon div

    let moreIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(moreIcon, {
      id: "moreOptions",
      "aria-label": "More options",
      class: "_8-yf5",
      fill: "#262626",
      height: "16",
      viewBox: "0 0 48 48",
      width: "16",
    });
    moreIcon.addEventListener("click", () => {
      this.handleModalcall(doc.data().UserPostId);
      this.handleRead(doc.id);

      this.edit.addEventListener("click", () => {
        this.uploadScreen();
        this.handleImageRetrieve();
        this.handelmageSelect();

        const imageSelectIcon = document.querySelector(".button");
        imageSelectIcon.style.display = "none";

        this.imageDisplayToChange = document.querySelector("#toUpdateImage");

        this.imageDisplayToChange.addEventListener("click", () => {
          this.selectedToUpdateImage = document.createElement("input");
          this.selectedToUpdateImage.type = "file";

          this.selectedToUpdateImage.onchange = (e) => {
            const reader = new FileReader();

            this.files = e.target.files;

            for (const file of this.files) {
              this.fileName = file.name;
              console.log(this.fileName);
            }

            reader.addEventListener("load", () => {
              var uploaded_image = reader.result;
              //Image display

              this.imageDisplay = document.querySelector(".imageDisplay");
              this.imageDisplay.style.backgroundImage = `url(${uploaded_image})`;

              this.imageDisplayToChangediv =
                document.querySelector(".updateImage");
              this.imageDisplayToChangediv.style.display = "none";
            });
            reader.readAsDataURL(this.files[0]);
          };

          this.selectedToUpdateImage.click();
        });

        this.post.style.display = "none";
        // this.updatebutton.style.display = "block";
        this.editModal.style.display = "none";

        // Update button
        this.Update = document.querySelector("#update");
        this.Update.addEventListener("click", () => {
          this.handelmageSelect();
          this.handleUpdateUpload(doc.id);
        });
      });

      this.delete.addEventListener("click", (e) => {
        this.handleDelete(id);
      });

      var close = document.getElementById("modalClose");
      close.addEventListener("click", () => {
        this.editModal.style.display = "none";
      });
    });
    const modalFrame = document.querySelector("#edit-modal");
    modalFrame.addEventListener("click", () => {
      this.editModal.style.display = "none";
    });
    moreOptios.appendChild(moreIcon);

    //*********************************************** */
    // Elements/divs inside of The Like Comment and Share div

    //Like Icon

    let likeIcon = document.createElement("div");
    likeCommentShare.appendChild(likeIcon);

    //Comment Icon

    let commentIcon = document.createElement("div");
    commentIcon.setAttribute("class", "margin-left-small");
    likeCommentShare.appendChild(commentIcon);

    //Share Icon

    let shareIcon = document.createElement("div");
    shareIcon.setAttribute("class", "margin-left-small");
    likeCommentShare.appendChild(shareIcon);

    //*********************************************** */
    // Elements/divs inside of The More options icon div

    //bookmark  Icon

    let bookmarkIconContainer = document.createElement("div");
    bookmarkIconContainer.setAttribute("class", "QBdPU rrUvL");
    bookmark.appendChild(bookmarkIconContainer);

    /**--------------------------------------------------------------Layer 5----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The More options icon Element

    // Circle 1X

    let moreIconCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle, {
      cx: 8,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    // Circle 2X

    let moreIconCircle2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle2, {
      cx: 24,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    // Circle 3X

    let moreIconCircle3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle3, {
      cx: 40,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    moreIcon.appendChild(moreIconCircle);
    moreIcon.appendChild(moreIconCircle2);
    moreIcon.appendChild(moreIconCircle3);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Like Icon Span

    let likeIconSpan = document.createElement("span");
    likeIcon.appendChild(likeIconSpan);

    //*********************************************** */
    // Elements/divs inside of The comment Icon  Element

    //Comment Icon

    let commentIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(commentIconSvg, {
      "aria-label": "Comment",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });

    commentIcon.appendChild(commentIconSvg);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Share Icon

    let shareIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(shareIconSvg, {
      "aria-label": "Share Post",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    shareIcon.appendChild(shareIconSvg);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //bookmark icon

    let bookmarkIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(bookmarkIconSvg, {
      "aria-label": "Save",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    bookmarkIconContainer.appendChild(bookmarkIconSvg);

    /**--------------------------------------------------------------Layer 6----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Like Icon Svg

    let likeIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(likeIconSvg, {
      "aria-label": "Like",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    //likeIconSvg.style.backgroundColor = "#dd2c00";

    //set multiple attributes with a fuction
    likeIconSpan.appendChild(likeIconSvg);

    //*********************************************** */
    // Elements/divs inside of The comment Icon Path  Element

    //Comment Icon Path

    let commentIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    setAttribute(commentIconSvgPath, {
      "clip-rule": "evenodd",
      d: "M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z",
      "fill-rule": "evenodd",
    });
    commentIconSvg.appendChild(commentIconSvgPath);

    //*********************************************** */
    // Elements/divs inside of The Like Icon Path  Element

    //Share Icon Path

    let shareIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    shareIconSvgPath.setAttribute(
      "d",
      "M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"
    );
    shareIconSvg.appendChild(shareIconSvgPath);

    //*********************************************** */
    // Elements/divs inside of The Like Icon Path Element

    //bookmark icon

    let bookmarkIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    bookmarkIconSvgPath.setAttribute(
      "d",
      "M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
    );
    bookmarkIconSvg.appendChild(bookmarkIconSvgPath);

    /**--------------------------------------------------------------Layer 7----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    let likeIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    likeIconSvgPath.setAttribute(
      "d",
      "M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
    );
    likeIconSvg.appendChild(likeIconSvgPath);

    /**--------------------------------------------------------------The End Of Creation ----------------------------------------------- */

    /**--------------------------------------------------------------Functions----------------------------------------------- */

    function setAttribute(el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }

    /**--------------------------------------------------------------Buttons Actions----------------------------------------------- */
  }

  handleRefresh() {
    setTimeout(function () {
      window.location.reload();
    }, 4000);

    this.redirectToApp();
  }

  handleMyPostList(doc) {
    //****************************************** */
    //  ---------Global Variables------------

    const UserName = doc.data().PostUserName;
    const name = "Ngceb'enhle Shabangu";

    //****************************************** */

    /** Start */

    /**------------------------------------------------------------- Layer 0------------------------------------------------ */

    //Main Posts Housing everthing to be appended into Posts.

    var posts = document.getElementById("ownPost");

    //Individual Post creation Start

    let post = document.createElement("div");
    post.setAttribute("class", "post");
    post.setAttribute("id", doc.id);
    //set id to be the document id
    //post.setAttribute('id',doc.id);

    //adding the individual post div into the Post collection div
    posts.appendChild(post);

    /**------------------------------------------------------------- Layer 1------------------------------------------------ */

    //****************************************** */
    // Elements/divs inside of The Post div

    //header div

    let header = document.createElement("div");
    header.setAttribute("class", "header");
    post.appendChild(header);

    //Body div

    let body = document.createElement("div");
    body.setAttribute("class", "body");
    post.appendChild(body);

    //Footer div

    let footer = document.createElement("div");
    footer.setAttribute("class", "footer");
    post.appendChild(footer);

    //Add Comments div

    let addComments = document.createElement("div");
    addComments.setAttribute("class", "add-comment");
    post.appendChild(addComments);

    /**--------------------------------------------------------------Layer 2----------------------------------------------- */

    //****************************************** */
    // Elements/divs inside of The header div

    // Profile-area
    let profileArea = document.createElement("div");
    profileArea.setAttribute("class", "profile-area");
    header.appendChild(profileArea);

    // Options
    let options = document.createElement("div");
    options.setAttribute("class", "options");
    header.appendChild(options);

    //*********************************************** */
    // Elements/divs inside of The Body div

    //Body Image
    let mainImageContent = document.createElement("img");
    mainImageContent.setAttribute("src", doc.data().Link);
    setAttribute(mainImageContent, {
      alt: "Photo by Jay Shetty on September 12, 2020. Image may contain: 2 people.",
      class: "FFVAD",
      decoding: "auto",
      sizes: "614px",
      style: "object-fit: cover",
    });

    //set multiple attributes with a fuction
    body.appendChild(mainImageContent);

    //*********************************************** */
    // Elements/divs inside of The Footer div

    //User Actions

    let userActions = document.createElement("div");
    userActions.setAttribute("class", "user-actions");
    footer.appendChild(userActions);

    //Likes

    let likesstring = `Liked by <b>${name}.b</b> and <b>others</b>`;

    let likes = document.createElement("span");
    likes.setAttribute("class", "likes");
    likes.innerHTML = likesstring;
    footer.appendChild(likes);

    //caption

    let caption = document.createElement("span");
    caption.setAttribute("class", "caption");
    footer.appendChild(caption);

    //comments

    let comments = document.createElement("span");
    comments.setAttribute("class", "comment");
    footer.appendChild(comments);

    //Posted Time

    var timePosted = "5 hours";

    let postedTime = document.createElement("span");
    postedTime.setAttribute("class", "posted-time");
    postedTime.innerText = timePosted;
    footer.appendChild(postedTime);

    //*********************************************** */
    // Elements/divs inside of The Add Comments div

    //Comment Input Field

    let commentInput = document.createElement("input");
    commentInput.setAttribute("placeholder", "Add a comment...");
    // save the input value to the database
    addComments.appendChild(commentInput);

    //Comment Input Field

    let postButton = document.createElement("a");
    postButton.setAttribute("class", "post-btn");
    // add an onclick EventListener to save the comment
    addComments.appendChild(postButton);

    /**--------------------------------------------------------------Layer 3----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Profile-area div

    //Profile Pic div

    let profilePic = document.createElement("div");
    profilePic.setAttribute("class", "post-pic");
    profileArea.appendChild(profilePic);

    //Profile Name

    let profileName = document.createElement("span");
    profileName.setAttribute("class", "profile-name");
    profileName.textContent = UserName; //--------------------------Get correct and Corrosponding Name------//

    profileArea.appendChild(profileName);

    //*********************************************** */
    // Elements/divs inside of The Options div

    //More options icon

    let moreOptios = document.createElement("div");
    setAttribute(moreOptios, {
      class: "Igw0E rBNOH YBx95 _4EzTm",
      style: "height: 24px",
      style: "width: 24px",
    });
    options.appendChild(moreOptios);

    //*********************************************** */
    // Elements/divs inside of The User Actions div

    //Like Comment and Share

    let likeCommentShare = document.createElement("div");
    likeCommentShare.setAttribute("class", "like-comment-share");
    userActions.appendChild(likeCommentShare);

    //bookmark

    let bookmark = document.createElement("div");
    bookmark.setAttribute("class", "bookmark");
    userActions.appendChild(bookmark);

    //*********************************************** */
    // Elements/divs inside of The Caption div

    let captionUsername = document.createElement("span");
    captionUsername.setAttribute("class", "caption-username");
    captionUsername.innerHTML = `<b>${UserName}</b>`; //---------------------------Get correct and corrosponding Name------------//
    caption.appendChild(captionUsername);

    let captionText = document.createElement("span");
    captionText.setAttribute("class", "caption-text");
    captionText.textContent = " " + doc.data().Name; //-----------------------------Get correct and corrosponding caption------------//
    caption.appendChild(captionText);

    //*********************************************** */
    // Elements/divs inside of The Comments div
    //comments

    let commenterUsername = document.createElement("span");
    commenterUsername.setAttribute("class", "caption-username");
    commenterUsername.innerHTML = `<b>${name}</b>`; //---------------------------Get correct and corrosponding Name------------//
    comments.appendChild(commenterUsername);

    let commenterText = document.createElement("span");
    commenterText.setAttribute("class", "caption-text");
    commenterText.textContent = " " + "Fire Fire"; //-----------------------------Get correct and corrosponding comment------------//
    comments.appendChild(commenterText);

    /**--------------------------------------------------------------Layer 4----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Profile Pic div

    //Profile Image

    let profileImage = document.createElement("img");
    setAttribute(profileImage, {
      alt: "jayshetty's profile picture",
      class: "_6q-tv",
      "data-testid": "user-avatar",
      draggable: "false",
      src: "assets/akhil.png",
    });
    //profileImage.setAttribute('class','caption-text');
    profilePic.appendChild(profileImage);

    //*********************************************** */
    var id = post.getAttribute("id");
    //e.target.parentElement.getAtt
    //*********************************************** */

    //*********************************************** */
    // Elements/divs inside of The More options icon div

    let moreIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(moreIcon, {
      id: "moreOptions",
      "aria-label": "More options",
      class: "_8-yf5",
      fill: "#262626",
      height: "16",
      viewBox: "0 0 48 48",
      width: "16",
    });
    moreIcon.addEventListener("click", () => {
      this.handleModalcall(doc.data().UserPostId);
      this.handleRead(doc.id);

      this.edit.addEventListener("click", () => {
        this.uploadScreen();
        this.handleImageRetrieve();
        this.handelmageSelect();

        const imageSelectIcon = document.querySelector(".button");
        imageSelectIcon.style.display = "none";

        this.imageDisplayToChange = document.querySelector("#toUpdateImage");

        this.imageDisplayToChange.addEventListener("click", () => {
          this.selectedToUpdateImage = document.createElement("input");
          this.selectedToUpdateImage.type = "file";

          this.selectedToUpdateImage.onchange = (e) => {
            const reader = new FileReader();

            this.files = e.target.files;

            for (const file of this.files) {
              this.fileName = file.name;
              console.log(this.fileName);
            }

            reader.addEventListener("load", () => {
              var uploaded_image = reader.result;
              //Image display

              this.imageDisplay = document.querySelector(".imageDisplay");
              this.imageDisplay.style.backgroundImage = `url(${uploaded_image})`;

              this.imageDisplayToChangediv =
                document.querySelector(".updateImage");
              this.imageDisplayToChangediv.style.display = "none";
            });
            reader.readAsDataURL(this.files[0]);
          };

          this.selectedToUpdateImage.click();
        });

        this.post.style.display = "none";
        // this.updatebutton.style.display = "block";
        this.editModal.style.display = "none";

        // Update button
        this.Update = document.querySelector("#update");
        this.Update.addEventListener("click", () => {
          this.handelmageSelect();
          this.handleUpdateUpload(doc.id);
        });
      });

      this.delete.addEventListener("click", (e) => {
        this.handleDelete(id);
      });

      var close = document.getElementById("modalClose");
      close.addEventListener("click", () => {
        this.editModal.style.display = "none";
      });
    });
    const modalFrame = document.querySelector("#edit-modal");
    modalFrame.addEventListener("click", () => {
      this.editModal.style.display = "none";
    });
    moreOptios.appendChild(moreIcon);

    //*********************************************** */
    // Elements/divs inside of The Like Comment and Share div

    //Like Icon

    let likeIcon = document.createElement("div");
    likeCommentShare.appendChild(likeIcon);

    //Comment Icon

    let commentIcon = document.createElement("div");
    commentIcon.setAttribute("class", "margin-left-small");
    likeCommentShare.appendChild(commentIcon);

    //Share Icon

    let shareIcon = document.createElement("div");
    shareIcon.setAttribute("class", "margin-left-small");
    likeCommentShare.appendChild(shareIcon);

    //*********************************************** */
    // Elements/divs inside of The More options icon div

    //bookmark  Icon

    let bookmarkIconContainer = document.createElement("div");
    bookmarkIconContainer.setAttribute("class", "QBdPU rrUvL");
    bookmark.appendChild(bookmarkIconContainer);

    /**--------------------------------------------------------------Layer 5----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The More options icon Element

    // Circle 1X

    let moreIconCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle, {
      cx: 8,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    // Circle 2X

    let moreIconCircle2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle2, {
      cx: 24,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    // Circle 3X

    let moreIconCircle3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ); //?????????????????????????????????????????????????
    setAttribute(moreIconCircle3, {
      cx: 40,
      cy: 24,
      r: 4.5,
      "clip-rule": "evenodd",
      "fill-rule": "evenodd",
    });

    moreIcon.appendChild(moreIconCircle);
    moreIcon.appendChild(moreIconCircle2);
    moreIcon.appendChild(moreIconCircle3);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Like Icon Span

    let likeIconSpan = document.createElement("span");
    likeIcon.appendChild(likeIconSpan);

    //*********************************************** */
    // Elements/divs inside of The comment Icon  Element

    //Comment Icon

    let commentIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(commentIconSvg, {
      "aria-label": "Comment",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });

    commentIcon.appendChild(commentIconSvg);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Share Icon

    let shareIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(shareIconSvg, {
      "aria-label": "Share Post",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    shareIcon.appendChild(shareIconSvg);

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //bookmark icon

    let bookmarkIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(bookmarkIconSvg, {
      "aria-label": "Save",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    bookmarkIconContainer.appendChild(bookmarkIconSvg);

    /**--------------------------------------------------------------Layer 6----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    //Like Icon Svg

    let likeIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    setAttribute(likeIconSvg, {
      "aria-label": "Like",
      class: "_8-yf5",
      fill: "#262626",
      height: "24",
      viewBox: "0 0 48 48",
      width: "24",
    });
    //likeIconSvg.style.backgroundColor = "#dd2c00";

    //set multiple attributes with a fuction
    likeIconSpan.appendChild(likeIconSvg);

    //*********************************************** */
    // Elements/divs inside of The comment Icon Path  Element

    //Comment Icon Path

    let commentIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    setAttribute(commentIconSvgPath, {
      "clip-rule": "evenodd",
      d: "M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z",
      "fill-rule": "evenodd",
    });
    commentIconSvg.appendChild(commentIconSvgPath);

    //*********************************************** */
    // Elements/divs inside of The Like Icon Path  Element

    //Share Icon Path

    let shareIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    shareIconSvgPath.setAttribute(
      "d",
      "M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"
    );
    shareIconSvg.appendChild(shareIconSvgPath);

    //*********************************************** */
    // Elements/divs inside of The Like Icon Path Element

    //bookmark icon

    let bookmarkIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    bookmarkIconSvgPath.setAttribute(
      "d",
      "M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
    );
    bookmarkIconSvg.appendChild(bookmarkIconSvgPath);

    /**--------------------------------------------------------------Layer 7----------------------------------------------- */

    //*********************************************** */
    // Elements/divs inside of The Like Icon  Element

    let likeIconSvgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    likeIconSvgPath.setAttribute(
      "d",
      "M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
    );
    likeIconSvg.appendChild(likeIconSvgPath);

    /**--------------------------------------------------------------The End Of Creation ----------------------------------------------- */

    /**--------------------------------------------------------------Functions----------------------------------------------- */

    function setAttribute(el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }

    /**--------------------------------------------------------------Buttons Actions----------------------------------------------- */
  }
}
new App();
