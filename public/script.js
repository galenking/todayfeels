// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCqF9nLOGE-x44WXn9EpN-Wx4WLNImiRSk",
  authDomain: "todayfeels-by-lucid.firebaseapp.com",
  databaseURL: "https://todayfeels-by-lucid.firebaseio.com",
  projectId: "todayfeels-by-lucid",
  storageBucket: "todayfeels-by-lucid.appspot.com",
  messagingSenderId: "952328118541",
  appId: "1:952328118541:web:4fb3bcaee6649348f59044",
  measurementId: "G-ZLCMRP06P7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;

    var name = document.getElementById("name");

    $( "#name" ).html(displayName.split(' ')[0]);

    $('.feelings a').click(function(item) {
         addFeeling(item);
         item.preventDefault();
    });

    var uid = firebase.auth().currentUser.uid;

    function addFeeling(item) {
      // this.preventDefault();
      // A post entry.
      var postData = {
        uid: uid,
        feeling: item.getAttribute('href').split('/').pop()
      };

      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('feelings').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/feelings/' + newPostKey] = postData;

      return firebase.database().ref().update(updates);
    }
  } else {
    // User is signed out.
    // The start method will wait until the DOM is loaded.
	  ui.start('#firebaseui-auth-container', uiConfig);
    logoutLink.style.display = 'none';
  }
  loadingScreen.style.display = 'none';
});

logoutLink.addEventListener('click', logout);

function logout() {
	firebase.auth().signOut();
}
