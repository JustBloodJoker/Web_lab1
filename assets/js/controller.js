const RegisterController = {
  init: function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", this.handleSubmit);
  },

  handleSubmit: function (event) {
      event.preventDefault();
    
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const gender = document.getElementById("gender").value;
      const birthdate = document.getElementById("birthdate").value;
    
      if (!name || !email || !password || gender === "Виберіть стать" || !birthdate) {
        RegisterView.showAlert("Будь ласка, заповніть всі поля.");
        return;
      }
    
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        gender,
        birthdate
      };
    
      const success = UserModel.saveUser(newUser);
      if (success) {
        RegisterView.showAlert("Реєстрація успішна! Тепер ви можете увійти.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        RegisterView.showAlert("Користувач з таким email вже існує.");
      }
    }
};

const LoginController = {
  init: function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", this.handleLogin);
  },

  handleLogin: function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      LoginView.showAlert("Будь ласка, заповніть всі поля.");
      return;
    }

    const user = UserModel.loginUser(email, password);
    if (user) {
      Auth.setCurrentUser(user)
      
      LoginView.showAlert("Успішний вхід! Перенаправлення...", "success");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);
    } else {
      LoginView.showAlert("Невірний email або пароль.");
    }
  }
};

const ProfileController = {
  init: function () {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
      alert("Будь ласка, увійдіть у свій акаунт.");
      window.location.href = "login.html";
      return;
    }

    ProfileView.render(currentUser);

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", this.handleLogout);
  },

  handleLogout: function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
};

const CreatePostController = {
  init() {
    const form = document.getElementById("create-post-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("post-title").value.trim();
      const content = document.getElementById("post-content").value.trim();
      
      const loggedInUser = Auth.getCurrentUser();
      const author = loggedInUser ? loggedInUser.name : "Анонім";
      const date = new Date().toLocaleDateString("uk-UA");

      if (!title || !content) return alert("Будь ласка, заповніть всі поля");

      const postId = Date.now().toString();
      const newPost = {
        id: postId,
        title,
        content,
        author,
        date
      };

      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      posts.push(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));

      window.location.href = `post.html?id=${postId}`;
    });
  }
};
const BlogController = {
  init: function () {
    const posts = PostModel.getPosts();
    BlogView.renderPosts(posts);
  },
};

const PostController = {
  init() {
    const postId = new URLSearchParams(window.location.search).get("id");
    const post = PostModel.getPostById(postId);
    if (!post) {
      PostView.renderPostNotFound();
      return;
    }

    const currentUser = Auth.getCurrentUser();
    const isAuthor = currentUser && post.author === currentUser.name;

    PostView.renderPost(post, isAuthor);
    PostView.bindPostActions(postId, isAuthor);

    const comments = PostModel.getCommentsForPost(postId);
    PostView.renderComments(comments, currentUser, postId);
    this.bindCommentForm(postId);
  },

  bindCommentForm(postId) {
    const form = document.getElementById("comment-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const text = document.getElementById("comment").value.trim();
      if (!text) return;

      const currentUser = Auth.getCurrentUser();
      const comment = {
        author: currentUser ? currentUser.name : "Анонім",
        text,
        date: new Date().toLocaleDateString("uk-UA")
      };
      PostModel.saveComment(postId, comment);
      form.reset();
      PostView.renderComments(PostModel.getCommentsForPost(postId), currentUser, postId);
    });
  },

  showEditPostForm(postId) {
    const post = PostModel.getPostById(postId);
    if (!post) return;

    PostView.renderEditPostForm(post);
    document.getElementById("edit-post-form").addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("edit-title").value.trim();
      const content = document.getElementById("edit-content").value.trim();
      if (!title || !content) return alert("Заповніть всі поля");

      PostModel.updatePost(postId, { title, content });
      location.reload();
    });
  },

  editComment(postId, index) {
    const comments = PostModel.getCommentsForPost(postId);
    const comment = comments[index];
    PostView.renderEditCommentForm(comment, index);
    PostView.bindEditCommentActions(postId, index);
  },

  saveEditedComment(postId, index, newText) {
    const comments = PostModel.getCommentsForPost(postId);
    comments[index].text = newText;
    PostModel.updateComment(postId, index, comments[index]);
    PostView.renderComments(comments, Auth.getCurrentUser(), postId);
  },

  deletePost(postId) {
    Modal.showConfirm("Ви впевнені, що хочете видалити пост?", () => {
      PostModel.deletePost(postId);
      window.location.href = "blog.html";
    });
  },
  
  deleteComment(postId, index) {
    Modal.showConfirm("Видалити коментар?", () => {
      PostModel.deleteComment(postId, index);
      const comments = PostModel.getCommentsForPost(postId);
      PostView.renderComments(comments, Auth.getCurrentUser(), postId);
    });
  }
};


const NavigationController = {
  init: function () {
    const currentUser = Auth.getCurrentUser();
    const profileLink = document.querySelector("a[href='profile.html']");
    const loginLink = document.querySelector("a[href='login.html']");
    const registerLink = document.querySelector("a[href='register.html']");

    if (currentUser) {
      if (profileLink) profileLink.style.display = "block";
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
    } else {
      if (profileLink) profileLink.style.display = "none";
      if (loginLink) loginLink.style.display = "block";
      if (registerLink) registerLink.style.display = "block";
    }
  }
};