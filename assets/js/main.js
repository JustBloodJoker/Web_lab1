document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
  
    if (path.endsWith("register.html")) {
      RegisterController.init();
    } else if (path.endsWith("login.html")) {
      LoginController.init();
    } else if (path.endsWith("profile.html")) {
      ProfileController.init();
    } else if (path.endsWith("create-post.html")) {
      CreatePostController.init();
    } else if (path.endsWith("blog.html")) {
      BlogController.init();
    } else if (path.endsWith("post.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get("id");
      
        if (postId) {
          PostController.init(postId);
        } else {
          document.querySelector("main").innerHTML = "<p>ID поста не передано в URL.</p>";
        }
    }

    NavigationController.init();
  });

